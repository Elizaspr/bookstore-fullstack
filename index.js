const express = require('express');
const path = require('path');
const app = express();
const port = 3000;  // You can change this to any available port

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Example route for the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Example API route for products
app.get('/api/products', (req, res) => {
  res.json([{ id: 1, name: 'Product 1', price: 9.99 }]);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});