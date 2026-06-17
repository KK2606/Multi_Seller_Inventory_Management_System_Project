# ---------- Frontend Build ----------
FROM node:22 AS frontend

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build

# ---------- Backend ----------
FROM python:3.12

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend .

COPY backend/.env.docker .env

# Copy React build into backend
COPY --from=frontend /frontend/dist ./static

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]