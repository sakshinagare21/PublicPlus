# Use an official lightweight Python image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Install system dependencies for OpenCV/PIL if needed (minimal)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Set permissions for the model file just in case
RUN chmod 644 ai_detector_model.pth

# Hugging Face Spaces uses port 7860 by default
ENV PORT=7860
EXPOSE 7860

# Run the application with Gunicorn for better production performance
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "app:app", "--timeout", "300"]
