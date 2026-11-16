# Prompt: Acne Care AI — Model

Copy everything below the line into ChatGPT, Claude or any AI assistant. Edit the "What I want" section first.

---

I am building **Acne Care AI**, my final-year project (FYP). It is a web app for AI-assisted acne assessment where patients upload a face photo, get an AI acne analysis, and then book a dermatologist for consultation, prescriptions and a diet plan.

## Project stack
- **Frontend:** React 19 + Vite, with patient, doctor (dermatologist) and admin dashboards.
- **Backend:** Node.js / Express + MongoDB (auth, appointments, prescriptions, payments with receipt upload, scans, messaging, notifications, platform fees, Firebase).
- **Model service:** Python FastAPI (`model/main.py`) that serves a Keras model. The Express backend sends the uploaded image to `POST /predict` and saves the result as a scan.

## Current model
- **File:** `acne_type_model.keras` (about 130 MB, TensorFlow/Keras, a CNN using transfer learning).
- **Input:** RGB image resized to **384 × 384**.
- **Output:** 5 acne **types**: Blackheads, Cyst, Papules, Pustules, Whiteheads.
- **Severity mapping (rule-based, not learned):**
  - Blackheads, Whiteheads → **Mild**
  - Papules, Pustules → **Moderate**
  - Cyst → **Severe**
- **Cyst safety flag:** if the Cyst probability is ≥ 20% but Cyst is not the top class, return `cystFlag: true` so a doctor reviews it.

## Inference pipeline (`POST /predict`)
1. Reject non-image files.
2. **Image validation:**
   - At least 20% of pixels must fall in the YCrCb skin range, otherwise reject (`no_skin`).
   - Then confirm a person with OpenCV Haar cascades in this order: frontal face, profile face, eyes (with or without glasses). A close-up with ≥ 45% skin also passes.
   - Failing all checks returns HTTP 422 `INVALID_IMAGE`.
3. **Preprocessing:** detect the largest face, crop a square of 1.8× the face size around it, and resize to 384 × 384. Without a face, use the whole image.
4. **Test-time augmentation (TTA):** average predictions over 4 views (original, horizontal flip, 8% brighter, 8% darker). This keeps the response under 5 seconds.
5. **Confidence gate:** if the top class is below **70%** confidence, return HTTP 422 `LOW_CONFIDENCE` and ask for a clearer photo.
6. **Response:** `acneType`, `severity`, `confidence`, per-class `probs`, `cystFlag`, `cystProb`, and `validatedBy` (which check passed).

There is also `POST /debug-face` to inspect validation and `GET /health`.

## Known limitations
- The whole face is classified into a **single** acne type, but real faces often have several types at once. There is no lesion detection, localization or count.
- Severity comes from the type, not from the number or spread of lesions (no clinical grading such as IGA, Hayashi or GAGS).
- Validation uses Haar cascades, which are old and easily fooled. The YCrCb skin range works poorly on very dark or very light skin and in bad lighting.
- No skin type (oily / dry / normal) or skin tone analysis.
- No explainability: the patient and doctor cannot see which area of the image caused the prediction.

## Related work I compared against
The repo `vinit714/A-Recommendation-system-for-Facial-Skin-Care-using-Machine-Learning-Models` (IEEE paper "Efficient Net-based Expert System for Personalized Facial Skincare Recommendations") uses EfficientNet-B0 for skin type (87.1% training / 80% validation accuracy, about 161 images) and acne severity in 3 levels (about 68% accuracy, Kaggle "Acne Grading Classification Dataset"), K-Means + KNN for skin tone (Fitzpatrick scale), and cosine-similarity product recommendations from Myntra data. My project adds dermatologist consultations, prescriptions, payments and an admin panel.

## What I want
<!-- Delete the lines you don't want and add your own. -->
1. Improve the model's accuracy and explain how to train it again (datasets, class balance, augmentation, train/validation/test split, metrics: accuracy, precision, recall, F1, confusion matrix).
2. Suggest public datasets for the 5 acne types and for severity grading.
3. Add **Grad-CAM heatmaps** so the patient and doctor can see which part of the face caused the prediction.
4. Detect **multiple acne types and lesion counts** per image (for example with YOLOv8 object detection) and calculate severity from the counts.
5. Add **skin type** (oily / dry / normal / combination) classification.
6. Replace Haar cascades with a better face detector (MediaPipe or a DNN detector) and make skin detection work for all skin tones.
7. Make the model smaller and faster (for example TFLite or quantization) while keeping responses under 5 seconds.
8. Help me write the **model chapter of my FYP report**: methodology, architecture diagram, evaluation results and comparison with related work.

## Constraints
- Keep the same `POST /predict` response fields so my Express backend and React frontend keep working. New fields may be added.
- The AI result is only a screening aid, not a diagnosis. A dermatologist must confirm it, and the app shows a medical disclaimer.
- Patient images are private and must not be stored or shared outside the app.
- Explain things simply, step by step, with full code where needed, because this is a student project.
