import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import sys
import os

# 1. Configuration
MODEL_PATH = "ai_detector_model.pth"
CLASS_NAMES = ['ai', 'real']  # Must match the training folder names
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_model():
    # Recreate the exact same model architecture as used in train.py
    model = models.efficientnet_v2_s(weights=None) # No default weights, we use our own
    num_ftrs = model.classifier[1].in_features
    model.classifier[1] = nn.Sequential(
        nn.Dropout(p=0.2, inplace=True),
        nn.Linear(num_ftrs, len(CLASS_NAMES))
    )
    
    # Load the trained weights
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Could not find '{MODEL_PATH}'. Please ensure training finished successfully.")
        sys.exit(1)
        
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.to(DEVICE)
    model.eval() # Set to evaluation mode
    return model

def predict_image(image_path, model):
    # Transformation (Must match the validation transforms from train.py)
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    try:
        img = Image.open(image_path).convert('RGB')
        img_t = preprocess(img)
        batch_t = torch.unsqueeze(img_t, 0).to(DEVICE)

        with torch.no_grad():
            outputs = model(batch_t)
            # Use Softmax to get probabilities (confidence scores)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            conf, index = torch.max(probabilities, 0)
            
        result = CLASS_NAMES[index]
        confidence = conf.item() * 100
        
        print(f"\n--- Prediction Results ---")
        print(f"Image: {os.path.basename(image_path)}")
        print(f"Detected as: {result.upper()}")
        print(f"Confidence Level: {confidence:.2f}%")
        print(f"--------------------------\n")
        
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python detect.py path/to/your/image.jpg")
    else:
        path = sys.argv[1]
        trained_model = load_model()
        predict_image(path, trained_model)
