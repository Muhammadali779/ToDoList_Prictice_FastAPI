// Authentication System

class AuthManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8000/api'; // FastAPI backend URL
        this.init();
    }

    init() {
        // Form switching
        this.setupFormSwitching();
        
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Password toggle
        this.setupPasswordToggle();
        
        // Password strength checker
        this.setupPasswordStrength();
        
        // Check if already logged in
        this.checkAuth();
    }

    setupFormSwitching() {
        const switchButtons = document.querySelectorAll('.switch-form');
        switchButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetForm = button.getAttribute('data-target');
                this.switchForm(targetForm);
            });
        });
    }

    switchForm(targetFormId) {
        const forms = document.querySelectorAll('.auth-form-wrapper');
        forms.forEach(form => {
            form.classList.remove('active');
        });
        
        const targetForm = document.getElementById(targetFormId);
        if (targetForm) {
            targetForm.classList.add('active');
        }
    }

    setupPasswordToggle() {
        const toggleButtons = document.querySelectorAll('.toggle-password');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const input = button.previousElementSibling;
                if (input && input.type === 'password') {
                    input.type = 'text';
                    button.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                    `;
                } else if (input) {
                    input.type = 'password';
                    button.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    `;
                }
            });
        });
    }

    setupPasswordStrength() {
        const signupForm = document.getElementById('signupForm');
        if (!signupForm) return;

        const passwordInput = signupForm.querySelector('input[type="password"]');
        if (!passwordInput) return;

        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            const strength = this.calculatePasswordStrength(password);
            this.updatePasswordStrengthUI(strength);
        });
    }

    calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength += 25;
        if (password.length >= 12) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 12.5;
        if (/[^a-zA-Z\d]/.test(password)) strength += 12.5;
        
        return Math.min(strength, 100);
    }

    updatePasswordStrengthUI(strength) {
        const strengthFill = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthFill || !strengthText) return;

        strengthFill.style.width = `${strength}%`;
        
        if (strength < 30) {
            strengthFill.style.background = '#EF4444';
            strengthText.textContent = 'Weak password';
            strengthText.style.color = '#EF4444';
        } else if (strength < 60) {
            strengthFill.style.background = '#F59E0B';
            strengthText.textContent = 'Fair password';
            strengthText.style.color = '#F59E0B';
        } else if (strength < 90) {
            strengthFill.style.background = '#10B981';
            strengthText.textContent = 'Good password';
            strengthText.style.color = '#10B981';
        } else {
            strengthFill.style.background = 'linear-gradient(90deg, #10B981, #059669)';
            strengthText.textContent = 'Strong password';
            strengthText.style.color = '#10B981';
        }
    }

    showLoading(show = true) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            if (show) {
                loadingOverlay.classList.add('active');
            } else {
                loadingOverlay.classList.remove('active');
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'error' ? '#EF4444' : type === 'success' ? '#10B981' : '#3B82F6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    async handleLogin(e) {
        e.preventDefault();
        this.showLoading(true);

        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store token
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                this.showNotification('Login successful! Redirecting...', 'success');
                
                // Redirect based on role
                setTimeout(() => {
                    this.redirectBasedOnRole(data.user.role);
                }, 1000);
            } else {
                throw new Error(data.detail || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification(error.message || 'Login failed. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        this.showLoading(true);

        const form = e.target;
        const formData = new FormData(form);
        
        const firstName = form.querySelector('input[placeholder="John"]').value;
        const lastName = form.querySelector('input[placeholder="Doe"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;

        // Validate passwords match
        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match!', 'error');
            this.showLoading(false);
            return;
        }

        // Validate password strength
        const strength = this.calculatePasswordStrength(password);
        if (strength < 30) {
            this.showNotification('Please use a stronger password!', 'error');
            this.showLoading(false);
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                this.showNotification('Account created successfully! Please sign in.', 'success');
                
                // Switch to login form
                setTimeout(() => {
                    this.switchForm('signinForm');
                }, 1500);
            } else {
                throw new Error(data.detail || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showNotification(error.message || 'Registration failed. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    checkAuth() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            // If on login page and already logged in, redirect
            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                const userData = JSON.parse(user);
                this.redirectBasedOnRole(userData.role);
            }
        }
    }

    redirectBasedOnRole(role) {
        switch(role) {
            case 'owner':
                window.location.href = 'dashboard.html';
                break;
            case 'admin':
                window.location.href = 'dashboard.html';
                break;
            case 'member':
                window.location.href = 'my-tasks.html';
                break;
            default:
                window.location.href = 'dashboard.html';
        }
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize auth manager
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});