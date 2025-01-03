// document.getElementById('loginButton').addEventListener('click', function () {
//   const username = document.getElementById('username').value;
//   const password = document.getElementById('password').value;
//   const rememberMe = document.getElementById('rememberMe').checked;
//   const errorMessage = document.getElementById('error-message');

//   // Mock login credentials
//   const validUsername = 'user';
//   const validPassword = 'password123';

//   if (username === validUsername && password === validPassword) {
//       alert(`Login successful! Remember Me: ${rememberMe}`);
//       // Redirect to dashboard or main page
//       window.location.href = 'dashboard.html';
//   } else {
//       errorMessage.textContent = 'Invalid username or password!';
//       errorMessage.style.color = 'red';
//   }
// });
document.getElementById('loginButton').addEventListener('click', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const rememberMe = document.getElementById('rememberMe').checked;
  const errorMessage = document.getElementById('error-message');

  if (!username || !password) {
      errorMessage.textContent = 'Please enter both username and password.';
      errorMessage.style.color = 'red';
      return;
  }

  try {
      // Simulate login API call
      const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
          // If login is successful, redirect to OTP page
          window.location.href = '/otp.html';
      } else {
          // Display error message if credentials are incorrect
          errorMessage.textContent = 'Invalid credentials. Please try again.';
          errorMessage.style.color = 'red';
      }
  } catch (error) {
      console.error('Error during login:', error);
      errorMessage.textContent = 'Login failed. Please try again later.';
      errorMessage.style.color = 'red';
  }
});
