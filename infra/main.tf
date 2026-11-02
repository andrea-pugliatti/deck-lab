locals {
  names = {
    sa_backend    = "backend-runner"
    ar_repo       = "deck-lab"
    secret_db     = "DECK_LAB_DB_PASSWORD"
    secret_jwt    = "DECK_LAB_JWT_SECRET"
    secret_gemini = "DECK_LAB_GEMINI_API_KEY"
    run_service   = "backend-service"
  }
}

module "registry" {
  source        = "./modules/registry"
  project       = var.project
  region        = var.region
  repository_id = local.names.ar_repo
}

module "database" {
  source        = "./modules/database"
  project_name  = "deck-lab"
  database_name = "deck-lab"
  org_id        = var.neon_org_id
  region_id     = var.neon_region
}

module "storage" {
  source               = "./modules/storage"
  count                = var.cloudflare_account_id != "" ? 1 : 0
  account_id           = var.cloudflare_account_id
  zone_id              = var.cloudflare_zone_id
  images_bucket        = var.images_bucket_name
  images_domain        = var.images_domain
  enable_custom_domain = var.enable_cloudflare_dns
}

module "backend" {
  source          = "./modules/backend"
  project         = var.project
  region          = var.region
  service_name    = local.names.run_service
  backend_image   = var.backend_image
  api_domain      = var.api_domain
  jdbc_url        = module.database.jdbc_url
  db_user         = module.database.db_user
  db_password     = module.database.db_password
  jwt_secret      = var.jwt_secret
  gemini_api_key  = var.gemini_api_key
  images_base_url = "https://${var.images_domain}"
  cors_origins    = var.cors_origins
  secret_db       = local.names.secret_db
  secret_jwt      = local.names.secret_jwt
  secret_gemini   = local.names.secret_gemini
}

module "cloudflare_dns" {
  source             = "./modules/cloudflare_dns"
  count              = var.enable_cloudflare_dns && var.cloudflare_zone_id != "" && var.cloudflare_account_id != "" ? 1 : 0
  account_id         = var.cloudflare_account_id
  zone_id            = var.cloudflare_zone_id
  pages_project_name = var.pages_project_name
  apex_domain        = var.domain
  subdomain          = var.subdomain
  api_domain         = var.api_domain
}
