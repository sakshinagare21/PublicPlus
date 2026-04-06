from flask import Flask, request, jsonify
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import os
import io

app = Flask(__name__)

# --- Model Configuration ---
MODEL_PATH = "ai_detector_model.pth"
CLASS_NAMES = ['ai', 'real']
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_model():
    """Recreates the architecture and loads the weights once."""
    model = models.efficientnet_v2_s(weights=None)
    num_ftrs = model.classifier[1].in_features
    model.classifier[1] = nn.Sequential(
        nn.Dropout(p=0.2, inplace=True),
        nn.Linear(num_ftrs, len(CLASS_NAMES))
    )
    
    if not os.path.exists(MODEL_PATH):
        print(f"CRITICAL: Model file '{MODEL_PATH}' missing!")
        return None
        
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    return model

# Load model globally on startup to prevent slow responses
print(f"🚀 Initializing AI Detector on {DEVICE}...")
MODEL = load_model()

# Standard Image Preprocessing
PREPROCESS = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ready", "model_loaded": MODEL is not None})

@app.route('/detect', methods=['POST'])
def detect_image():
    if MODEL is None:
        return jsonify({"success": False, "error": "Model not loaded on server"}), 500

    # Support both multipart (for production) and local path (for debugging)
    if 'file' in request.files:
        file = request.files['file']
        img_bytes = file.read()
        try:
            img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        except Exception as e:
            return jsonify({"success": False, "error": f"Invalid image file: {str(e)}"}), 400
    elif request.json and 'image_path' in request.json:
        path = request.json['image_path']
        if not os.path.exists(path):
            return jsonify({"success": False, "error": "File not found on server disk"}), 404
        try:
            img = Image.open(path).convert('RGB')
        except Exception as e:
            return jsonify({"success": False, "error": f"Error opening path: {str(e)}"}), 400
    else:
        return jsonify({"success": False, "error": "No file or image_path provided"}), 400

    try:
        # Run prediction
        img_t = PREPROCESS(img)
        batch_t = torch.unsqueeze(img_t, 0).to(DEVICE)

        with torch.no_grad():
            outputs = MODEL(batch_t)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            conf, index = torch.max(probabilities, 0)
            
        result = CLASS_NAMES[index]
        confidence = float(conf.item())
        
        return jsonify({
            "success": True,
            "detected_as": result,
            "is_ai": result == 'ai',
            "confidence": confidence,
            "formatted_result": f"|{result.upper()}|" if result == 'ai' else "|REAL|"
        })

    except Exception as e:
        return jsonify({"success": False, "error": f"Internal process error: {str(e)}"}), 500

if __name__ == '__main__':
    # Render or local port
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
