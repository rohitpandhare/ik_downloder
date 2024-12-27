from flask import Flask, request, jsonify
from ik_downloder import search_documents  # Ensure this path is correct
import os

app = Flask(__name__)

@app.route('/api/search', methods=['GET'])
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
        docs = search_documents(query, page_num)
        return jsonify({'docs': docs})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def handler(event, context):
    """
    Vercel serverless function handler to adapt Flask's request and response cycle.

    Args:
        event (dict): The event object containing request data.
        context (dict): The context object containing runtime information.

    Returns:
        dict: A response object compatible with Vercel's expectations.
    """
    with app.test_request_context(
        path=event.get('path', ''),
        method=event.get('httpMethod', 'GET'),
        query_string=event.get('queryStringParameters') or {},
        headers=event.get('headers') or {},
        data=event.get('body') or ''
    ):
        response = app.full_dispatch_request()
        return {
            'statusCode': response.status_code,
            'body': response.get_data(as_text=True),
            'headers': dict(response.headers)
        }
