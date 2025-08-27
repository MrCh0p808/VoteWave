#Dockerfile

FROM python:3.9-slim

WORKDIR ~/Votewave #Setting Working Directory Inside Container

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt #Installing Python Dependencies

COPY . .    # Copy Code Into Container

EXPOSE 5000 # Expose App Port

CMD ["python", "app.py"]  # Run App 
