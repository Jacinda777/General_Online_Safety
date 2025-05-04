from flask import Flask, request, jsonify
from transformers import pipeline
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from textblob import TextBlob
import nltk

# Download NLTK data
nltk.download('punkt')
nltk.download('stopwords')

app = Flask(__name__)

# Simulated fine-tuned BERT model for intent classification
classifier = pipeline('text-classification', model='bert-base-uncased')
# Generative model for dynamic responses
generator = pipeline('text-generation', model='facebook/blenderbot-400M-distill')

# Expanded intent-to-response mapping
intent_responses = {
    'password_security': 'Use a strong password with at least 12 characters, including letters, numbers, and symbols. Avoid reusing passwords across sites.',
    'phishing': 'Phishing is a cyberattack where attackers trick users into revealing sensitive information via fake emails or websites. Always verify the sender and avoid suspicious links.',
    'malware': 'Malware includes viruses, ransomware, and spyware. Use antivirus software, keep systems updated, and avoid downloading untrusted files.',
    'firewall': 'A firewall filters network traffic to protect against unauthorized access. Ensure it’s enabled and configured to block suspicious connections.',
    'vpn': 'A VPN encrypts your internet connection, enhancing privacy. Use reputable providers and enable it on public Wi-Fi.',
    'general': 'I can help with cybersecurity questions! Could you specify your concern, like passwords, phishing, or malware?'
}

# Stop words for keyword extraction
stop_words = set(stopwords.words('english'))

# Conversation history (in-memory for simplicity)
conversation_history = {}

def classify_intent(text, session_id):
    # Spell-check input
    text = str(TextBlob(text).correct())
    
    # Include context from history
    history = conversation_history.get(session_id, [])
    context = " ".join([msg['text'] for msg in history[-3:]]) + " " + text
    
    # Simple keyword-based intent classification (simulating fine-tuned model)
    tokens = [word.lower() for word in word_tokenize(context) if word.lower() not in stop_words]
    if any(word in tokens for word in ['password', 'pass', 'secure']):
        return 'password_security'
    if any(word in tokens for word in ['phishing', 'email', 'scam']):
        return 'phishing'
    if any(word in tokens for word in ['malware', 'virus', 'ransomware']):
        return 'malware'
    if any(word in tokens for word in ['firewall', 'network', 'traffic']):
        return 'firewall'
    if any(word in tokens for word in ['vpn', 'privacy', 'encrypt']):
        return 'vpn'
    return 'general'

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        text = data.get('text', '')
        session_id = data.get('session_id', '')
        if not text or not session_id:
            return jsonify({'error': 'text and session_id are required'}), 400

        # Update conversation history
        if session_id not in conversation_history:
            conversation_history[session_id] = []
        conversation_history[session_id].append({'text': text})
        conversation_history[session_id] = conversation_history[session_id][-3:]  # Keep last 3 messages

        # Classify intent
        intent = classify_intent(text, session_id)

        # Get response
        response = intent_responses.get(intent, intent_responses['general'])
        
        # Generate dynamic response for general queries
        if intent == 'general':
            generated = generator(text, max_length=50, num_return_sequences=1)[0]['generated_text']
            response = generated if generated.strip() else response

        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)