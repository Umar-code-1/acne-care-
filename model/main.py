import io, json, os
import numpy as np
import cv2
from fastapi import FastAPI, File, UploadFile, HTTPException
from PIL import Image

BASE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE, "model_meta.json")) as f:
    META = json.load(f)

IMG_SIZE     = META["img_size"]
CLASS_NAMES  = META["class_names"]
SEVERITY_MAP = META["severity_map"]
CYST_THRESH  = META["cyst_threshold"]
CYST_IDX     = CLASS_NAMES.index("Cyst")
N_TTA        = 4     # 4 views keeps us under the 5s requirement
MIN_CONFIDENCE = 70.0


# ---------------------------------------------------------------
# CASCADES
# ---------------------------------------------------------------
FACE_CASCADE = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
PROFILE_CASCADE = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_profileface.xml"
)
EYE_CASCADE = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_eye.xml"
)
EYE_GLASSES = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_eye_tree_eyeglasses.xml"
)


# ---------------------------------------------------------------
# IMAGE VALIDATION (NFR-09)
# ---------------------------------------------------------------
def looks_like_skin(arr):
    """Fraction of pixels in the YCrCb skin-tone range (0.0 - 1.0)."""
    ycrcb = cv2.cvtColor(arr, cv2.COLOR_RGB2YCrCb)
    mask = cv2.inRange(
        ycrcb,
        np.array([0, 133, 77], dtype=np.uint8),
        np.array([255, 173, 127], dtype=np.uint8),
    )
    return float((mask > 0).mean())


def validate_image(arr):
    """Layered check. Skin content is mandatory; landmarks are a bonus."""
    gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
    gray = cv2.equalizeHist(gray)

    skin = looks_like_skin(arr)
    details = {"skin": round(skin, 3)}

    # ---- MANDATORY: image must contain a meaningful amount of skin ----
    if skin < 0.20:
        return False, "no_skin", details

    # ---- then confirm it's a person, not just skin-coloured pixels ----
    faces = FACE_CASCADE.detectMultiScale(gray, 1.1, 5, minSize=(60, 60))
    details["faces"] = len(faces)
    if len(faces) > 0:
        return True, "face", details

    profiles = PROFILE_CASCADE.detectMultiScale(gray, 1.1, 5, minSize=(60, 60))
    details["profiles"] = len(profiles)
    if len(profiles) > 0:
        return True, "profile", details

    eyes = EYE_CASCADE.detectMultiScale(gray, 1.1, 8, minSize=(25, 25))
    if len(eyes) == 0:
        eyes = EYE_GLASSES.detectMultiScale(gray, 1.1, 8, minSize=(25, 25))
    details["eyes"] = len(eyes)
    if len(eyes) >= 1:
        return True, "eyes", details

    # close-up with no landmarks — needs a high skin fraction
    if skin >= 0.45:
        return True, "skin_closeup", details

    return False, "insufficient", details

# ---------------------------------------------------------------
# MODEL
# ---------------------------------------------------------------
# Server uses the small LiteRT runtime (fits Render free 512 MB);
# locally it falls back to TensorFlow's built-in TFLite interpreter.
try:
    from ai_edge_litert.interpreter import Interpreter
except ImportError:
    import tensorflow as tf
    Interpreter = tf.lite.Interpreter

print("Loading model...")
interpreter = Interpreter(
    model_path=os.path.join(BASE, "acne_type_model_fp16.tflite"),
    num_threads=os.cpu_count() or 1,
)
interpreter.allocate_tensors()
IN_IDX  = interpreter.get_input_details()[0]["index"]
OUT_IDX = interpreter.get_output_details()[0]["index"]
print("Model ready. Classes:", CLASS_NAMES)


def run_model(batch: np.ndarray) -> np.ndarray:
    """Runs each image through the TFLite model (its input is batch size 1)."""
    out = []
    for img in batch:
        interpreter.set_tensor(IN_IDX, img[None].astype(np.float32))
        interpreter.invoke()
        out.append(interpreter.get_tensor(OUT_IDX)[0].copy())
    return np.stack(out)

app = FastAPI(title="AcneCare AI — Inference Service")


def preprocess(image_bytes: bytes):
    """Returns (original_for_detection, resized_for_model)."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    orig = img.copy()
    orig.thumbnail((800, 800))
    orig_arr = np.array(orig, dtype=np.uint8)

    # Keep the detected face large in the model input instead of shrinking the
    # whole portrait (and its background) into a square.
    gray = cv2.equalizeHist(cv2.cvtColor(orig_arr, cv2.COLOR_RGB2GRAY))
    faces = FACE_CASCADE.detectMultiScale(gray, 1.1, 5, minSize=(60, 60))
    if len(faces):
        x, y, width, height = max(faces, key=lambda box: box[2] * box[3])
        image_height, image_width = orig_arr.shape[:2]
        side = min(int(max(width, height) * 1.8), image_width, image_height)
        center_x, center_y = x + width // 2, y + height // 2
        left = max(0, min(center_x - side // 2, image_width - side))
        top = max(0, min(center_y - side // 2, image_height - side))
        model_source = Image.fromarray(orig_arr[top:top + side, left:left + side])
    else:
        model_source = img

    model_arr = np.array(model_source.resize((IMG_SIZE, IMG_SIZE)), dtype=np.float32)
    return orig_arr, model_arr


def predict_with_tta(arr: np.ndarray):
    """Original + flip + 2 light augments, averaged."""
    views = [arr, np.fliplr(arr)]
    views.append(np.clip(arr * 1.08, 0, 255))
    views.append(np.clip(arr * 0.92, 0, 255))

    batch = np.stack(views[:N_TTA])
    return run_model(batch).mean(axis=0)


# ---------------------------------------------------------------
# ROUTES
# ---------------------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok", "classes": CLASS_NAMES}


@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")

    try:
        data = await image.read()
        orig_arr, arr = preprocess(data)
    except Exception:
        raise HTTPException(400, "Could not read image")

    valid, signal, details = validate_image(orig_arr)

    if not valid:
        raise HTTPException(422, {
            "code": "INVALID_IMAGE",
            "message": "We couldn't detect a face or skin in this photo. Please upload a clear, well-lit photo of your face or the affected area.",
        })

    probs = predict_with_tta(arr)

    top_idx    = int(np.argmax(probs))
    acne_type  = CLASS_NAMES[top_idx]
    confidence = float(probs[top_idx]) * 100
    severity   = SEVERITY_MAP[acne_type]
    cyst_prob = float(probs[CYST_IDX])
    cyst_flag = cyst_prob >= CYST_THRESH and top_idx != CYST_IDX
    if confidence < MIN_CONFIDENCE:
        raise HTTPException(422, {
            "code": "LOW_CONFIDENCE",
            "message": "We couldn't analyse this image reliably. Please upload a clearer, well-lit close-up photo of the affected skin.",
        })

    return {
        "acneType":    acne_type,
        "severity":    severity,
        "confidence":  round(confidence, 1),
        "probs":       {c: round(float(p) * 100, 1)
                        for c, p in zip(CLASS_NAMES, probs)},
        "cystFlag":    cyst_flag,
        "cystProb":    round(cyst_prob * 100, 1),
        "validatedBy": signal,
    }


@app.post("/debug-face")
async def debug_face(image: UploadFile = File(...)):
    data = await image.read()
    orig_arr, _ = preprocess(data)
    valid, signal, details = validate_image(orig_arr)
    ih, iw = orig_arr.shape[:2]
    return {
        "image_size": [int(iw), int(ih)],
        "valid":      valid,
        "passed_via": signal,
        "details":    details,
    }
#py -m uvicorn main:app --port 8000 --reload
