variable "project" { type = string }
variable "region" { type = string }
variable "frontend_bucket" { type = string }
variable "images_bucket" { type = string }

resource "google_storage_bucket" "frontend" {
  name                        = var.frontend_bucket
  location                    = var.region
  project                     = var.project
  force_destroy               = false
  public_access_prevention    = "inherited"
  uniform_bucket_level_access = true
  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }
}

resource "google_storage_bucket_iam_member" "frontend_public" {
  bucket = google_storage_bucket.frontend.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

resource "google_storage_bucket" "images" {
  name                        = var.images_bucket
  location                    = var.region
  project                     = var.project
  force_destroy               = false
  public_access_prevention    = "enforced"
  uniform_bucket_level_access = true
}

output "frontend_bucket_name" {
  value = google_storage_bucket.frontend.name
}

output "images_bucket_name" {
  value = google_storage_bucket.images.name
}
