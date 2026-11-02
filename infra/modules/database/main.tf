terraform {
  required_providers {
    neon = {
      source  = "kislerdm/neon"
      version = "~> 0.13"
    }
  }
}

variable "project_name" {
  type    = string
  default = "deck-lab"
}
variable "database_name" {
  type    = string
  default = "deck-lab"
}
variable "org_id" {
  type    = string
  default = "org-cold-grass-69732618"
}
variable "region_id" {
  type    = string
  default = "aws-us-east-2"
}

resource "neon_project" "this" {
  name                      = var.project_name
  org_id                    = var.org_id
  region_id                 = var.region_id
  pg_version                = 18
  history_retention_seconds = 21600
}

resource "neon_database" "app" {
  project_id = neon_project.this.id
  branch_id  = neon_project.this.default_branch_id
  name       = var.database_name
  owner_name = neon_project.this.database_user
}

output "neon_project_id" {
  description = "Neon Project ID."
  value       = neon_project.this.id
}

output "jdbc_url" {
  description = "Pooled JDBC connection URL for serverless Spring Boot traffic (PgBouncer safe with prepareThreshold=0)."
  value       = "jdbc:postgresql://${neon_project.this.database_host_pooler}/${neon_database.app.name}?sslmode=require&reWriteBatchedInserts=true&prepareThreshold=0"
}

output "direct_jdbc_url" {
  description = "Direct (unpooled) JDBC connection URL for schema migrations and dumps."
  value       = "jdbc:postgresql://${neon_project.this.database_host}/${neon_database.app.name}?sslmode=require&reWriteBatchedInserts=true"
}

output "db_user" {
  description = "Neon PostgreSQL database owner username."
  value       = neon_project.this.database_user
}

output "db_password" {
  description = "Neon PostgreSQL database owner password."
  value       = neon_project.this.database_password
  sensitive   = true
}
