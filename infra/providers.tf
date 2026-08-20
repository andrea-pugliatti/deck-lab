terraform {
  required_version = ">= 1.8.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.6"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 6.6"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project
  region  = var.region
}

provider "google-beta" {
  project = var.project
  region  = var.region
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token == "" ? null : var.cloudflare_api_token
}
