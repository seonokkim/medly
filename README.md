# 🩺 Medly Project

Medly is an AI-powered medical consultation system designed to bridge the communication gap between patients and healthcare professionals. It integrates:
* Speech-to-Text (STT) for voice input,
* Summarization to condense lengthy medical explanations, and
* a RAG-based chatbot to deliver personalized, context-aware responses before and after surgery.

This project is a full-stack team project that integrates a mobile frontend, backend APIs, machine learning capabilities, and report generation. The project is designed to explore and demonstrate a modular architecture for building LLM-powered healthcare applications.

🔗 Original team repository: [github.com/team-medly](https://github.com/team-medly)

---

## 📁 Project Structure

```
medly/
├── client/        # React Native frontend app
├── ml/            # Python-based ML backend (Flask, Azure OpenAI + RAG)
├── report/        # Project report and documentation
├── server/        # Backend service using NestJS
```

---

## 🧩 Module Overview

### `client/`
- React Native app
- TypeScript-based
- Structured into `components`, `navigation`, `screens`, etc.

### `ml/`
- REST API (Flask) for medical Q&A
- Uses Azure OpenAI and Azure Cognitive Search
- Language detection (Lingua) and translation (Deep Translator)

### `report/`
- Project summary and results
- Includes `project-report.pdf`

### `server/`
- Backend developed with NestJS
- Handles API integration and service logic
- Docker support and unit test structure included

---

## 🚀 Quick Start (ML module example)

```bash
cd ml
pip install -r requirements.txt
python app.py
```

API: `http://localhost:8080/chat`

---

## 🛠️ Stack

- **Frontend**: React Native (Expo)
- **Backend**: NestJS
- **ML**: Python, Flask, Azure OpenAI + Search
- **Infra**: GitHub, Docker, Azure

---

## 📄 License

This project is licensed under the MIT License.  
See the [LICENSE](./LICENSE) file for details.