import requests
import json
import logging
import os
from datetime import datetime

# Configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ikapi")

API_TOKEN = "42dbe96677b0804527dc7d6bbfded7c3d0109a48"  # Replace with your actual API token
BASE_URL = "https://api.indiankanoon.org"
HEADERS = {"Authorization": f"Token {API_TOKEN}"}


# Fetches search results from the Indian Kanoon API
def search_documents(query, page_num=0):
    url = f"{BASE_URL}/search/?formInput={query}&pagenum={page_num}"
    logger.info(f"Fetching search results for query: {query}, page: {page_num}")
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        return response.json()
    logger.error(f"Error: {response.status_code} - {response.text}")
    response.raise_for_status()


# Fetches document details by docid
def get_document(docid):
    url = f"{BASE_URL}/doc/{docid}/"
    logger.info(f"Fetching details for document: {docid}")
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        return response.json()
    logger.error(f"Error: {response.status_code} - {response.text}")
    response.raise_for_status()


# Fetches court copy of a document by docid
def get_court_copy(docid):
    url = f"{BASE_URL}/origdoc/{docid}/"
    logger.info(f"Fetching court copy for document: {docid}")
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        return response.json()
    logger.error(f"Error: {response.status_code} - {response.text}")
    response.raise_for_status()


# Fetches document fragments based on query and docid
def get_document_fragment(docid, query):
    url = f"{BASE_URL}/docfragment/{docid}/?formInput={query}"
    logger.info(f"Fetching document fragments for docid: {docid} and query: {query}")
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        return response.json()
    logger.error(f"Error: {response.status_code} - {response.text}")
    response.raise_for_status()


# Fetches metadata of a document
def get_document_metadata(docid):
    url = f"{BASE_URL}/docmeta/{docid}/"
    logger.info(f"Fetching metadata for document: {docid}")
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        return response.json()
    logger.error(f"Error: {response.status_code} - {response.text}")
    response.raise_for_status()


# Save fetched results to a file
def save_results(data, filename="output.json"):
    output_dir = "ik_data"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    filepath = os.path.join(output_dir, filename)
    with open(filepath, "w", encoding="utf-8") as outfile:
        json.dump(data, outfile, indent=4, ensure_ascii=False)
    logger.info(f"Results saved to {filepath}")
    return filepath


if __name__ == "__main__":
    # Example usage
    query = "freedom of speech"
    page_num = 1

    # Search example
    search_results = search_documents(query, page_num)
    save_results(search_results, "search_results.json")

    # Fetch details for a specific document
    docid = 123456
    document_details = get_document(docid)
    save_results(document_details, "document_details.json")

    # Fetch fragments
    fragments = get_document_fragment(docid, query)
    save_results(fragments, "document_fragments.json")
