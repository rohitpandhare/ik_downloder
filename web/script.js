// Handle the search button click event
document.getElementById("searchButton").addEventListener("click", async function () {
    const query = document.getElementById("searchQuery").value;

    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    // Define the base API URL dynamically (local or deployed environment)
    const BASE_URL = window.location.hostname === "localhost"
        ? "http://127.0.0.1:5000" // Localhost for development
        : "https://ik-downloder.vercel.app"; // Deployed Vercel backend

    // Fetch data from the backend
    try {
        const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
        
        if (response.ok) {
            const jsonData = await response.json();
            displayResults(jsonData.docs);
        } else {
            alert("Error fetching data. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching data. Please ensure the backend is running.");
    }
});

// Function to display the search results in the results container
function displayResults(docs) {
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = "";

    // Handle case where there are no results
    if (!docs || docs.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
    }

    // Loop through the docs and create result elements
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
