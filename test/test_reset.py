import requests

def reset():
    resp = requests.get("localhost:3000/reset")
