// CART.JS - Shopping Cart Functionality

// Cart data structure
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('melonsCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartDisplay();
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('melonsCart', JSON.stringify(cart));
    updateCartCount();
}

// Add item to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || '',
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    
    // Show success message
    showNotification('Item added to cart!');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    showNotification('Item removed from cart');
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

// Calculate totals
function calculateTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10.00 : 0;
    const tax = subtotal * 0.125; // 12.5% tax
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
}

// Update cart display
function updateCartDisplay() {
    const emptyCart = document.getElementById('emptyCart');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartItems) cartItems.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'none';
    } else {
        if (emptyCart) emptyCart.style.display = 'none';
        if (cartItems) {
            cartItems.style.display = 'block';
            renderCartItems();
        }
        if (cartSummary) {
            cartSummary.style.display = 'block';
            updateSummary();
        }
    }
}

// Render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <div class="product-placeholder"></div>
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
            <div class="cart-item-total">
                <p class="item-total">$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

// Update summary
function updateSummary() {
    const totals = calculateTotals();
    
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${totals.shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${totals.tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;
}

// Update cart count in navbar
function updateCartCount() {
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    let badge = cartIcon.querySelector('.cart-badge');
    if (totalItems > 0) {
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.style.cssText = `
                position: absolute;
                top: -5px;
                right: -5px;
                background: #FF6B9D;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
            `;
            cartIcon.style.position = 'relative';
            cartIcon.appendChild(badge);
        }
        badge.textContent = totalItems;
    } else if (badge) {
        badge.remove();
    }
}

// Promo code functionality
let appliedPromo = null;

const promoCodes = {
    'WELCOME10': { discount: 0.10, type: 'percentage', name: 'WELCOME10' },
    'SAVE20': { discount: 0.20, type: 'percentage', name: 'SAVE20' },
    'FREESHIP': { discount: 10.00, type: 'fixed', name: 'FREESHIP' }
};

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    // Promo code application
    const applyPromoBtn = document.getElementById('applyPromo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', function() {
            const promoInput = document.getElementById('promoInput');
            const promoCode = promoInput.value.trim().toUpperCase();
            
            if (promoCodes[promoCode]) {
                appliedPromo = promoCodes[promoCode];
                showPromoApplied();
                updateSummary();
                showNotification('Promo code applied successfully!');
            } else {
                showNotification('Invalid promo code', 'error');
            }
        });
    }
    
    // Remove promo
    const removePromoBtn = document.getElementById('removePromo');
    if (removePromoBtn) {
        removePromoBtn.addEventListener('click', function() {
            appliedPromo = null;
            document.getElementById('promoApplied').style.display = 'none';
            updateSummary();
            document.getElementById('promoInput').value = '';
            showNotification('Promo code removed');
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
});

// Show promo applied
function showPromoApplied() {
    const promoApplied = document.getElementById('promoApplied');
    const promoName = document.getElementById('promoName');
    
    if (promoApplied && promoName) {
        promoName.textContent = appliedPromo.name;
        promoApplied.style.display = 'block';
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#8FD14F' : '#FF6B9D'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export cart data for checkout
function getCartData() {
    return {
        items: cart,
        totals: calculateTotals(),
        promo: appliedPromo
    };
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
}

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.getCartData = getCartData;
window.clearCart = clearCart;