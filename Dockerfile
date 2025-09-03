#Dockerfile
# Use a lightweight Python image
FROM python:3.9-slim

# Set working directory
WORKDIR /Votewave

# Copy requirements first (better for caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Run the Flask app
CMD ["python", "app.py"]

