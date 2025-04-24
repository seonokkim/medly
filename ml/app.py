import os
import requests
import re
from flask import Flask, request, jsonify  

# Load environment variables
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
DEPLOYMENT_NAME = os.getenv("DEPLOYMENT_NAME")
AI_SEARCH_ENDPOINT = os.getenv("AI_SEARCH_ENDPOINT")
AI_SEARCH_SEMANTIC = os.getenv("AI_SEARCH_SEMANTIC")
AI_SEARCH_KEY = os.getenv("AI_SEARCH_KEY")
AI_SEARCH_INDEX = os.getenv("AI_SEARCH_INDEX")

# Create Flask app instance
app = Flask(__name__)

# Function to extract recent chat history (last 5 turns)
def get_history_messages(histories):
    history_list = []
    history_length = 5  # 최근 5개의 메시지만 사용

    for i, history in enumerate(histories[:history_length]):
        history_list.append({"role": "assistant", "content": history[0]})
        history_list.append({"role": "assistant", "content": history[1]})

    return history_list

# Function to request a GPT response using Azure OpenAI + Azure Search
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
                    "semantic_configuration": AI_SEARCH_SEMANTIC,
                    "query_type": "semantic",
                    "strictness": 5,
                    "top_n_documents": 5,
                    "key": AI_SEARCH_KEY,
                    "indexName": AI_SEARCH_INDEX
                }
            }
        ]
    }
    
    # Send request to Azure OpenAI ChatCompletion endpoint
    response = requests.post(
        f"{AZURE_OPENAI_ENDPOINT}openai/deployments/{DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview",
        headers=headers, json=payload
    )

    # Handle successful response
    if response.status_code == 200:
        response_json = response.json()
        content = response_json["choices"][0]["message"]["content"]
        citations = response_json["choices"][0]["message"].get("context", {}).get("citations", [])
        
        # Format citations into expandable HTML blocks
        formatted_citations = []
        for idx, citation in enumerate(citations, start=1):
            formatted_citations.append(
                f"<details>\n<summary>Doc{idx}</summary>\n<h3>Original Text</h3>\n<span>{citation.get('content', '')}</span>\n<h3>Data Sources</h3>\n<span><b>disease</b>: {citation.get('disease', 'N/A')}, <b>source</b>: {citation.get('source', 'N/A')}</span>\n</details><br>"
            )

        return content, "\n".join(formatted_citations)

    else:
        # Return error info if request failed
        return f"{response.status_code}, {response.text}", ""


# Define the /chat endpoint in Flask
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "") # Current user question
        histories = data.get("histories", []) # Previous message history
        
        # Process history and request GPT response
        history_list = get_history_messages(histories)
        response_text, citation_html = request_gpt(prompt, history_list)
        histories.append((prompt, response_text)) # Update history
        # Return updated history, response, and citation HTML 
        return jsonify({"histories": histories, "response": response_text, "citations": citation_html})
    
    except Exception as e:
        # Error handling
        return jsonify({"error": str(e)}), 500

# Run Flask app (for local dev or Azure App Service)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))  # Use Azure's PORT env variable (default: 8080)
    app.run(host="0.0.0.0", port=port)
