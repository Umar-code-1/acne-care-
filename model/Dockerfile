# AcneCare model API — Render (free plan, Docker)
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1
WORKDIR /app

COPY requirements-server.txt .
RUN pip install --upgrade pip && pip install -r requirements-server.txt

COPY main.py model_meta.json acne_type_model_fp16.tflite ./

# Render sets $PORT (default 10000)
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}"]
