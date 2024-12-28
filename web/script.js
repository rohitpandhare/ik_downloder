document.getElementById("searchButton").addEventListener("click", async function() {
    const query = document.getElementById("searchQuery").value;
    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    const response = await fetch(`https://legal-server-lac.vercel.app/search?query=${encodeURIComponent(query)}`);
    if (response.ok) {
        const jsonData = await response.json();
        displayResults(jsonData.docs);
    } else {
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
///////////
document.addEventListener("click", async function (event) {
    if (event.target && event.target.classList.contains("viewFullDocument")) {
        event.preventDefault();
        const docId = event.target.getAttribute("data-doc-id");
        const apiUrl = `https://api.indiankanoon.org/doc/${docId}/`;

        const headers = {
            Authorization: "Token YOUR_API_TOKEN", // Add your API token here
        };

        try {
            const response = await fetch(apiUrl, { headers });
            if (response.ok) {
                const documentData = await response.json();
                renderDocumentInline(documentData, docId); 
                createDownloadLink(docId);
            } else {
                alert("Failed to fetch the document. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred.");
        }
    }
});

function renderDocumentInline(documentData, docId) {
    const documentContainer = document.getElementById("documentContainer");
    documentContainer.innerHTML = `
        <h2>${documentData.title}</h2>
        <p>${documentData.text}</p>
        <p><strong>Published on:</strong> ${documentData.publishdate}</p>
    `;
}

function createDownloadLink(docId) {
    const downloadLink = document.createElement("a");
    downloadLink.href = `https://api.indiankanoon.org/origdoc/${docId}`;
    downloadLink.download = `LegalCase_${docId}.pdf`;
    downloadLink.textContent = "Download PDF";
    downloadLink.classList.add("downloadButton");
    document.getElementById("documentContainer").appendChild(downloadLink);
}
