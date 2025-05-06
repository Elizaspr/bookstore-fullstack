// addProduct.js

document.getElementById('addProductForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the form from reloading the page
  
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
  
    const bookData = {
      title,
      author,
      genre,
      price: parseFloat(price),  // Make sure price is a number
      description,
    };
  
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Book added successfully');
        // Optionally redirect to product list or clear form fields
      } else {
        alert('Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Error adding book');
    }
  });
  