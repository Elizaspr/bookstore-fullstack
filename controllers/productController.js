
const products = [
  { id: 1, name: 'Sunrise on the Reaping', category: 'fiction', price: 21.99, imageUrl: 'images/Sunrise.webp' },
  { id: 2, name: 'Quicksilver', category: 'fiction', price: 18.99, imageUrl: 'images/Quicksilver.webp' },
  { id: 3, name: 'Bonded in Death', category: 'fiction', price: 21.00, imageUrl: 'images/Bonded.webp' },
  { id: 4, name: 'King: A Life', category: 'non-fiction', price: 20.00, imageUrl: 'images/King.webp' },
  { id: 5, name: 'Lily\'s Promise: Holding on to Hope', category: 'non-fiction', price: 17.99, imageUrl: 'images/Lily\'s promise.webp' },
  { id: 6, name: 'Atomic Habits', category: 'non-fiction', price: 22.00, imageUrl: 'images/Atomic.webp' }
];

// In-memory cart (for simplicity, we will use an object to store cart data per user)
const carts = {};  // key will be userId, value will be the cart array

// Get all products (with optional search and category filtering)
exports.getAllProducts = (req, res) => {
  res.json(products);
};

// Search products by query and category
const bookProp = require('../models/bookProp'); 

// Search books by title and genre (optional)
exports.searchProducts = async (req, res) => {
  const { q, genre } = req.query;

  try {
    // Search books using bookProp model and pass in genre if provided
    const results = await bookProp.search(q, genre);

    // Sort books based on how well the title matches the search query
    results.sort((a, b) => {
      const aMatch = a.title.toLowerCase().includes(q.toLowerCase()) ? 1 : 0;
      const bMatch = b.title.toLowerCase().includes(q.toLowerCase()) ? 1 : 0;
      return bMatch - aMatch;  // The most relevant books come first
    });

    res.status(200).json(results); // Send sorted results to the frontend
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Error searching for books' });
  }
};


// Get a single product by ID
exports.getProductById = (req, res) => {
  const { id } = req.params;
  const product = products.find(product => product.id === parseInt(id));
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// Add a product to the cart
exports.addToCart = (req, res) => {
  const { userId, productId } = req.body; // Get userId and productId from request body

  // Find the product to add to the cart
  const product = products.find(p => p.id === parseInt(productId));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Initialize user's cart if it doesn't exist
  if (!carts[userId]) {
    carts[userId] = [];
  }

  // Add product to user's cart
  carts[userId].push(product);

  res.json({ message: `Product ${product.name} added to cart`, cart: carts[userId] });
};

// Remove a product from the cart
exports.removeFromCart = (req, res) => {
  const { userId } = req.body; // Get userId from request body
  const { id } = req.params; // Get product ID from URL parameters

  // Find the product to remove
  const productIndex = carts[userId].findIndex(product => product.id === parseInt(id));
  
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not in cart' });
  }

  // Remove product from the cart
  const removedProduct = carts[userId].splice(productIndex, 1);

  res.json({ message: `Product ${removedProduct[0].name} removed from cart`, cart: carts[userId] });
};

// Checkout (empty the cart)
exports.checkoutCart = (req, res) => {
  const { userId } = req.body; // Get userId from request body

  // Clear the user's cart
  if (carts[userId]) {
    carts[userId] = [];
  }

  res.json({ message: 'Cart checked out, cart is now empty' });
};

// add new book
exports.addProduct = async (req, res) => {
  try {
    const { title, author, genre, price, description } = req.body;

    if (!title || !author || !genre || !price || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newBook = { title, author, genre, price, description };
    const addedBook = await bookProp.add(newBook);

    res.status(201).json({ message: 'Book added successfully', book: addedBook });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Failed to add book' });
  }
};
// Controller for editing an existing product
exports.editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, imageUrl } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, {
      name,
      description,
      price,
      category,
      imageUrl
    }, { new: true });  // Returns the updated document

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};
// Controller for bulk uploading products from a JSON file
exports.bulkUploadProducts = async (req, res) => {
  const products = req.body;  

  try {
 
    await Product.insertMany(products);

    res.status(200).json({ message: 'Bulk upload successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error during bulk upload' });
  }
};