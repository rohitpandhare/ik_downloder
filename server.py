from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from ik_downloader import search_documents  # Import the function

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    pagenum = int(request.args.get('pagenum', 0))  # Get page number from URL, default to 0 (first page)
    
    if not query:
        return jsonify({'error': 'No query provided. Please provide a query to search.'}), 400

    try:
        results = search_documents(query, pagenum)  # Fetch specific page of results
        return jsonify(results)  # Return results for the requested page
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
