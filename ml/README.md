# 🧠 Medly ML API

This is the **machine learning backend module** for the Medly project, located at `medly/ml`. It includes a Flask-based REST API for language-aware processing and interaction with Azure OpenAI and Azure Cognitive Search services.

---

## 📁 Directory Structure

```
medly/ml/
├── app.py                # Main Flask app for API endpoint
├── app-for-test.py       # Script for local testing of API logic
├── requirements.txt      # Python dependencies
├── startup.sh            # Startup script for production deployment (e.g., gunicorn)
```

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the development server

```bash
python app.py
```

The API will be available at: `http://localhost:8080/chat`

### 3. Run in production with Gunicorn

```bash
sh startup.sh
```

This executes the app via Gunicorn using the `startup.sh` script.

---

## 🧪 Test Locally

Use `app-for-test.py` to test the API logic or prompts locally without hitting actual endpoints.

---

## 🔧 Environment Variables Required

Set the following environment variables before running the app:

- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`
- `DEPLOYMENT_NAME`
- `AI_SEARCH_ENDPOINT`
- `AI_SEARCH_SEMANTIC`
- `AI_SEARCH_KEY`
- `AI_SEARCH_INDEX`

You can use a `.env` file or set them manually in your environment.

---

## 📦 Dependencies

See [`requirements.txt`](./requirements.txt) for full list. Includes:

- `flask`
- `requests`
- `lingua-language-detector`
- `deep-translator`
- `gunicorn` (for production)

---

## ✨ Features

- Language-aware prompt routing (via Lingua)
- Deep translation for multilingual inputs
- Azure OpenAI ChatCompletion integration
- Azure AI Search (semantic + keyword hybrid) RAG support
- HTML-formatted citations for document tracing

---

## 🛠️ Deployment

This app is suitable for deployment on:
- Azure App Service
- Docker (with gunicorn)
- Local machine

---

## 📄 License

MIT or Custom – Add license information here if applicable.

