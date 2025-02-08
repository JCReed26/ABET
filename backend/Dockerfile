# syntax = docker/dockerfile:1.4

FROM python:3.9-slim

WORKDIR /app

COPY ../requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY ./src /app/backend/src

ENV PYTHONPATH=/app

CMD ["python", "-m", "uvicorn", "backend.src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]