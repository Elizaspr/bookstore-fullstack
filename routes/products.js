const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Public routes
router.get('/', productController.getAllProducts);                      // list of products
router.get('/search', productController.searchProducts);               // ?q=term&category=category
router.get('/:id', productController.getProductById);                  // product details

// Cart routes
router.post('/cart', productController.addToCart);
router.delete('/cart/:id', productController.removeFromCart);
router.post('/cart/checkout', productController.checkoutCart);

//admin routes
router.post('/', productController.addProduct);                        // add new product
router.put('/:id', productController.editProduct);                     // update product
router.post('/bulk', productController.bulkUploadProducts);            // upload JSON

module.exports = router;

// Admin routes for adding and editing products
router.post('/', productController.addProduct);  // Add new product
router.put('/:id', productController.editProduct);  // Edit existing product
router.post('/bulk', productController.bulkUploadProducts);  // Bulk upload products