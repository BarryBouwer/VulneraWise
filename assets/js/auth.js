import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const forgotPw = document.getElementById('forgot-password');
  const resetPw = document.getElementById('reset-password');
  
  // Grabbing the baseURL from the meta tag
  const baseUrl = document.querySelector('meta[name="site-base-url"]')?.content;

  // Define the API base URL as a variable (you can change this in one place when switching between local and remote)
  const baseApiUrl = 'http://localhost:3001'; // Change this later to your remote API URL

  function handleMessageBox(messageBox) {
    return {
      show: (text) => {
        messageBox.textContent = text;
        messageBox.classList.remove('translate-y-40');
      },
      hide: () => {
        messageBox.textContent = '';
        messageBox.classList.add('translate-y-40');
      },
      tempShow: (text, duration = 3000) => {
        messageBox.textContent = text;
        messageBox.classList.remove('translate-y-40');
        setTimeout(() => {
          messageBox.textContent = '';
          messageBox.classList.add('translate-y-40');
        }, duration);
      }
    };
  }

  // 🚀 Signup
  if (signupForm) {
    const messageBox = handleMessageBox(document.getElementById('signup-message'));

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            company: form.company.value,
            password: form.password.value,
            confirmPassword: form.confirmPassword.value,
        };

        // Password format validation (uppercase, lowercase, number, special character)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#-])[A-Za-z\d@$!%*?&.#-]{8,}$/;

        // Check if passwords match
        if (data.password !== data.confirmPassword) {
            messageBox.tempShow('Passwords do not match.');
            return;
        }

        // Check if password is strong enough
        if (!passwordRegex.test(data.password)) {
            messageBox.tempShow('Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }

        messageBox.show('Loading...');

        try {
            const res = await axios.post(`${baseApiUrl}/signup`, { ...data, baseUrl }); // Use baseApiUrl
            messageBox.tempShow(res.data.message || 'Signup successful!');
            form.reset();
        } catch (err) {
            messageBox.tempShow(err.response?.data?.error || 'Signup failed');
        }
    });
  }

  // 🔐 Login
  if (loginForm) {
    const messageBox = handleMessageBox(document.getElementById('login-message'));
  
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const data = {
        email: form.email.value,
        password: form.password.value,
      };
  
      const rememberMe = form.rememberMe.checked;
  
      messageBox.show('Loading...');
  
      try {
        const res = await axios.post(`${baseApiUrl}/login`, data);
        messageBox.tempShow(`Welcome, ${res.data.user.firstName.toUpperCase()}!`);

        if (rememberMe) {
          const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
          const userWithExpiry = { user: res.data.user, expiry };
          localStorage.setItem('rememberedUser', JSON.stringify(userWithExpiry));
        } else {
          sessionStorage.setItem('user', JSON.stringify(res.data.user));
        }
  
        setTimeout(() => {
          window.location.href = baseUrl;
        }, 1500);
      } catch (err) {
        messageBox.tempShow(err.response?.data?.error || 'Login failed');
      }
    });
  }

  // 🔁 Forgot Password
  if (forgotPw) {
    forgotPw.addEventListener('submit', async (e) => {
      const messageBox = handleMessageBox(document.getElementById('forget-message'));
  
      e.preventDefault();
      const form = e.target;
      const email = form.email.value;
  
      messageBox.show('Loading...');

      // Send baseUrl to backend for password reset
      try {
        const res = await axios.post(`${baseApiUrl}/forgot-password`, { email, baseUrl }); // Use baseApiUrl
        messageBox.tempShow('Password reset link sent to email.');
        form.reset();
      } catch (err) {
        messageBox.tempShow(err.response?.data?.error || 'Something went wrong');
      }
    });
  }

  // Reset password
  if (resetPw) {
    resetPw.addEventListener('submit', async (e) => {
      const messageBox = handleMessageBox(document.getElementById('reset-message'));

      e.preventDefault();
    
      const password = resetPw.password.value;
      const confirmPassword = resetPw.confirmPassword.value;
      const token = new URLSearchParams(window.location.search).get('token');
      const email = new URLSearchParams(window.location.search).get('email');
    
      // Validate passwords
      if (password !== confirmPassword) {
        messageBox.tempShow("Passwords don't match!");
        return;
      }
    
      // Strong password validation
      const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#-])[A-Za-z\d@$!%*?&.#-]{8,}$/;
      if (!strongPasswordPattern.test(password)) {
        messageBox.tempShow("Password must contain at least 8 characters, one uppercase letter, one number, and one special character.");
        return;
      }
    
      messageBox.show('Loading...');

      try {
        const res = await axios.post(`${baseApiUrl}/reset-password`, {
          token,
          email,
          password
        }); // Use baseApiUrl
    
        messageBox.tempShow(res.data.message); // Success message
        window.location.href = `${baseUrl}/login`; // Redirect to login page after successful reset
      } catch (err) {
        messageBox.tempShow(err.response?.data?.error || 'Error resetting password');
      }
    });
  }
});