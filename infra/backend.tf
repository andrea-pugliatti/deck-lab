# Remote State Backend Configuration (GCS)
# State is securely stored in gs://deck-lab-tfstate with object versioning enabled.

terraform {
  backend "gcs" {
    bucket = "deck-lab-tfstate"
    prefix = "terraform/state/prod"
  }
}
