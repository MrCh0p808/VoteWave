FROM python:3.9-slim
WORKDIR /app
COPY backend/polls_service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/polls_service/ .
EXPOSE 5002
CMD ["python", "app.py"]
