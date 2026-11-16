# Acne Care AI

A final-year project for AI-assisted acne assessment and skincare support. The project contains a React/Vite web app, an Express/MongoDB API, and a FastAPI service that runs the pretrained acne classification model.

## Project folders

- `frontend/` — React 19 and Vite web app with patient, doctor, and admin dashboards.
- `backend/` — Express API, MongoDB models, authentication, appointments, prescriptions, payments, and scan endpoints.
- `model/` — FastAPI inference service, model metadata, and the pretrained Keras model (stored with Git LFS).

## Requirements

- Node.js and npm
- Python 3.10 or compatible with the packages in `model/requirements.txt`
- MongoDB connection string
- Git LFS for downloading the model weights

## Run locally

1. Install everything from the project root: `npm run install:all`.
2. Copy `backend/.env.example` to `backend/.env` and fill in your own MongoDB, JWT, Cloudinary, payment, and model-service settings.
3. Start the API and the web app together from the project root: `npm run dev`. The API starts right away and keeps retrying MongoDB Atlas until it connects; until then it answers with a "try again in a few seconds" message.
4. Set up the Python model service from the `model/` folder with `pip install -r requirements.txt`, then run `uvicorn main:app --host 0.0.0.0 --port 8000`.

Keep real credentials and uploaded patient images out of Git. The `.env` file and `backend/uploads/` are ignored.
