# 1. Create a virtual environment (optional but recommended)
if (-not (Test-Path "venv")) {
    python -m venv venv
}

# 2. Activate virtual environment
.\venv\Scripts\Activate.ps1

# 3. Upgrade pip and install requirements
python -m pip install --upgrade pip
pip install -r requirements.txt

# 4. Download the high-quality dataset
Write-Host "Downloading dataset... this may take some time depending on your internet speed." -ForegroundColor Cyan
python download_dataset.py

# 5. Start training the AI detection model
Write-Host "Starting Training..." -ForegroundColor Green
python train.py
