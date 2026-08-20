output "lb_ip_address" {
  description = "Reserved Global Static IPv4 Address for the Load Balancer (Point Cloudflare A records here)."
  value       = module.networking.lb_ip_address
}

output "service_url" {
  description = "Cloud Run backend service URI."
  value       = module.backend.service_url
}

output "backend_sa_email" {
  description = "Runtime service account email for the Cloud Run backend."
  value       = module.backend.backend_sa_email
}

output "db_connection_name" {
  description = "Cloud SQL instance connection name (used by Cloud Run socket factory)."
  value       = module.database.connection_name
}

output "frontend_bucket_name" {
  description = "Cloud Storage bucket name for frontend static SPA assets."
  value       = module.storage.frontend_bucket_name
}

output "images_bucket_name" {
  description = "Cloud Storage bucket name for card images."
  value       = module.storage.images_bucket_name
}

output "artifact_registry_repo" {
  description = "Artifact Registry Docker repository name."
  value       = module.registry.repository_id
}

output "cloudflare_dns_apex" {
  description = "Cloudflare DNS Apex Record"
  value       = length(module.cloudflare_dns) > 0 ? module.cloudflare_dns[0].apex_record_hostname : null
}

output "cloudflare_dns_www" {
  description = "Cloudflare DNS WWW Record"
  value       = length(module.cloudflare_dns) > 0 ? module.cloudflare_dns[0].www_record_hostname : null
}
