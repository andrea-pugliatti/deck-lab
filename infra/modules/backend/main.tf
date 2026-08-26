variable "project" { type = string }
variable "region" { type = string }
variable "service_name" { type = string }
variable "backend_image" { type = string }
variable "db_connection_name" { type = string }
variable "db_user" { type = string }
variable "db_password" {
  type      = string
  sensitive = true
}
variable "jwt_secret" {
  type      = string
  sensitive = true
}
variable "gemini_api_key" {
  type      = string
  sensitive = true
}
variable "images_bucket" { type = string }
variable "cors_origins" { type = string }
variable "secret_db" { type = string }
variable "secret_jwt" { type = string }
variable "secret_gemini" { type = string }

# Runtime Service Account
resource "google_service_account" "backend" {
  project      = var.project
  account_id   = "backend-runner"
  display_name = "DeckLab Backend Cloud Run Runtime SA"
}

# Secret Manager Secrets
resource "google_secret_manager_secret" "db_password" {
  secret_id = var.secret_db
  project   = var.project
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "jwt" {
  secret_id = var.secret_jwt
  project   = var.project
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "gemini" {
  secret_id = var.secret_gemini
  project   = var.project
  replication {
    auto {}
  }
}

# IAM Secret Access Grants
resource "google_secret_manager_secret_iam_member" "db_reader" {
  secret_id = google_secret_manager_secret.db_password.id
  role      = "roles/secretmanager.secretAccessor"
  member    = google_service_account.backend.member
}

resource "google_secret_manager_secret_iam_member" "jwt_reader" {
  secret_id = google_secret_manager_secret.jwt.id
  role      = "roles/secretmanager.secretAccessor"
  member    = google_service_account.backend.member
}

resource "google_secret_manager_secret_iam_member" "gemini_reader" {
  secret_id = google_secret_manager_secret.gemini.id
  role      = "roles/secretmanager.secretAccessor"
  member    = google_service_account.backend.member
}

# Cloud SQL Client Role
resource "google_project_iam_member" "cloudsql_client" {
  project = var.project
  role    = "roles/cloudsql.client"
  member  = google_service_account.backend.member
}

# Storage Admin Role for Images
resource "google_storage_bucket_iam_member" "images_admin" {
  bucket = var.images_bucket
  role   = "roles/storage.objectAdmin"
  member = google_service_account.backend.member
}

# Cloud Run v2 Service
resource "google_cloud_run_v2_service" "backend" {
  name     = var.service_name
  location = var.region
  project  = var.project

  template {
    execution_environment            = "EXECUTION_ENVIRONMENT_GEN2"
    service_account                  = google_service_account.backend.email
    max_instance_request_concurrency = 80

    annotations = {
      "run.googleapis.com/cloudsql-instances" = var.db_connection_name
      "run.googleapis.com/startup-cpu-boost"  = "true"
    }

    scaling {
      min_instance_count = 1
      max_instance_count = 20
    }

    volumes {
      name = "card-images-volume"
      gcs {
        bucket    = var.images_bucket
        read_only = false
      }
    }

    containers {
      image = var.backend_image
      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "1000m"
          memory = "2Gi"
        }
      }

      startup_probe {
        failure_threshold = 1
        period_seconds    = 240
        timeout_seconds   = 240
        tcp_socket {
          port = 8080
        }
      }

      volume_mounts {
        name       = "card-images-volume"
        mount_path = "/app/data/images"
      }

      env {
        name  = "POSTGRES_USER"
        value = var.db_user
      }
      env {
        name  = "SPRING_DATASOURCE_URL"
        value = "jdbc:postgresql:///deck-lab?cloudSqlInstance=${var.db_connection_name}&socketFactory=com.google.cloud.sql.postgres.SocketFactory"
      }
      env {
        name  = "ALLOWED_CORS_ORIGINS"
        value = var.cors_origins
      }
      env {
        name  = "IMAGE_UPLOAD_DIR"
        value = "/app/data/images"
      }
      env {
        name  = "APP_IMAGE_BUCKET"
        value = var.images_bucket
      }
      env {
        name  = "APP_SEED_CARDS"
        value = "false"
      }
      env {
        name  = "APP_SEED_USERS"
        value = "false"
      }
      env {
        name  = "COOKIE_SAME_SITE"
        value = "Lax"
      }
      env {
        name  = "JAVA_OPTS"
        value = "-XX:TieredStopAtLevel=1 -Xmx512m"
      }

      env {
        name = "POSTGRES_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.db_password.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "JWT_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.jwt.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "GEMINI_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.gemini.secret_id
            version = "latest"
          }
        }
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
      client,
      client_version,
    ]
  }
}

resource "google_cloud_run_v2_service_iam_member" "public_invoker" {
  name     = google_cloud_run_v2_service.backend.name
  location = var.region
  project  = var.project
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "service_url" {
  value = google_cloud_run_v2_service.backend.uri
}

output "backend_sa_email" {
  value = google_service_account.backend.email
}
