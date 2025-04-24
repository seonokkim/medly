import os
import requests
import re
from flask import Flask, request, jsonify  

# Load environment variables
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
DEPLOYMENT_NAME = os.getenv("DEPLOYMENT_NAME")
AI_SEARCH_ENDPOINT = os.getenv("AI_SEARCH_ENDPOINT")
AI_SEARCH_SEMANTIC = os.getenv("AI_SEARCH_SEMANTIC", "medbiogpt-semantic-0204")  # 기본값 추가
AI_SEARCH_KEY = os.getenv("AI_SEARCH_KEY")
AI_SEARCH_INDEX = os.getenv("AI_SEARCH_INDEX")

# Flask 앱 생성
app = Flask(__name__)

# 최근 대화 히스토리를 추출하는 함수
def get_history_messages(histories):
    history_list = []
    history_length = 5  # 최근 5개의 메시지만 사용

    for i, history in enumerate(histories[:history_length]):
        history_list.append({"role": "assistant", "content": history[0]})
        history_list.append({"role": "assistant", "content": history[1]})

    return history_list

# GPT API 요청 함수
def request_gpt(prompt, history_list):
    headers = {"Content-Type": "application/json", "api-key": AZURE_OPENAI_API_KEY}

    message_list = [
        {
            "role": "system",
            "content": "You are an assistant for medical professionals. When asked about a disease, search the 'disease' section of the provided data. If found, answer based on the document."
        }
    ]

    message_list.extend(history_list)
    message_list.append({"role": "user", "content": prompt})

    payload = {
        "messages": message_list,
        "temperature": 0.1,
        "top_p": 0.6,
        "max_tokens": 800,
        "data_sources": [
            {
                "type": "azure_search",
                "parameters": {
                    "endpoint": AI_SEARCH_ENDPOINT,
                    "semantic_configuration": 'medbiogpt-semantic-0204',
                    "query_type": "semantic",
                    "strictness": 5,
                    "top_n_documents": 5,
                    "key": AI_SEARCH_KEY,
                    "indexName": AI_SEARCH_INDEX
                }
            }
        ]
    }

    response = requests.post(
        f"{AZURE_OPENAI_ENDPOINT}openai/deployments/{DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview",
        headers=headers, json=payload
    )

    if response.status_code == 200:
        response_json = response.json()
        content = response_json["choices"][0]["message"]["content"]
        citations = response_json["choices"][0]["message"].get("context", {}).get("citations", [])

        formatted_citations = []
        for idx, citation in enumerate(citations, start=1):
            formatted_citations.append(
                f"<details>\n<summary>Doc{idx}</summary>\n<h3>Original Text</h3>\n<span>{citation.get('content', '')}</span>\n<h3>Data Sources</h3>\n<span><b>disease</b>: {citation.get('disease', 'N/A')}, <b>source</b>: {citation.get('source', 'N/A')}</span>\n</details><br>"
            )

        return content, "\n".join(formatted_citations)

    else:
        return f"{response.status_code}, {response.text}", ""
    

if __name__ == "__main__":
    request_gpt("hi")