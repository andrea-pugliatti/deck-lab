variable "project" {
  description = "Google Cloud Project ID."
  type        = string
}

variable "region" {
  description = "Default Google Cloud region for regional resources (Cloud Run, Cloud SQL)."
  type        = string
  default     = "europe-west8"
}

variable "environment" {
  description = "Deployment environment name (e.g. prod, staging)."
  type        = string
  default     = "prod"
}

variable "domain" {
  description = "Apex domain name for the application."
  type        = string
  default     = "decklab.games"
}

variable "subdomain" {
  description = "WWW / canonical subdomain for the application."
  type        = string
  default     = "www.decklab.games"
}

variable "backend_image" {
  description = "Backend container image URI. Defaults to hello container for bootstrap."
  type        = string
  default     = "gcr.io/google-samples/cloudrun/hello"
}

variable "db_user" {
  description = "PostgreSQL application username."
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "PostgreSQL application password. SENSITIVE."
  type        = string
  sensitive   = true
}

variable "db_tier" {
  description = "Cloud SQL machine tier."
  type        = string
  default     = "db-custom-2-8192"
}

variable "jwt_secret" {
  description = "Spring Security JWT signing secret key. SENSITIVE."
  type        = string
  sensitive   = true
}

variable "gemini_api_key" {
  description = "Google Gemini API key for AI generation. SENSITIVE."
  type        = string
  sensitive   = true
}

variable "cors_origins" {
  description = "Allowed CORS origins for the backend service."
  type        = string
  default     = "https://decklab.games,https://www.decklab.games"
}

variable "frontend_bucket_name" {
  description = "Globally unique Google Cloud Storage bucket name for frontend static assets."
  type        = string
  default     = "deck-lab-frontend-prod"
}

variable "images_bucket_name" {
  description = "Globally unique Google Cloud Storage bucket name for card images."
  type        = string
  default     = "deck-lab-images-prod"
}

variable "enable_cloudflare_dns" {
  description = "Whether to provision DNS records via the Cloudflare OpenTofu provider."
  type        = bool
  default     = false
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for decklab.games (if enable_cloudflare_dns is true)."
  type        = string
  default     = ""
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token with DNS Edit permissions. SENSITIVE."
  type        = string
  default     = ""
  sensitive   = true
}
