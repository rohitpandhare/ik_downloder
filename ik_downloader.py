import requests
import json
import argparse
import logging
import os
import re
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ikapi")

API_TOKEN = "42dbe96677b0804527dc7d6bbfded7c3d0109a48"  # Replace with your actual API token

def search_documents(query, page_num=0):
    base_url = "https://api.indiankanoon.org/search/"
    payload = {
        "formInput": query,
        "pagenum": page_num,
    }
    headers = {"Authorization": f"Token {API_TOKEN}"}
    response = requests.post(base_url, headers=headers, data=payload)

    if response.status_code == 200:
        return response.json()
    else:
        logger.error(f"Error occurred: {response.status_code}, {response.text}")
        response.raise_for_status()

def sanitize_filename(filename):
    filename = filename.replace(' ', '_')
    filename = re.sub(r'[^\w\-]', '', filename)
    return filename

def save_search_results(query, pages=1):
    all_results = []

    for page in range(pages):
        results = search_documents(query, page)
        all_results.extend(results.get("docs", []))

    output_dir = "ik_data"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    sanitized_query = sanitize_filename(query)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"results_{sanitized_query}_{timestamp}.json"
    filepath = os.path.join(output_dir, filename)

    with open(filepath, "w", encoding='utf-8') as outfile:
        json.dump(all_results, outfile, indent=4, ensure_ascii=False)

    logger.info(f"Saved {len(all_results)} documents to {filepath}")

def get_arg_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument("-q", "--query", type=str, required=True, help="Search query string")
    parser.add_argument("-p", "--pages", type=int, default=1, help="Number of pages to fetch")
    return parser

if __name__ == "__main__":
    args = get_arg_parser().parse_args()
    save_search_results(args.query, args.pages)