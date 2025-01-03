// document.addEventListener('DOMContentLoaded', function () {
//     const qrCodeSrc =
//         "data:image/png;base64,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";

//     const qrCodeContainer = document.getElementById('qrCode');
//     if (qrCodeContainer) {
//         qrCodeContainer.src = qrCodeSrc;
//     } else {
//         console.error('QR code container not found!');
//     }
// });
document.addEventListener('DOMContentLoaded', function () {
    const fetchQrBtn = document.getElementById('fetchQrBtn');
    const qrCodeDisplay = document.getElementById('qrCodeDisplay');
    const otpContainer = document.getElementById('otpContainer');
    const otpInput = document.getElementById('otpInput');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const statusMessage = document.getElementById('statusMessage');

    // Placeholder for the QR code URL
    let qrCodeUrl = ''; // We'll replace this with the real QR code URL later

    // Simulating QR Code Fetch (for testing)
    fetchQrBtn.addEventListener('click', function () {
        // Replace with actual QR Code URL from your server
        qrCodeUrl = 'http://yourserver.com/generate-qr-code'; // API endpoint to generate QR code

        // Display a real QR Code here (in a real scenario)
        qrCodeDisplay.innerHTML = `<img src="${qrCodeUrl}" alt="QR Code" />`;

        // Show OTP input container after QR code is displayed
        otpContainer.style.display = 'block';
    });

    // OTP Verification
    verifyOtpBtn.addEventListener('click', function () {
        const otp = otpInput.value.trim();
        
        if (otp === '') {
            statusMessage.textContent = 'Please enter the OTP.';
            return;
        }

        // Simulating OTP Verification (replace with actual verification logic)
        // Typically you would send the OTP to the backend for validation
        if (otp === '123456') { // Replace with actual OTP check
            statusMessage.textContent = 'OTP Verified! Redirecting to Voice Authentication...';

            // Redirect to Voice Authentication page if OTP is valid
            setTimeout(() => {
                window.location.href = 'voiceauth.html'; // Redirect to voice authentication page
            }, 2000); // Delay for 2 seconds before redirecting
        } else {
            statusMessage.textContent = 'Invalid OTP. Please try again.';
        }
    });
});
