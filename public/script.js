// Written by Ben Wood

// Base URL for the API
const apiUrl = 'http://localhost:3000/products';

// Load Products
document.getElementById('load-products').addEventListener('click', () => {
    fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('products-list');
            productList.innerHTML = ''; // Clear the list
            products.forEach(product => {
                const listItem = document.createElement('li');
                listItem.textContent = `ID: ${product.ProductId}, Name: ${product.ProdName}`;
                productList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});

// Add Product
document.getElementById('add-product-form').addEventListener('submit', event => {
    event.preventDefault();

    const productName = document.getElementById('product-name').value;

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ProdName: productName }),
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

    const productId = document.getElementById('update-product-id').value;
    const productName = document.getElementById('update-product-name').value;

    fetch(`${apiUrl}/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ProdName: productName }),
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

    const productId = document.getElementById('delete-product-id').value;

    fetch(`${apiUrl}/${productId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            alert('Product deleted successfully!');
            document.getElementById('delete-product-form').reset();
        })
        .catch(error => console.error('Error deleting product:', error));
});
