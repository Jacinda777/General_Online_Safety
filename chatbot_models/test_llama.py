from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Model repository ID
model_id = "meta-llama/Llama-3.1-8B-Instruct"

# Load tokenizer and model
try:
    print("Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    print("Loading model...")
    model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float16, device_map="auto")
    print("Model and tokenizer loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    exit(1)

# Prepare input
prompt = "How can I protect myself from phishing attacks?"
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

# Generate response
try:
    outputs = model.generate(**inputs, max_length=100, num_return_sequences=1)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print("\nModel Response:")
    print(response)
except Exception as e:
    print(f"Error generating response: {e}")