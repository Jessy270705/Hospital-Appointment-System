from transformers import pipeline

sentiment = pipeline("sentiment-analysis")

print("=== Sentiment Analyzer ===")
print("Type 'quit' to exit\n")

while True:
    text = input("Enter your review: ")
    if text.lower() == "quit":
        break
    result = sentiment(text)[0]
    label = result['label']
    score = round(result['score'] * 100, 2)
    print(f"Result: {label} ({score}% confident)\n")