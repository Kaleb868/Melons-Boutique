// PRODUCTS.JS - Product Filtering and Display

document.addEventListener('DOMContentLoaded', function() {
    setupProductFilters();
    checkURLParameters();
});

// Setup product filters
function setupProductFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const products = document.querySelectorAll('.product-card');
    
    if (filterTabs.length === 0) return;
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get selected category
            const category = this.getAttribute('data-category');
            
            // Filter products
            filterProducts(category);
            
            // Update URL
            const newUrl = category === 'all' ? 
                'products.html' : 
                `products.html?category=${category}`;
            window.history.pushState({}, '', newUrl);
        });
    });
    
    // Sort dropdown
    const sortDropdown = document.getElementById('sort');
    if (sortDropdown) {
        sortDropdown.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

// Filter products by category
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (category === 'all') {
            product.style.display = 'block';
        } else {
            const productCategory = product.getAttribute('data-category');
            product.style.display = productCategory === category ? 'block' : 'none';
        }
    });
}

// Sort products
function sortProducts(sortBy) {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    const products = Array.from(container.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        if (sortBy === 'price-low') {
            const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
            return priceA - priceB;
        } else if (sortBy === 'price-high') {
            const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
            return priceB - priceA;
        } else if (sortBy === 'popular') {
            const ratingA = parseInt(a.querySelector('.rating-count').textContent.match(/\d+/)[0]);
            const ratingB = parseInt(b.querySelector('.rating-count').textContent.match(/\d+/)[0]);
            return ratingB - ratingA;
        }
        return 0;
    });
    
    // Re-append sorted products
    products.forEach(product => container.appendChild(product));
}

// Check URL parameters for category filter
function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        // Find and activate the correct tab
        const tab = document.querySelector(`[data-category="${category}"]`);
        if (tab) {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterProducts(category);
        }
    }
}