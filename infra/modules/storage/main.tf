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
variable "images_bucket" { type = string }
variable "images_domain" {
  type    = string
  default = "images.decklab.games"
}
variable "enable_custom_domain" {
  type    = bool
  default = true
}

resource "cloudflare_r2_bucket" "images" {
  account_id = var.account_id
  name       = var.images_bucket
  location   = "ENAM"
}

resource "cloudflare_r2_custom_domain" "images" {
  count       = var.enable_custom_domain && var.zone_id != "" ? 1 : 0
  account_id  = var.account_id
  bucket_name = cloudflare_r2_bucket.images.name
  domain      = var.images_domain
  enabled     = true
  zone_id     = var.zone_id
}

output "images_bucket_name" {
  value = cloudflare_r2_bucket.images.name
}

output "images_base_url" {
  value = "https://${var.images_domain}"
}
