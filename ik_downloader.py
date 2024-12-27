import requests
import json
import argparse
import logging
import os
import re
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ikapi")

# Retrieve API token from environment variables
API_TOKEN = os.getenv("9062b4e5cda73f8dbcc1c68f9336b9df2a4a5c8f")
if not API_TOKEN:
    logger.error("API_TOKEN is not set. Please set it as an environment variable.")
    raise EnvironmentError("API_TOKEN is not set.")

def search_documents(query, page_num=0):
    """
    Searches documents using the IndianKanoon API.

    Args:
        query (str): The search query string.
        page_num (int): The page number for pagination.

    Returns:
        list: A list of documents retrieved from the API.
    """
    base_url = "https://api.indiankanoon.org/search/"
    payload = {
        "formInput": query,
        "pagenum": page_num,
    }
    headers = {
        "Authorization": f"Token {API_TOKEN}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(base_url, headers=headers, json=payload)
        response.raise_for_status()
        logger.info(f"Successfully fetched data for query: '{query}' on page: {page_num}")
        data = response.json()
        return data.get("docs", [])
    except requests.exceptions.HTTPError as http_err:
        logger.error(f"HTTP error occurred: {http_err} - Response: {response.text}")
        raise
    except Exception as err:
        logger.error(f"An error occurred: {err}")
        raise

def sanitize_filename(filename):
    """
    Sanitizes the filename by replacing spaces with underscores and removing special characters.

    Args:
        filename (str): The original filename.

    Returns:
        str: The sanitized filename.
    """
    filename = filename.replace(' ', '_')
    filename = re.sub(r'[^\w\-]', '', filename)
    return filename

def save_search_results(query, pages=1):
    """
    Saves the search results into JSON files.

    Args:
        query (str): The search query string.
        pages (int): Number of pages to fetch.
    """
    all_results = []

    for page in range(pages):
        try:
            results = search_documents(query, page)
            docs = results.get("docs", [])
            if not docs:
                logger.info(f"No documents found on page {page}.")
            all_results.extend(docs)
        except Exception as e:
            logger.error(f"Failed to fetch page {page}: {e}")

    output_dir = "ik_data"
    os.makedirs(output_dir, exist_ok=True)

    sanitized_query = sanitize_filename(query)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"results_{sanitized_query}_{timestamp}.json"
    filepath = os.path.join(output_dir, filename)

    with open(filepath, "w", encoding='utf-8') as outfile:
        json.dump(all_results, outfile, indent=4, ensure_ascii=False)

    logger.info(f"Saved {len(all_results)} documents to {filepath}")

def get_arg_parser():
    """
    Configures the argument parser for command-line execution.

    Returns:
        argparse.ArgumentParser: The configured argument parser.
    """
    parser = argparse.ArgumentParser(description="Fetch and save documents from IndianKanoon API.")
    parser.add_argument("-q", "--query", type=str, required=True, help="Search query string")
    parser.add_argument("-p", "--pages", type=int, default=1, help="Number of pages to fetch")
    return parser

if __name__ == "__main__":
    args = get_arg_parser().parse_args()
    save_search_results(args.query, args.pages)
