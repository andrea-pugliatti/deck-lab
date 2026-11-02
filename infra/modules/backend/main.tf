variable "project" { type = string }
variable "region" { type = string }
variable "service_name" { type = string }
variable "backend_image" { type = string }
variable "api_domain" {
  type    = string
  default = "api.decklab.games"
}
variable "jdbc_url" { type = string }
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
variable "images_base_url" {
  type    = string
  default = "https://images.decklab.games"
}
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

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = var.db_password
}

resource "google_secret_manager_secret" "jwt" {
  secret_id = var.secret_jwt
  project   = var.project
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "jwt" {
  secret      = google_secret_manager_secret.jwt.id
  secret_data = var.jwt_secret
}

resource "google_secret_manager_secret" "gemini" {
  secret_id = var.secret_gemini
  project   = var.project
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "gemini" {
  secret      = google_secret_manager_secret.gemini.id
  secret_data = var.gemini_api_key
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

# Cloud Run v2 Service
resource "google_cloud_run_v2_service" "backend" {
  name                = var.service_name
  location            = var.region
  project             = var.project
  deletion_protection = false

  template {
    execution_environment            = "EXECUTION_ENVIRONMENT_GEN2"
    service_account                  = google_service_account.backend.email
    max_instance_request_concurrency = 80

    annotations = {
      "run.googleapis.com/startup-cpu-boost" = "true"
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }

    containers {
      image = var.backend_image
      ports {
        container_port = 8080
      }

      resources {
        cpu_idle = true
        limits = {
          cpu    = "2000m"
          memory = "1Gi"
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

      env {
        name  = "POSTGRES_USER"
        value = var.db_user
      }
      env {
        name  = "SPRING_DATASOURCE_URL"
        value = var.jdbc_url
      }
      env {
        name  = "ALLOWED_CORS_ORIGINS"
        value = var.cors_origins
      }
      env {
        name  = "APP_IMAGE_BASE_URL"
        value = var.images_base_url
      }
      env {
        name  = "APP_SEED_CARDS"
        value = "true"
      }
      env {
        name  = "APP_SEED_DOWNLOAD_IMAGES"
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
        value = "-XX:TieredStopAtLevel=1 -Xmx512m -XX:+AutoCreateSharedArchive -XX:SharedArchiveFile=application.jsa"
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

  depends_on = [
    google_secret_manager_secret_version.db_password,
    google_secret_manager_secret_version.jwt,
    google_secret_manager_secret_version.gemini,
  ]

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

# Custom Domain Mapping
resource "google_cloud_run_domain_mapping" "api" {
  name     = var.api_domain
  location = var.region
  project  = var.project

  metadata {
    namespace = var.project
  }

  spec {
    route_name = google_cloud_run_v2_service.backend.name
  }
}

output "service_url" {
  value = google_cloud_run_v2_service.backend.uri
}

output "api_domain_url" {
  value = "https://${var.api_domain}"
}

output "backend_sa_email" {
  value = google_service_account.backend.email
}
