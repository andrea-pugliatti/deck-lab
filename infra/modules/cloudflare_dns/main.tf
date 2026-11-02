terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

variable "account_id" { type = string }
variable "zone_id" { type = string }
variable "pages_project_name" {
  type    = string
  default = "deck-lab"
}
variable "apex_domain" { type = string }
variable "subdomain" { type = string }
variable "api_domain" {
  type    = string
  default = "api.decklab.games"
}

# Cloudflare Pages Project
resource "cloudflare_pages_project" "frontend" {
  account_id        = var.account_id
  name              = var.pages_project_name
  production_branch = "main"
}

resource "cloudflare_pages_domain" "apex" {
  account_id   = var.account_id
  project_name = cloudflare_pages_project.frontend.name
  name         = var.apex_domain
}

resource "cloudflare_pages_domain" "www" {
  account_id   = var.account_id
  project_name = cloudflare_pages_project.frontend.name
  name         = var.subdomain
}

# Cloudflare DNS Records
resource "cloudflare_dns_record" "apex" {
  zone_id = var.zone_id
  name    = "@"
  content = "${var.pages_project_name}.pages.dev"
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

resource "cloudflare_dns_record" "www" {
  zone_id = var.zone_id
  name    = "www"
  content = "${var.pages_project_name}.pages.dev"
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

# Cloud Run Custom Domain Mapping CNAME (DNS-only so Google manages the TLS certificate)
resource "cloudflare_dns_record" "api" {
  zone_id = var.zone_id
  name    = "api"
  content = "ghs.googlehosted.com"
  type    = "CNAME"
  proxied = false
  ttl     = 1
}

output "pages_subdomain" {
  value = "${cloudflare_pages_project.frontend.name}.pages.dev"
}

output "apex_record_hostname" {
  value = cloudflare_dns_record.apex.name
}

output "www_record_hostname" {
  value = cloudflare_dns_record.www.name
}

output "api_record_hostname" {
  value = cloudflare_dns_record.api.name
}
