from flask import Flask, request, jsonify
import requests
import json
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/extract-topics', methods=['POST'])

def extract_topics():
    data = request.json  # Receive JSON data from Node.js server
    description = data.get('description')

    if not description:
        return jsonify({'error': 'No description provided'}), 400

    # Set up the API request
    headers = {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWQ4NGEwZmMtNmMxZS00MzBiLWJhZWMtODllZDAwOGNkZTYzIiwidHlwZSI6ImFwaV90b2tlbiJ9.jo_r1hn-2ZRfQTR7d9fhlCaN4A7aPa7RTKT9JxJ7t1c"}  # Update with your API key
    url = "https://api.edenai.run/v2/text/topic_extraction"
    payload = {"providers": "openai", "language": "en", "text": description}
    
    # Call Eden AI topic extraction
    response = requests.post(url, json=payload, headers=headers)
    result = json.loads(response.text)
    print(result);

    # Return the topic extraction result to Node.js server
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)