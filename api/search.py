# api/search.py

import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from ik_downloader import search_documents

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/search')
def search():
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'No query provided. Please provide a query to search.'}), 400

    try:
        results = search_documents(query)
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Vercel handler
def handler(event, context):
    return app(event, context)
