import requests
import certifi
import ssl

print("Python:", ssl.OPENSSL_VERSION)
print("Certifi:", certifi.where())

token_data = {
    "grant_type": "client_credentials",
    "client_id": "B2Gv7dfoB1mwVAJV1okr9Qy3NUUa",
    "client_secret": "XTuJdXPDyXoIJQ3GYqCDmWQtAJEa"
}

r = requests.post(
    "https://api.mcp.es/token",
    data=token_data,
    verify=False
)

print(r.status_code)
print(r.text)