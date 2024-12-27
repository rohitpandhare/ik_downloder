document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById("searchButton");
    const searchQueryInput = document.getElementById("searchQuery");
    const resultsContainer = document.getElementById("resultsContainer");

    searchButton.addEventListener("click", async () => {
        const query = searchQueryInput.value.trim();

        if (!query) {
            alert("Please enter a search term.");
            return;
        }

        try {
            const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);

            if (response.ok) {
                const jsonData = await response.json();
                displayResults(jsonData.docs);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error || 'Something went wrong. Please try again.'}`);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("An unexpected error occurred. Please try again later.");
        }
    });

    function displayResults(docs) {
        resultsContainer.innerHTML = "";

        if (!docs || docs.length === 0) {
            resultsContainer.innerHTML = "<p>No results found.</p>";
            return;
        }

        docs.forEach(doc => {
            const resultDiv = document.createElement("div");
            resultDiv.classList.add("result");
            resultDiv.innerHTML = `
                <h3>${doc.title}</h3>
                <p><strong>Headline:</strong> ${doc.headline}</p>
                <p><strong>Published on:</strong> ${doc.publishdate}</p>
                <p><strong>Number of Citations:</strong> ${doc.numcitedby}</p>
                <p><a href="https://indiankanoon.org/doc/${doc.tid}" target="_blank">View Full Document</a></p>
            `;
            resultsContainer.appendChild(resultDiv);
        });
    }
});
