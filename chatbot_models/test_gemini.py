import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

# Configure Gemini API
try:
    genai.configure(api_key=api_key)
    print("Gemini API configured successfully.")
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    exit(1)

# Initialize model
model = genai.GenerativeModel("gemini-1.5-flash")

# Prepare prompt
prompt = """You are CyberGuard Assistant, a cybersecurity expert. Provide a concise answer to the following question:
What steps can I take to prevent phishing attacks?"""

# Generate response
try:
    response = model.generate_content(prompt)
    print("\nModel Response:")
    print(response.text)
except Exception as e:
    print(f"Error generating response: {e}")