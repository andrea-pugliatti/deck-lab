locals {
  names = {
    sa_backend    = "backend-runner"
    cloudsql      = "deck-lab-db"
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
  project       = var.project
  region        = var.region
  instance_name = local.names.cloudsql
  database_name = "deck-lab"
  db_user       = var.db_user
  db_password   = var.db_password
  tier          = var.db_tier
}

module "storage" {
  source          = "./modules/storage"
  project         = var.project
  region          = var.region
  frontend_bucket = var.frontend_bucket_name
  images_bucket   = var.images_bucket_name
}

module "backend" {
  source             = "./modules/backend"
  project            = var.project
  region             = var.region
  service_name       = local.names.run_service
  backend_image      = var.backend_image
  db_connection_name = module.database.connection_name
  db_user            = var.db_user
  db_password        = var.db_password
  jwt_secret         = var.jwt_secret
  gemini_api_key     = var.gemini_api_key
  images_bucket      = var.images_bucket_name
  cors_origins       = var.cors_origins
  secret_db          = local.names.secret_db
  secret_jwt         = local.names.secret_jwt
  secret_gemini      = local.names.secret_gemini
}

module "networking" {
  source               = "./modules/networking"
  project              = var.project
  region               = var.region
  domain               = var.domain
  subdomain            = var.subdomain
  frontend_bucket_name = var.frontend_bucket_name
  backend_service_name = local.names.run_service
}

module "cloudflare_dns" {
  source      = "./modules/cloudflare_dns"
  count       = var.enable_cloudflare_dns && var.cloudflare_zone_id != "" ? 1 : 0
  zone_id     = var.cloudflare_zone_id
  apex_domain = var.domain
  lb_ip       = module.networking.lb_ip_address
}
