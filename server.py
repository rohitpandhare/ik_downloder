from flask import Flask, request, jsonify
from flask_cors import CORS
from ik_downloader import (
    search_documents,
    get_document,
    get_court_copy,
    get_document_fragment,
    get_document_metadata,
)

app = Flask(__name__)
CORS(app)  # Enable cross-origin accessibility


# Route: Search query
@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("query", "")
    pagenum = request.args.get("pagenum", 0)

    if not query:
        return jsonify({"error": "No query provided"}), 400

    try:
        results = search_documents(query, int(pagenum))
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route: Document details
@app.route("/document/<docid>", methods=["GET"])
def document_details(docid):
    try:
        results = get_document(docid)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route: Court copy
@app.route("/document/original/<docid>", methods=["GET"])
def court_copy(docid):
    try:
        results = get_court_copy(docid)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route: Document fragments
@app.route("/document/fragment/<docid>", methods=["GET"])
def document_fragment(docid):
    query = request.args.get("query", "")

    if not query:
        return jsonify({"error": "No query provided"}), 400

    try:
        results = get_document_fragment(docid, query)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route: Document metadata
@app.route("/document/meta/<docid>", methods=["GET"])
def document_metadata(docid):
    try:
        results = get_document_metadata(docid)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
