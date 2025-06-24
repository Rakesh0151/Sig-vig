gcloud builds submit --tag gcr.io/sig-vig-staging/my-react-app

gcloud run deploy my-react-app --image gcr.io/sig-vig-staging/my-react-app --platform managed --region us-central1 --allow-unauthenticated