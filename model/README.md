# AcneCare model API

FastAPI service that classifies acne type from a face photo.

- `GET /health` — status and class names
- `POST /predict` — form field `image` (photo), returns acne type, severity and confidence

## Files
- `acne_type_model.keras` — trained model (Git LFS)
- `acne_type_model_fp16.tflite` — the model the API actually runs (made by `py convert_tflite.py`;
  gave the same top class as the `.keras` model on all 51 test scans, max 0.2-point confidence difference)
- `requirements.txt` — local (includes TensorFlow, for training/conversion)
- `requirements-server.txt` — server (LiteRT only, fits Render's free 512 MB)

## Run locally
`py -m uvicorn main:app --port 8000 --reload`

## Deploy (Render)
New Web Service → this repo → Root Directory `model` → Runtime Docker → Free plan.
