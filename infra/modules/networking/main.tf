variable "project" { type = string }
variable "region" { type = string }
variable "domain" { type = string }
variable "subdomain" { type = string }
variable "frontend_bucket_name" { type = string }
variable "backend_service_name" {
  type    = string
  default = "backend-service"
}
variable "enable_cdn" {
  type    = bool
  default = true
}

# Reserved Global Static IPv4 Address for Load Balancer
resource "google_compute_global_address" "lb_ip" {
  name       = "deck-lab-static-ip"
  project    = var.project
  ip_version = "IPV4"
}

# Google Certificate Manager DNS Authorizations
resource "google_certificate_manager_dns_authorization" "root" {
  name        = "decklab-games-root-auth"
  project     = var.project
  domain      = var.domain
  location    = "global"
  description = "DNS Authorization for decklab.games"
}

resource "google_certificate_manager_dns_authorization" "www" {
  name        = "decklab-games-www-auth"
  project     = var.project
  domain      = var.subdomain
  location    = "global"
  description = "DNS Authorization for www.decklab.games"
}

# Google Certificate Manager Certificate Map
resource "google_certificate_manager_certificate_map" "cert_map" {
  name    = "decklab-games-cert-map"
  project = var.project
}

# Google Certificate Manager Managed Certificates
resource "google_certificate_manager_certificate" "root" {
  name     = "decklab-games-root-cm-cert"
  project  = var.project
  location = "global"
  scope    = "DEFAULT"
  managed {
    domains = [var.domain]
    dns_authorizations = [
      google_certificate_manager_dns_authorization.root.id
    ]
  }
}

resource "google_certificate_manager_certificate" "www" {
  name     = "decklab-games-www-cm-cert"
  project  = var.project
  location = "global"
  scope    = "DEFAULT"
  managed {
    domains = [var.subdomain]
    dns_authorizations = [
      google_certificate_manager_dns_authorization.www.id
    ]
  }
}

# Certificate Map Entries
resource "google_certificate_manager_certificate_map_entry" "root" {
  name         = "decklab-games-root-entry"
  project      = var.project
  map          = google_certificate_manager_certificate_map.cert_map.name
  certificates = [google_certificate_manager_certificate.root.id]
  hostname     = var.domain
}

resource "google_certificate_manager_certificate_map_entry" "www" {
  name         = "decklab-games-www-entry"
  project      = var.project
  map          = google_certificate_manager_certificate_map.cert_map.name
  certificates = [google_certificate_manager_certificate.www.id]
  hostname     = var.subdomain
}

# Serverless NEG for Cloud Run Backend
resource "google_compute_region_network_endpoint_group" "backend" {
  name                  = "backend-neg"
  project               = var.project
  region                = var.region
  network_endpoint_type = "SERVERLESS"
  cloud_run {
    service = var.backend_service_name
  }
}

# Global Backend Service for Cloud Run Backend
resource "google_compute_backend_service" "backend" {
  name                  = "backend-lb-service"
  project               = var.project
  protocol              = "HTTP"
  load_balancing_scheme = "EXTERNAL_MANAGED"

  backend {
    group = google_compute_region_network_endpoint_group.backend.id
  }
}

# Backend Bucket with Cloud CDN Enabled for Static SPA
resource "google_compute_backend_bucket" "frontend" {
  name        = "frontend-backend-bucket"
  project     = var.project
  bucket_name = var.frontend_bucket_name
  enable_cdn  = var.enable_cdn
}

# HTTPS URL Map with Single-Domain Routing
resource "google_compute_url_map" "frontend" {
  name            = "deck-lab-lb"
  project         = var.project
  default_service = google_compute_backend_bucket.frontend.id

  host_rule {
    hosts        = ["*"]
    path_matcher = "path-matcher-1"
  }

  path_matcher {
    name            = "path-matcher-1"
    default_service = google_compute_backend_bucket.frontend.id

    path_rule {
      paths   = ["/api/*"]
      service = google_compute_backend_service.backend.id
    }

    path_rule {
      paths = [
        "/cards",
        "/cards/*",
        "/decks",
        "/decks/*",
        "/login",
        "/my-decks",
        "/register",
        "/simulator",
      ]
      service = google_compute_backend_bucket.frontend.id
      route_action {
        url_rewrite {
          path_prefix_rewrite = "/index.html"
        }
      }
    }
  }
}

# HTTPS Target Proxy
resource "google_compute_target_https_proxy" "frontend" {
  name            = "deck-lab-lb-target-proxy"
  project         = var.project
  url_map         = google_compute_url_map.frontend.id
  certificate_map = "//certificatemanager.googleapis.com/${google_certificate_manager_certificate_map.cert_map.id}"
}

# Global Forwarding Rule for HTTPS (Port 443)
resource "google_compute_global_forwarding_rule" "https" {
  name                  = "https-frontend"
  project               = var.project
  ip_address            = google_compute_global_address.lb_ip.address
  port_range            = "443"
  target                = google_compute_target_https_proxy.frontend.id
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

# HTTP -> HTTPS Redirect
resource "google_compute_url_map" "http_redirect" {
  name    = "https-frontend-redirect"
  project = var.project
  default_url_redirect {
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
  }
}

resource "google_compute_target_http_proxy" "http" {
  name    = "https-frontend-target-proxy"
  project = var.project
  url_map = google_compute_url_map.http_redirect.id
}

resource "google_compute_global_forwarding_rule" "http" {
  name                  = "https-frontend-forwarding-rule"
  project               = var.project
  ip_address            = google_compute_global_address.lb_ip.address
  port_range            = "80"
  target                = google_compute_target_http_proxy.http.id
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

output "lb_ip_address" {
  value = google_compute_global_address.lb_ip.address
}
