document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const otpForm = document.getElementById('otp-form');

    // --- GLOBAL TOAST FUNCTION ---
    window.showToast = function(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        container.appendChild(toast);
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
            
            // Safe button selection
            const btn = loginForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            btn.disabled = true;

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
                    setTimeout(() => window.location.href = 'home.html', 1500); 
                } else {
                    showToast(data.error || "Login failed", "error");
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            } catch (error) {
                showToast("Server error. Please try again later.", "error");
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // --- HANDLE SIGNUP & OTP ---
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

            // Fallback button selection so it never crashes!
            const btn = document.getElementById('signup-btn') || signupForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending OTP...';
            btn.disabled = true;

            const formData = { firstName, lastName, email, phone, password };

            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    showToast("OTP sent to your email!", "info");
                    
                    // Hide signup form, show OTP form
                    document.getElementById('signup-box').style.display = 'none';
                    document.getElementById('otp-box').style.display = 'block';
                    document.getElementById('display-email').innerText = email;
                    
                    // Save email temporarily to verify later
                    sessionStorage.setItem('unverifiedEmail', email);
                } else {
                    showToast(data.message || 'Signup failed', "error");
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            } catch (error) {
                showToast('Server error. Please try again.', "error");
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // --- HANDLE OTP VERIFICATION ---
    if (otpForm) {
        otpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const otp = document.getElementById('otp-input').value;
            const email = sessionStorage.getItem('unverifiedEmail');

            // Fallback button selection
            const btn = document.getElementById('verify-btn') || otpForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
            btn.disabled = true;

            try {
                const response = await fetch('/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp })
                });

                const data = await response.json();

                if (response.ok) {
                    showToast("Account verified successfully!", "success");
                    sessionStorage.removeItem('unverifiedEmail'); // Clean up
                    setTimeout(() => window.location.href = 'login.html', 2000);
                } else {
                    showToast(data.message || 'Invalid OTP', "error");
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            } catch (error) {
                showToast('Server error. Please try again.', "error");
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }
});