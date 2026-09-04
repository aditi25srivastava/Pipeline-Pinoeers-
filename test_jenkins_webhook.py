import requests

url = "http://localhost:8000/api/webhooks/jenkins"

# Simulate a Jenkins Notification Plugin payload for a started build
payload_start = {
    "name": "ecommerce/api",
    "url": "job/ecommerce-api/",
    "build": {
        "number": 42,
        "phase": "STARTED",
        "status": "UNKNOWN",
        "url": "job/ecommerce-api/42/"
    }
}

print("Triggering Jenkins build START webhook...")
response = requests.post(url, json=payload_start)
print(response.status_code, response.json())

# Wait a second to simulate build time
import time
time.sleep(2)

# Simulate a Jenkins Notification Plugin payload for a completed (failed) build
payload_failed = {
    "name": "ecommerce/api",
    "url": "job/ecommerce-api/",
    "build": {
        "number": 42,
        "phase": "COMPLETED",
        "status": "FAILURE",
        "url": "job/ecommerce-api/42/"
    }
}

print("Triggering Jenkins build COMPLETED (FAILED) webhook...")
response = requests.post(url, json=payload_failed)
print(response.status_code, response.json())
