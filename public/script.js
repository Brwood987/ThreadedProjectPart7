// Written by Ben Wood

// Base URL for the API
const apiUrl = 'http://localhost:3000/products';


//saitization function
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.innerText = input; // Escapes potentially harmful characters
    return div.innerHTML;
}

// Validate input with a regex pattern
function validateInput(input, pattern) {
    return pattern.test(input);
}

// Example patterns
const idPattern = /^\d+$/; // Numeric ID (e.g., "123")
const namePattern = /^[a-zA-Z0-9\s]+$/; // Alphanumeric and spaces (e.g., "Product Name")

// Load Products
document.getElementById('load-products').addEventListener('click', () => {
    fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('products-list');
            productList.innerHTML = ''; // Clear the list

            products.forEach(product => {
                const sanitizedProductId = sanitizeInput(product.ProductId.toString());
                const sanitizedProductName = sanitizeInput(product.ProdName);

                const listItem = document.createElement('li');
                listItem.textContent = `ID: ${sanitizedProductId}, Name: ${sanitizedProductName}`;
                productList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});


// Add Product
document.getElementById('add-product-form').addEventListener('submit', event => {
    event.preventDefault();

    const rawProductName = document.getElementById('product-name').value;

    // Validate product name
    if (!validateInput(rawProductName, namePattern)) {
        alert('Invalid product name. Please use only alphanumeric characters and spaces.');
        return; // Stop processing if validation fails
    }

    const sanitizedProductName = sanitizeInput(rawProductName);

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ProdName: sanitizedProductName }),
    })
        .then(response => response.json())
        .then(data => {
            alert('Product added successfully!');
            document.getElementById('add-product-form').reset();
        })
        .catch(error => console.error('Error adding product:', error));
});



// Update Product
document.getElementById('update-product-form').addEventListener('submit', event => {
    event.preventDefault();

    const rawProductId = document.getElementById('update-product-id').value;
    const rawProductName = document.getElementById('update-product-name').value;

    // Validate product ID and name
    if (!validateInput(rawProductId, idPattern)) {
        alert('Invalid product ID. Please use only numeric values.');
        return;
    }
    if (!validateInput(rawProductName, namePattern)) {
        alert('Invalid product name. Please use only alphanumeric characters and spaces.');
        return;
    }

    const sanitizedProductId = sanitizeInput(rawProductId);
    const sanitizedProductName = sanitizeInput(rawProductName);

    fetch(`${apiUrl}/${sanitizedProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ProdName: sanitizedProductName }),
    })
        .then(response => response.json())
        .then(data => {
            alert('Product updated successfully!');
            document.getElementById('update-product-form').reset();
        })
        .catch(error => console.error('Error updating product:', error));
});


// Delete Product
document.getElementById('delete-product-form').addEventListener('submit', event => {
    event.preventDefault();

    const rawProductId = document.getElementById('delete-product-id').value;

    // Validate product ID
    if (!validateInput(rawProductId, idPattern)) {
        alert('Invalid product ID. Please use only numeric values.');
        return;
    }

    const sanitizedProductId = sanitizeInput(rawProductId);

    fetch(`${apiUrl}/${sanitizedProductId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            alert('Product deleted successfully!');
            document.getElementById('delete-product-form').reset();
        })
        .catch(error => console.error('Error deleting product:', error));
});


// Dark Mode Toggle Button
const toggleButton = document.getElementById('dark-mode-toggle');

// Check if dark mode is already enabled (from previous session)
const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
    toggleButton.textContent = 'Disable Dark Mode';
}

// Toggle dark mode on button click
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Save the user's preference in localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        toggleButton.textContent = 'Disable Dark Mode';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        toggleButton.textContent = 'Enable Dark Mode';
    }
});


