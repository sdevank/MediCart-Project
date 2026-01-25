document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // --- GLOBAL TOAST FUNCTION ---
    window.showToast = function(message, type = 'success') {
        let container = document.getElementById('toast-container');
        
        // Auto-create container if it doesn't exist
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        
        container.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // --- HANDLE LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                
                if (response.ok) {
                    showToast("Login successful! Redirecting...", "success");
                    localStorage.setItem('user', JSON.stringify(data.user)); 
                    sessionStorage.setItem('showWelcome', 'true');
                    setTimeout(() => window.location.href = 'home.html', 1500); // Wait 1.5s to see message
                } else {
                    showToast(data.error || "Login failed", "error");
                }
            } catch (error) {
                showToast("Server error. Please try again later.", "error");
            }
        });
    }

    // --- HANDLE SIGNUP ---
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('signup-email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showToast("Passwords do not match!", "error");
                return;
            }

            const formData = { firstName, lastName, email, phone, password };

            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    showToast("Signup successful! Please login.", "success");
                    setTimeout(() => window.location.href = 'login.html', 2000);
                } else {
                    showToast(data.message || 'Signup failed', "error");
                }
            } catch (error) {
                showToast('Server error. Please try again.', "error");
            }
        });
    }
});