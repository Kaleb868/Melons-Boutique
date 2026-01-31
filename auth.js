// AUTH.JS - Authentication Functionality

document.addEventListener('DOMContentLoaded', function() {
    const loginCard = document.getElementById('loginCard');
    const registerCard = document.getElementById('registerCard');
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Toggle between login and register forms
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginCard.style.display = 'none';
            registerCard.style.display = 'block';
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            registerCard.style.display = 'none';
            loginCard.style.display = 'block';
        });
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const remember = document.querySelector('input[name="remember"]').checked;

            // Simple validation
            if (!email || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Simulate login (in production, this would call an API)
            const userData = {
                email: email,
                name: email.split('@')[0],
                loginTime: new Date().toISOString()
            };

            // Store user data
            if (remember) {
                localStorage.setItem('melonsUser', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('melonsUser', JSON.stringify(userData));
            }

            showNotification('Login successful!', 'success');
            
            // Redirect after short delay
            setTimeout(() => {
                const returnUrl = new URLSearchParams(window.location.search).get('return') || 'index.html';
                window.location.href = returnUrl;
            }, 1000);
        });
    }

    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('register-firstname').value;
            const lastName = document.getElementById('register-lastname').value;
            const email = document.getElementById('register-email').value;
            const phone = document.getElementById('register-phone').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const agreeTerms = document.querySelector('input[name="terms"]').checked;

            // Validation
            if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            if (!agreeTerms) {
                showNotification('Please agree to the terms and conditions', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }

            if (password.length < 8) {
                showNotification('Password must be at least 8 characters', 'error');
                return;
            }

            // Simulate registration (in production, this would call an API)
            const userData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                registrationDate: new Date().toISOString()
            };

            // Store user data
            localStorage.setItem('melonsUser', JSON.stringify(userData));

            showNotification('Account created successfully!', 'success');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }

    // Social login buttons
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.classList.contains('btn-facebook') ? 'Facebook' : 'Google';
            showNotification(`${provider} login is not available in demo mode`, 'error');
        });
    });
});

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('melonsUser') || sessionStorage.getItem('melonsUser');
}

// Get current user
function getCurrentUser() {
    const userData = localStorage.getItem('melonsUser') || sessionStorage.getItem('melonsUser');
    return userData ? JSON.parse(userData) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('melonsUser');
    sessionStorage.removeItem('melonsUser');
    window.location.href = 'index.html';
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
        font-family: 'Poppins', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.logout = logout;