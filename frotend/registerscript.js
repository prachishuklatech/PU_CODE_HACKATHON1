// // Get Form Elements




// const form = document.getElementById("registrationForm");
// const passwordInput = document.getElementById("password");
// const passwordStrength = document.getElementById("password-strength");
// const voiceButton = document.getElementById("startVoice");
// const voiceFeedback = document.getElementById("voiceFeedback");
// const voicePlaybackSection = document.getElementById("voicePlaybackSection");
// const audioPlayer = document.getElementById("audioPlayer");

// let recognition; // To store the SpeechRecognition instance
// let audioBlob; // To store the recorded audio as a Blob

// // Initially disable the voice button
// voiceButton.disabled = true;

// // Add Event Listener for Password Input
// passwordInput.addEventListener("input", () => {
//   const strength = getPasswordStrength(passwordInput.value);
//   updatePasswordStrength(strength);
// });

// // Password Strength Checker
// function getPasswordStrength(password) {
//   let strength = 0;

//   // Criteria for password strength
//   if (password.length >= 8) strength++;
//   if (/[A-Z]/.test(password)) strength++;
//   if (/[a-z]/.test(password)) strength++;
//   if (/[0-9]/.test(password)) strength++;
//   if (/[^A-Za-z0-9]/.test(password)) strength++;

//   return strength;
// }

// // Update Password Strength Visuals
// function updatePasswordStrength(strength) {
//   passwordStrength.style.marginTop = "10px";

//   if (strength === 0) {
//     passwordStrength.textContent = "";
//     passwordStrength.style.color = "transparent";
//     voiceButton.disabled = true; // Disable voice button
//   } else if (strength <= 2) {
//     passwordStrength.textContent = "Weak";
//     passwordStrength.style.color = "red";
//     voiceButton.disabled = true; // Disable voice button
//   } else if (strength === 3 || strength === 4) {
//     passwordStrength.textContent = "Moderate";
//     passwordStrength.style.color = "orange";
//     voiceButton.disabled = true; // Disable voice button
//   } else {
//     passwordStrength.textContent = "Strong";
//     passwordStrength.style.color = "green";
//     voiceButton.disabled = false; // Enable voice button
//   }
// }
// recordButton.addEventListener("click", function () {
//   navigator.mediaDevices.getUserMedia({ audio: true })
//       .then(function (stream) {
//           mediaRecorder = new MediaRecorder(stream);

//           mediaRecorder.ondataavailable = function (event) {
//               audioChunks.push(event.data);
//           };

//           mediaRecorder.onstop = function () {
//               audioBlob = new Blob(audioChunks, { type: "audio/wav" });
//               audioUrl = URL.createObjectURL(audioBlob);
//               audioPlayback.src = audioUrl;

//               // Enable the Submit button after recording
//               submitButton.disabled = false;
//               statusMessage.textContent = "Recording completed. You can now submit your voice.";
//           };

//           mediaRecorder.start();
//           recordButton.disabled = true; // Disable record button while recording
//           stopButton.disabled = false; // Enable stop button while recording
//           statusMessage.textContent = "Recording...";

//       })
//       .catch(function (error) {
//           console.error("Error accessing microphone: ", error);
//           statusMessage.textContent = "Error accessing microphone. Please try again.";
//       });
// });

// // Stop recording the audio
// stopButton.addEventListener("click", function () {
//   mediaRecorder.stop();
//   stopButton.disabled = true; // Disable stop button after stopping
//   recordButton.disabled = false; // Enable record button to record again
//   statusMessage.textContent = "Stopping the recording...";
// });

// // Submit the recorded voice for verification
// submitButton.addEventListener("click", function () {
//   const formData = new FormData();
//   formData.append("voiceAudio", audioBlob, "voice.wav");

//   fetch("http://localhost:3000/verify-voice", {
//       method: "POST",
//       body: formData,
//   })
//       .then(response => response.json())
//       .then(result => {
//           if (result.success) {
//               statusMessage.textContent = "Voice authentication successful! Redirecting...";
//               setTimeout(function () {
//                   window.location.href = "/dashboard.html"; // Redirect to dashboard
//               }, 2000);
//           } else {
//               statusMessage.textContent = "Voice authentication failed. Please try again.";
//           }
//       })
//       .catch(error => {
//           console.error("Error during voice verification: ", error);
//           statusMessage.textContent = "Voice verification failed. Please try again later.";
//       });
// });


// Get Form Elements
const form = document.getElementById("registrationForm");
const passwordInput = document.getElementById("password");
const passwordStrength = document.getElementById("password-strength");
const voiceButton = document.getElementById("startVoice");
const voiceFeedback = document.getElementById("voiceFeedback");
const voicePlaybackSection = document.getElementById("voicePlaybackSection");
const audioPlayer = document.getElementById("audioPlayer");
const submitButton = document.getElementById("submitButton");
const securityQuestion1 = document.getElementById("securityQuestion1");
const securityQuestion2 = document.getElementById("securityQuestion2");
const securityQuestion3 = document.getElementById("securityQuestion3");
const answer1 = document.getElementById("answer1");
const answer2 = document.getElementById("answer2");
const answer3 = document.getElementById("answer3");

let mediaRecorder;
let audioChunks = [];
let audioBlob;

// Initially disable the submit button
submitButton.disabled = true;

// Password Strength Checker
passwordInput.addEventListener("input", () => {
  const strength = getPasswordStrength(passwordInput.value);
  updatePasswordStrength(strength);
});

// Password Strength Checker
function getPasswordStrength(password) {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return strength;
}

// Update Password Strength Visuals
function updatePasswordStrength(strength) {
  passwordStrength.style.marginTop = "10px";
  if (strength === 0) {
    passwordStrength.textContent = "";
    passwordStrength.style.color = "transparent";
    voiceButton.disabled = true; // Disable voice button
  } else if (strength <= 2) {
    passwordStrength.textContent = "Weak";
    passwordStrength.style.color = "red";
    voiceButton.disabled = true; // Disable voice button
  } else if (strength === 3 || strength === 4) {
    passwordStrength.textContent = "Moderate";
    passwordStrength.style.color = "orange";
    voiceButton.disabled = true; // Disable voice button
  } else {
    passwordStrength.textContent = "Strong";
    passwordStrength.style.color = "green";
    voiceButton.disabled = false; // Enable voice button
  }
}

// Check if exactly 3 questions are answered
function validateSecurityQuestions() {
  const selectedQuestions = [
    securityQuestion1.value,
    securityQuestion2.value,
    securityQuestion3.value,
  ];
  const uniqueQuestions = new Set(selectedQuestions);

  return uniqueQuestions.size === 3 && selectedQuestions.every((val, idx) => {
    return val && document.getElementById(`answer${idx + 1}`).value.trim() !== '';
  });
}

// Handle form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get Form Data
  const username = document.getElementById("username").value.trim();
  const password = passwordInput.value.trim();

  // Validate security questions and answers
  if (!validateSecurityQuestions()) {
    alert("Please answer exactly 3 unique security questions.");
    return;
  }

  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  // Security Questions & Answers
  formData.append("securityQuestion1", securityQuestion1.value);
  formData.append("answer1", answer1.value.trim());
  formData.append("securityQuestion2", securityQuestion2.value);
  formData.append("answer2", answer2.value.trim());
  formData.append("securityQuestion3", securityQuestion3.value);
  formData.append("answer3", answer3.value.trim());

  // Optional: Add voice data to form
  if (audioBlob) {
    formData.append("voiceAudio", audioBlob, "voice.wav");
  }

  fetch("http://localhost:3000/register", {
    method: "POST",
    body: formData,
  })
  .then((response) => response.json())
  .then((result) => {
    if (result.success) {
      alert("Registration successful!");
      window.location.href = "/login.html"; // Redirect to the login page
    } else {
      alert("Error during registration. Please try again.");
    }
  })
  .catch((error) => {
    console.error("Error during registration: ", error);
    alert("Registration failed. Please try again later.");
  });
});
