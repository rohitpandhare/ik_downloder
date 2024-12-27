// Event listener for the search button click
document.getElementById("searchButton").addEventListener("click", async function () {
    const query = document.getElementById("searchQuery").value;

    // Check if the query is empty
    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    // Define the Base API URL (dynamic based on environment)
    const BASE_URL = window.location.hostname === "localhost"
        ? "http://127.0.0.1:5000" // Local development
        : "https://ik-downloder.vercel.app"; // Deployed backend

    try {
        // Make an API call to the backend using the search query
        const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);

        // Check if the response is OK (HTTP Status 2xx)
        if (response.ok) {
            const jsonData = await response.json(); // Parse the JSON response
            displayResults(jsonData.docs); // Call the display function with the results
        } else if (response.status === 404) {
            alert("No results found for your search term.");
        } else {
            alert("An error occurred while fetching data. Please try again later.");
        }
    } catch (error) {
        console.error("Error while fetching data:", error);
        alert("An error occurred while connecting to the backend.");
    }
});

// Function to display search results in the results container
function displayResults(docs) {
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = ""; // Clear the container before adding new results

    // Check if there are no results
    if (!docs || docs.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
    }

    // Loop through the search results and create result elements
    docs.forEach((doc) => {
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("result");

        // Add search result details
        resultDiv.innerHTML = `
            <h3>${doc.title}</h3>
            <p><strong>Headline:</strong> ${doc.headline}</p>
            <p><strong>Published on:</strong> ${doc.publishdate}</p>
            <p><strong>Number of Citations:</strong> ${doc.numcitedby}</p>
            <p><a href="https://indiankanoon.org/doc/${doc.tid}" target="_blank">View Full Document</a></p>
        `;

        // Append the result to the container
        resultsContainer.appendChild(resultDiv);
    });
}
