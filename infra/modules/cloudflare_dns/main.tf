terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

variable "zone_id" { type = string }
variable "apex_domain" { type = string }
variable "lb_ip" { type = string }
variable "proxied" {
  type    = bool
  default = true
}

resource "cloudflare_dns_record" "apex" {
  zone_id = var.zone_id
  name    = "@"
  content = var.lb_ip
  type    = "A"
  proxied = var.proxied
  ttl     = 1
}

resource "cloudflare_dns_record" "www" {
  zone_id = var.zone_id
  name    = "www"
  content = var.lb_ip
  type    = "A"
  proxied = var.proxied
  ttl     = 1
}

resource "cloudflare_dns_record" "acme_root" {
  zone_id = var.zone_id
  name    = "_acme-challenge"
  content = "483c10f2-d0ca-4536-bdae-3787158a2ca7.12.authorize.certificatemanager.goog"
  type    = "CNAME"
  proxied = false
  ttl     = 1
}

resource "cloudflare_dns_record" "acme_www" {
  zone_id = var.zone_id
  name    = "_acme-challenge.www"
  content = "1bc0713b-8709-45ed-ac7b-cc8e00e809ad.9.authorize.certificatemanager.goog"
  type    = "CNAME"
  proxied = false
  ttl     = 1
}

output "apex_record_hostname" {
  value = cloudflare_dns_record.apex.name
}

output "www_record_hostname" {
  value = cloudflare_dns_record.www.name
}
