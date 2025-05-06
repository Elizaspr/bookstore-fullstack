
document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        // Check the file type and parse it
        const fileContent = event.target.result;
        let products = [];

        if (file.name.endsWith('.json')) {
            try {
                products = JSON.parse(fileContent); // Parse JSON file
            } catch (e) {
                alert('Error parsing JSON file.');
                return;
            }
        } else if (file.name.endsWith('.csv')) {
            // Handle CSV file parsing (You can use a library like PapaParse to parse CSV)
            alert('CSV parsing is not implemented yet!');
            return;
        } else if (file.name.endsWith('.txt')) {
            // Handle TXT file (this is an advanced option, and may need specific format parsing)
            alert('TXT file upload is not implemented yet!');
            return;
        } else {
            alert('Invalid file type. Please upload a JSON, CSV, or TXT file.');
            return;
        }

        // Now send the parsed data (assuming it's an array of products)
        fetch('/api/products/bulk', {
            method: 'POST',
            body: JSON.stringify(products),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            alert('Bulk upload successful!');
        })
        .catch(error => {
            console.error('Error during bulk upload:', error);
            alert('Error during bulk upload.');
        });
    };

    reader.readAsText(file); // Read the file as text
});
