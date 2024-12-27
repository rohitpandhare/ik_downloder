document.getElementById("searchButton").addEventListener("click", function () {
    const query = document.getElementById("searchQuery").value;
    if (query.trim() === "") {
        alert("Please enter a search term.");
        return;
    }
    fetchSearchResults(query, 0); // Start with the first page
});

async function fetchSearchResults(query, page = 0) {
    const response = await fetch(`/search?query=${query}&pagenum=${page}`);
    const data = await response.json();

    if (data.error) {
        console.error(data.error);
        alert("Error fetching data. Please try again.");
        return;
    }

    // Display search results
    displayResults(data.docs);

    // Create pagination (assuming total pages meta is available)
    const totalPages = data.total_pages || 1; // Default to 1 if not provided
    createPagination(query, page, totalPages);
}

function displayResults(results) {
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = ""; // Clear old results

    if (!results || results.length === 0) {
        resultsContainer.innerHTML = "<p>No results found for your search.</p>";
        return;
    }

    results.forEach(doc => {
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("result");
        resultDiv.innerHTML = `
            <h3>${doc.title}</h3>
            <p>${doc.snippet}</p>
            <a href="${doc.url}" target="_blank">Read more</a>
        `;
        resultsContainer.appendChild(resultDiv);
    });
}

function createPagination(query, currentPage, totalPages) {
    const paginationContainer = document.getElementById("paginationContainer");
    paginationContainer.innerHTML = ""; // Clear old pagination

    if (currentPage > 0) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "Previous";
        prevButton.onclick = () => fetchSearchResults(query, currentPage - 1);
        paginationContainer.appendChild(prevButton);
    }

    for (let i = 0; i < totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i + 1;
        if (i === currentPage) {
            pageButton.disabled = true;
        } else {
            pageButton.onclick = () => fetchSearchResults(query, i);
        }
        paginationContainer.appendChild(pageButton);
    }

    if (currentPage < totalPages - 1) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.onclick = () => fetchSearchResults(query, currentPage + 1);
        paginationContainer.appendChild(nextButton);
    }
}
