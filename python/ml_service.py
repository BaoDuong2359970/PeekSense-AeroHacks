from flask import Flask, request, jsonify
import tensorflow_hub as hub
import tensorflow as tf
import numpy as np
import csv
import tempfile
from scipy.io import wavfile
import resampy

app = Flask(__name__)

print("Loading YAMNet...")
model = hub.load("https://tfhub.dev/google/yamnet/1")
print("YAMNet loaded.")

class_map_path = model.class_map_path().numpy().decode("utf-8")

class_names = []
with open(class_map_path, newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        class_names.append(row["display_name"])


def load_audio(path):
    sample_rate, wav_data = wavfile.read(path)

    # Convert to float32
    wav_data = wav_data.astype(np.float32)

    # Normalize
    if np.max(np.abs(wav_data)) > 1:
        wav_data = wav_data / np.max(np.abs(wav_data))

    # Convert stereo → mono
    if len(wav_data.shape) > 1:
        wav_data = np.mean(wav_data, axis=1)

    # Resample to 16kHz (required by YAMNet)
    if sample_rate != 16000:
        wav_data = resampy.resample(wav_data, sample_rate, 16000)

    return wav_data


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "message": "Python ML service running"})


@app.route("/classify", methods=["POST"])
def classify():

    if "audio" not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    file = request.files["audio"]

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=True) as tmp:
        file.save(tmp.name)
        waveform = load_audio(tmp.name)

    scores, embeddings, spectrogram = model(waveform)

    mean_scores = tf.reduce_mean(scores, axis=0).numpy()

    top_indices = np.argsort(mean_scores)[-8:][::-1]

    predictions = []

    for i in top_indices:
        predictions.append({
            "label": class_names[i],
            "score": float(mean_scores[i])
        })

    return jsonify({
        "predictions": predictions
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)