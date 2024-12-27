from flask import Flask, request, jsonify
from ik_downloader import search_documents  # Ensure this is correct
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes. Modify as needed for security.

@app.route('/search', methods=['GET'])
def search():
    """
    API endpoint to search documents based on a query.

    Query Parameters:
        - query (str): The search query string.
        - page_num (int): (Optional) The page number for pagination.

    Returns:
        JSON response containing search results or error messages.
    """
    query = request.args.get('query')
    page_num = request.args.get('page_num', default=0, type=int)
    
    if not query:
        return jsonify({'error': 'No query provided. Please provide a query to search.'}), 400

    try:
        results = search_documents(query, page_num)
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Use the port provided by the environment, default to 5000
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', 'False') == 'True'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
