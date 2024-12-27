// document.getElementById("searchButton").addEventListener("click", async function() {
//     const query = document.getElementById("searchQuery").value;
//     if (!query) {
//         alert("Please enter a search term.");
//         return;
//     }

//     const response = await fetch(`https://ik-downloder.vercel.app/search?query=${encodeURIComponent(query)}`);
//     if (response.ok) {
//         const jsonData = await response.json();
//         displayResults(jsonData.docs);
//     } else {
//         alert("Error fetching data. Please try again.");
//     }
// });

// function displayResults(docs) {
//     const resultsContainer = document.getElementById("resultsContainer");
//     resultsContainer.innerHTML = "";
//     if (!docs || docs.length === 0) {
//         resultsContainer.innerHTML = "<p>No results found.</p>";
//         return;
//     }

//     docs.forEach(doc => {
//         const resultDiv = document.createElement("div");
//         resultDiv.classList.add("result");
//         resultDiv.innerHTML = `
//             <h3>${doc.title}</h3>
//             <p><strong>Headline:</strong> ${doc.headline}</p>  
//             <p><strong>Published on:</strong> ${doc.publishdate}</p>
//             <p><strong>Number of Citations:</strong> ${doc.numcitedby}</p>
//             <p><a href="https://indiankanoon.org/doc/${doc.tid}" target="_blank">View Full Document</a></p>
//         `;
//         resultsContainer.appendChild(resultDiv);
//     });
// }

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) {
            displayError('Please enter a search query.');
            return;
        }

        // Optional: Handle pagination
        const pageNum = 0; // Modify as needed or make dynamic

        try {
            const response = await fetch(`/search?query=${encodeURIComponent(query)}&page_num=${pageNum}`);
            const data = await response.json();

            if (data.error) {
                displayError(data.error);
            } else {
                displayResults(data);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            displayError('An unexpected error occurred while fetching results.');
        }
    });

    function displayResults(data) {
        resultsContainer.innerHTML = '';

        if (data.docs && data.docs.length > 0) {
            data.docs.forEach(doc => {
                const docElement = document.createElement('div');
                docElement.className = 'doc';
                docElement.innerHTML = `
                    <h3>${doc.title}</h3>
                    <p>${doc.description}</p>
                    <a href="${doc.url}" target="_blank">View Document</a>
                `;
                resultsContainer.appendChild(docElement);
            });
        } else {
            resultsContainer.innerHTML = '<p>No documents found for your query.</p>';
        }
    }

    function displayError(message) {
        resultsContainer.innerHTML = `<p class="error">${message}</p>`;
    }
});
