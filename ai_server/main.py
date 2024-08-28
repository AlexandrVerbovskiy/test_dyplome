import os
from dotenv import load_dotenv

from flask import Flask, request, jsonify

server_host = os.getenv("SERVER_HOST")
server_port = os.getenv("SERPER_PORT")

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, this is your Python server!"

@app.route('/data', methods=['POST'])
def get_data():
    data = request.json
    return jsonify({"received": data})

if __name__ == '__main__':
    app.run(host=server_host, port=server_port)