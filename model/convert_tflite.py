# Converts acne_type_model.keras to TFLite so the API can run without full TensorFlow
# (fits Render's free 512 MB plan). Run once locally:  py convert_tflite.py
import os
import tensorflow as tf

BASE = os.path.dirname(os.path.abspath(__file__))
model = tf.keras.models.load_model(os.path.join(BASE, "acne_type_model.keras"))

for name, fp16 in [("acne_type_model.tflite", False), ("acne_type_model_fp16.tflite", True)]:
    conv = tf.lite.TFLiteConverter.from_keras_model(model)
    if fp16:
        conv.optimizations = [tf.lite.Optimize.DEFAULT]
        conv.target_spec.supported_types = [tf.float16]
    data = conv.convert()
    with open(os.path.join(BASE, name), "wb") as f:
        f.write(data)
    print(f"{name}: {len(data) / 1e6:.1f} MB")
