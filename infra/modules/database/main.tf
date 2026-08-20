variable "project" { type = string }
variable "region" { type = string }
variable "instance_name" { type = string }
variable "database_name" { type = string }
variable "db_user" { type = string }
variable "db_password" {
  type      = string
  sensitive = true
}
variable "tier" {
  type    = string
  default = "db-f1-micro"
}

resource "google_sql_database_instance" "this" {
  name                = var.instance_name
  database_version    = "POSTGRES_18"
  region              = var.region
  project             = var.project
  deletion_protection = true

  settings {
    tier = var.tier
    ip_configuration {
      ipv4_enabled = true
    }
    backup_configuration {
      enabled = true
    }
  }
}

resource "google_sql_database" "app" {
  name     = var.database_name
  instance = google_sql_database_instance.this.name
  project  = var.project
}

resource "google_sql_user" "app" {
  name     = var.db_user
  instance = google_sql_database_instance.this.name
  project  = var.project
  password = var.db_password
}

output "connection_name" {
  description = "Cloud SQL instance connection name."
  value       = google_sql_database_instance.this.connection_name
}

output "instance_name" {
  description = "Cloud SQL instance name."
  value       = google_sql_database_instance.this.name
}
