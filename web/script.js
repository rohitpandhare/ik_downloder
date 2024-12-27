document.getElementById("searchButton").addEventListener("click", async function() {
    const query = document.getElementById("searchQuery").value;

    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    try {
        // Updated to point to the serverless function
        const response = await fetch(`/search?query=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.error || "Unknown error occurred."}`);
            return;
        }

        const jsonData = await response.json();
        displayResults(jsonData.docs);
    } catch (error) {
        console.error('Fetch error:', error);
        alert("Error fetching data. Please try again.");
    }
});

function displayResults(docs) {
    const resultsContainer = document.getElementById("resultsContainer");
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
