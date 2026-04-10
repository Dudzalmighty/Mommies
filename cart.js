// Momsies - Shopping Cart Logic
// Uses localStorage to save cart items across all pages

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('momsiesCart');
    if (cart) {
        return JSON.parse(cart);
    }
    return [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('momsiesCart', JSON.stringify(cart));
    updateCartCount();
}

// Add item to cart
function addToCart(productId, productName, productPrice, productImage) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            image: productImage || 'https://placehold.co/100x100/f7c9c0/b45f4b?text=Product',
            quantity: 1
        });
    }

    saveCart(cart);
    showAddedToCartMessage(productName);
    return cart;
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    if (typeof displayCart === 'function') {
        displayCart();
    }
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        newQuantity = parseInt(newQuantity);
        if (newQuantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        } else {
            item.quantity = newQuantity;
        }
        saveCart(cart);
    }
    if (typeof displayCart === 'function') {
        displayCart();
    }
}

// Clear entire cart
function clearCart() {
    localStorage.removeItem('momsiesCart');
    if (typeof displayCart === 'function') {
        displayCart();
    }
    updateCartCount();
}

// Get cart total
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get total items count
function getTotalItems() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Update cart count badge
function updateCartCount() {
    const totalItems = getTotalItems();
    const cartCountElements = document.querySelectorAll('.cart-count');

    cartCountElements.forEach(element => {
        if (totalItems > 0) {
            element.textContent = totalItems;
            element.style.display = 'inline-flex';
        } else {
            element.style.display = 'none';
        }
    });
}

// Show "Added to cart" message
function showAddedToCartMessage(productName) {
    const message = document.createElement('div');
    message.innerHTML = '<div style="position: fixed; bottom: 20px; right: 20px; background: #b45f4b; color: white; padding: 14px 24px; border-radius: 50px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.2); font-weight: 500;">✅ ' + productName + ' added to cart!</div>';
    document.body.appendChild(message);
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
});
