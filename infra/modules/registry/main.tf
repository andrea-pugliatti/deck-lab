variable "project" { type = string }
variable "region" { type = string }
variable "repository_id" { type = string }

resource "google_artifact_registry_repository" "this" {
  project       = var.project
  location      = var.region
  repository_id = var.repository_id
  format        = "DOCKER"
  cleanup_policies {
    id     = "pol"
    action = "KEEP"
    most_recent_versions {
      keep_count = 2
    }
  }
}

output "repository_id" {
  value = google_artifact_registry_repository.this.repository_id
}
