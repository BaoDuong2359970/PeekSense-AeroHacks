from flask import Flask, request, jsonify

app = Flask(__name__)

print("Starting ML service without TensorFlow for now...")

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "message": "Python ML service running (lite mode)"})

@app.route("/analyze_audio", methods=["POST"])  
def analyze_audio():
    # Placeholder pour l'analyse audio
    return jsonify({
        "detected_classes": ["ambient", "nature"], 
        "confidence": 0.8,
        "message": "Audio analysis placeholder - TensorFlow not loaded"
    })

if __name__ == "__main__":
    print("Python ML service starting on port 5001...")
    app.run(host="0.0.0.0", port=5001, debug=True)