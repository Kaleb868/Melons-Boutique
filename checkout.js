// CHECKOUT.JS - Checkout Process Functionality

let currentStep = 1;
let checkoutData = {
    shipping: {},
    payment: {},
    cart: {}
};

document.addEventListener('DOMContentLoaded', function() {
    // Load cart data
    loadCheckoutData();
    
    // Step navigation
    setupStepNavigation();
    
    // Payment method switching
    setupPaymentMethods();
    
    // Form formatting
    setupFormFormatting();
});

// Load checkout data
function loadCheckoutData() {
    // Get cart data from cart.js
    if (typeof getCartData === 'function') {
        checkoutData.cart = getCartData();
        displayOrderSummary();
    }
    
    // Pre-fill user data if logged in
    if (typeof getCurrentUser === 'function') {
        const user = getCurrentUser();
        if (user) {
            document.getElementById('firstName').value = user.firstName || '';
            document.getElementById('lastName').value = user.lastName || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('phone').value = user.phone || '';
        }
    }
}

// Display order summary
function displayOrderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    if (!summaryItems || !checkoutData.cart.items) return;
    
    summaryItems.innerHTML = checkoutData.cart.items.map(item => `
        <div class="summary-item">
            <div class="summary-item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-qty">x${item.quantity}</span>
            </div>
            <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    // Update totals
    const totals = checkoutData.cart.totals;
    document.getElementById('checkoutSubtotal').textContent = `$${totals.subtotal.toFixed(2)}`;
    document.getElementById('checkoutShipping').textContent = `$${totals.shipping.toFixed(2)}`;
    document.getElementById('checkoutTax').textContent = `$${totals.tax.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${totals.total.toFixed(2)}`;
}

// Setup step navigation
function setupStepNavigation() {
    // Continue to Payment
    document.getElementById('continueToPayment').addEventListener('click', function() {
        if (validateShippingForm()) {
            saveShippingData();
            goToStep(2);
        }
    });
    
    // Back to Shipping
    document.getElementById('backToShipping').addEventListener('click', function() {
        goToStep(1);
    });
    
    // Continue to Review
    document.getElementById('continueToReview').addEventListener('click', function() {
        if (validatePaymentForm()) {
            savePaymentData();
            displayReview();
            goToStep(3);
        }
    });
    
    // Back to Payment
    document.getElementById('backToPayment').addEventListener('click', function() {
        goToStep(2);
    });
    
    // Edit buttons in review
    document.getElementById('editShipping').addEventListener('click', () => goToStep(1));
    document.getElementById('editPayment').addEventListener('click', () => goToStep(2));
    
    // Place Order
    document.getElementById('placeOrder').addEventListener('click', function() {
        if (validateReview()) {
            placeOrder();
        }
    });
}

// Go to specific step
function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.checkout-step').forEach(s => s.style.display = 'none');
    
    // Show current step
    document.getElementById(`step${step}`).style.display = 'block';
    
    // Update progress
    document.querySelectorAll('.progress-step').forEach((s, index) => {
        if (index + 1 <= step) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
    
    currentStep = step;
    window.scrollTo(0, 0);
}

// Validate shipping form
function validateShippingForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const region = document.getElementById('region').value;
    
    if (!firstName || !lastName || !email || !phone || !address || !city || !region) {
        alert('Please fill in all required fields');
        return false;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    return true;
}

// Save shipping data
function saveShippingData() {
    checkoutData.shipping = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        region: document.getElementById('region').value,
        postalCode: document.getElementById('postalCode').value,
        specialInstructions: document.getElementById('specialInstructions').value
    };
}

// Validate payment form
function validatePaymentForm() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardName = document.getElementById('cardName').value.trim();
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        
        if (!cardNumber || !cardName || !expiryDate || !cvv) {
            alert('Please fill in all card details');
            return false;
        }
        
        if (cardNumber.length < 15 || cardNumber.length > 16) {
            alert('Please enter a valid card number');
            return false;
        }
        
        if (cvv.length < 3 || cvv.length > 4) {
            alert('Please enter a valid CVV');
            return false;
        }
    }
    
    return true;
}

// Save payment data
function savePaymentData() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    checkoutData.payment = {
        method: paymentMethod
    };
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        checkoutData.payment.cardLast4 = cardNumber.slice(-4);
        checkoutData.payment.cardName = document.getElementById('cardName').value;
    }
}

// Display review
function displayReview() {
    // Shipping info
    const shippingHtml = `
        <p><strong>${checkoutData.shipping.firstName} ${checkoutData.shipping.lastName}</strong></p>
        <p>${checkoutData.shipping.address}</p>
        <p>${checkoutData.shipping.city}, ${checkoutData.shipping.region}</p>
        <p>${checkoutData.shipping.phone}</p>
        <p>${checkoutData.shipping.email}</p>
    `;
    document.getElementById('reviewShipping').innerHTML = shippingHtml;
    
    // Payment info
    let paymentHtml = '';
    if (checkoutData.payment.method === 'card') {
        paymentHtml = `
            <p><strong>Credit/Debit Card</strong></p>
            <p>Card ending in ${checkoutData.payment.cardLast4}</p>
        `;
    } else if (checkoutData.payment.method === 'paypal') {
        paymentHtml = `<p><strong>PayPal</strong></p>`;
    } else {
        paymentHtml = `<p><strong>Bank Transfer</strong></p>`;
    }
    document.getElementById('reviewPayment').innerHTML = paymentHtml;
    
    // Order items
    const itemsHtml = checkoutData.cart.items.map(item => `
        <div class="review-item">
            <div class="review-item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-qty">Qty: ${item.quantity}</span>
            </div>
            <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    document.getElementById('reviewItems').innerHTML = itemsHtml;
}

// Validate review
function validateReview() {
    const agreeTerms = document.getElementById('agreeTerms').checked;
    if (!agreeTerms) {
        alert('Please agree to the terms and conditions');
        return false;
    }
    return true;
}

// Place order
function placeOrder() {
    // Generate order number
    const orderNumber = 'MB' + Date.now();
    
    // Store order data
    const orderData = {
        orderNumber: orderNumber,
        date: new Date().toISOString(),
        shipping: checkoutData.shipping,
        payment: checkoutData.payment,
        items: checkoutData.cart.items,
        totals: checkoutData.cart.totals,
        status: 'processing'
    };
    
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    // Clear cart
    if (typeof clearCart === 'function') {
        clearCart();
    }
    
    // Redirect to confirmation
    window.location.href = 'order-confirmation.html';
}

// Setup payment methods
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            document.getElementById('cardPayment').style.display = 'none';
            document.getElementById('paypalPayment').style.display = 'none';
            document.getElementById('bankPayment').style.display = 'none';
            
            if (this.value === 'card') {
                document.getElementById('cardPayment').style.display = 'block';
            } else if (this.value === 'paypal') {
                document.getElementById('paypalPayment').style.display = 'block';
            } else if (this.value === 'bank') {
                document.getElementById('bankPayment').style.display = 'block';
            }
        });
    });
}

// Setup form formatting
function setupFormFormatting() {
    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Expiry date formatting
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV - numbers only
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}