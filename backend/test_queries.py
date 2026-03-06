import urllib.request
import json
import urllib.parse

def test_query(q):
    url = f"http://127.0.0.1:8001/query?q={urllib.parse.quote(q)}"
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            print(f"Q: {q}")
            print(f"A: {data['response']}")
            print("-" * 20)
    except Exception as e:
        print(f"Failed to connect: {e}")

if __name__ == "__main__":
    # Test cases
    queries = [
        "hi",
        "what courses are offered?",
        "who is the principal?",
        "tell me about admission process",
        "what is the fee for btech?",
        "is there a scholarship for merit?",
        "tell me a joke", # Out of scope
        "what is the weather?" # Out of scope
    ]
    
    for q in queries:
        test_query(q)
