output "service_url" {
  description = "Cloud Run backend service default URI."
  value       = module.backend.service_url
}

output "api_domain_url" {
  description = "Custom domain URL mapped to the Cloud Run backend (https://api.decklab.games)."
  value       = module.backend.api_domain_url
}

output "backend_sa_email" {
  description = "Runtime service account email for the Cloud Run backend."
  value       = module.backend.backend_sa_email
}

output "neon_project_id" {
  description = "Neon Serverless PostgreSQL project ID."
  value       = module.database.neon_project_id
}

output "neon_jdbc_url" {
  description = "Neon pooled JDBC URL used by the Cloud Run backend."
  value       = module.database.jdbc_url
}

output "neon_direct_jdbc_url" {
  description = "Neon direct (unpooled) JDBC URL for migrations and backups."
  value       = module.database.direct_jdbc_url
}

output "neon_db_user" {
  description = "Neon PostgreSQL database owner username."
  value       = module.database.db_user
}

output "images_bucket_name" {
  description = "Cloudflare R2 bucket name for card images."
  value       = length(module.storage) > 0 ? module.storage[0].images_bucket_name : var.images_bucket_name
}

output "images_base_url" {
  description = "Public CDN base URL for card images served from Cloudflare R2."
  value       = "https://${var.images_domain}"
}

output "artifact_registry_repo" {
  description = "Artifact Registry Docker repository name."
  value       = module.registry.repository_id
}

output "cloudflare_pages_domain" {
  description = "Cloudflare Pages default domain (.pages.dev)."
  value       = length(module.cloudflare_dns) > 0 ? module.cloudflare_dns[0].pages_subdomain : null
}

output "cloudflare_dns_apex" {
  description = "Cloudflare DNS Apex Record"
  value       = length(module.cloudflare_dns) > 0 ? module.cloudflare_dns[0].apex_record_hostname : null
}

output "cloudflare_dns_www" {
  description = "Cloudflare DNS WWW Record"
  value       = length(module.cloudflare_dns) > 0 ? module.cloudflare_dns[0].www_record_hostname : null
}

output "cloudflare_dns_api" {
  description = "Cloudflare DNS API Record"
  value       = length(module.cloudflare_dns) > 0 ? module.cloudflare_dns[0].api_record_hostname : null
}
