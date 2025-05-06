function addToCart(userId, productId) {
    fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ userId, productId }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        loadCart(userId); // Reload the cart after adding an item
      })
      .catch(error => console.error('Error adding to cart:', error));
  }
  
  // Function to remove a product from the cart
  function removeFromCart(userId, productId) {
    fetch(`/api/cart/${productId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        loadCart(userId); // Reload the cart after removing an item
      })
      .catch(error => console.error('Error removing from cart:', error));
  }
  
  // Function to checkout the cart (empty the cart)
  function checkoutCart(userId) {
    fetch('/api/cart/checkout', {
      method: 'POST',
      body: JSON.stringify({ userId }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        loadCart(userId); // Clear cart display after checkout
      })
      .catch(error => console.error('Error during checkout:', error));
  }
  
  // Function to load and display the cart
  function loadCart(userId) {
    fetch(`/api/cart/${userId}`)
      .then(response => response.json())
      .then(cart => {
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = ''; // Clear previous cart items
  
        cart.forEach(item => {
          const cartItemDiv = document.createElement('div');
          cartItemDiv.classList.add('cart-item');
          cartItemDiv.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>$${item.price}</p>
            <button onclick="removeFromCart(${userId}, ${item.id})">Remove</button>
          `;
          cartItemsContainer.appendChild(cartItemDiv);
        });
      })
      .catch(error => console.error('Error loading cart:', error));
  }