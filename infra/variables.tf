variable "project" {
  description = "Google Cloud Project ID."
  type        = string
}

variable "region" {
  description = "Default Google Cloud region for Cloud Run & Artifact Registry."
  type        = string
  default     = "us-central1"
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

variable "api_domain" {
  description = "Custom domain mapped to the Cloud Run backend service."
  type        = string
  default     = "api.decklab.games"
}

variable "images_domain" {
  description = "Custom domain attached to the Cloudflare R2 card images bucket."
  type        = string
  default     = "images.decklab.games"
}

variable "pages_project_name" {
  description = "Cloudflare Pages project name for the static React SPA."
  type        = string
  default     = "deck-lab"
}

variable "backend_image" {
  description = "Backend container image URI. Defaults to hello container for bootstrap."
  type        = string
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
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

variable "images_bucket_name" {
  description = "Cloudflare R2 bucket name for card images."
  type        = string
  default     = "deck-lab-images-prod"
}

variable "neon_api_key" {
  description = "Neon API Key for provisioning the PostgreSQL project. SENSITIVE."
  type        = string
  default     = ""
  sensitive   = true
}

variable "neon_org_id" {
  description = "Neon Organization ID where the PostgreSQL project is created."
  type        = string
  default     = "org-cold-grass-69732618"
}

variable "neon_region" {
  description = "Neon AWS region ID."
  type        = string
  default     = "aws-us-east-2"
}

variable "enable_cloudflare_dns" {
  description = "Whether to provision Cloudflare Pages, R2 custom domain, and DNS records via OpenTofu."
  type        = bool
  default     = false
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID (required for Cloudflare Pages and R2)."
  type        = string
  default     = ""
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for decklab.games."
  type        = string
  default     = ""
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token with Zone.DNS, Pages, and R2 Edit permissions. SENSITIVE."
  type        = string
  default     = ""
  sensitive   = true
}
