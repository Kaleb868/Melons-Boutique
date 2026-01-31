// ORDER-CONFIRMATION.JS - Order Confirmation Page

document.addEventListener('DOMContentLoaded', function() {
    loadOrderData();
});

function loadOrderData() {
    // Get last order from localStorage
    const orderData = localStorage.getItem('lastOrder');
    
    if (!orderData) {
        // No order found, redirect to home
        window.location.href = 'index.html';
        return;
    }
    
    const order = JSON.parse(orderData);
    
    // Display order details
    document.getElementById('orderNumber').textContent = '#' + order.orderNumber;
    document.getElementById('orderDate').textContent = formatDate(order.date);
    document.getElementById('orderEmail').textContent = order.shipping.email;
    
    // Display order items
    displayOrderItems(order.items);
    
    // Display totals
    displayOrderTotals(order.totals);
    
    // Display shipping and payment info
    displayShippingInfo(order.shipping);
    displayPaymentInfo(order.payment);
}

function displayOrderItems(items) {
    const container = document.getElementById('confirmationItems');
    if (!container) return;
    
    container.innerHTML = items.map(item => `
        <div class="confirmation-item">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
}

function displayOrderTotals(totals) {
    document.getElementById('confirmSubtotal').textContent = `$${totals.subtotal.toFixed(2)}`;
    document.getElementById('confirmShipping').textContent = `$${totals.shipping.toFixed(2)}`;
    document.getElementById('confirmTax').textContent = `$${totals.tax.toFixed(2)}`;
    document.getElementById('confirmTotal').textContent = `$${totals.total.toFixed(2)}`;
}

function displayShippingInfo(shipping) {
    const container = document.getElementById('confirmShippingAddress');
    if (!container) return;
    
    container.innerHTML = `
        <p><strong>${shipping.firstName} ${shipping.lastName}</strong></p>
        <p>${shipping.address}</p>
        <p>${shipping.city}, ${shipping.region}</p>
        ${shipping.postalCode ? `<p>${shipping.postalCode}</p>` : ''}
        <p>${shipping.phone}</p>
    `;
}

function displayPaymentInfo(payment) {
    const container = document.getElementById('confirmPaymentMethod');
    if (!container) return;
    
    let paymentHtml = '';
    if (payment.method === 'card') {
        paymentHtml = `<p>Credit/Debit Card ending in ${payment.cardLast4}</p>`;
    } else if (payment.method === 'paypal') {
        paymentHtml = `<p>PayPal</p>`;
    } else {
        paymentHtml = `<p>Bank Transfer</p>`;
    }
    
    container.innerHTML = paymentHtml;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}