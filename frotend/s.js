// Get form and elements
const form = document.getElementById("securityForm");
const submitButton = document.getElementById("submitBtn");
const statusMessage = document.getElementById("statusMessage");

// Predefined correct answers (these can be dynamically fetched from the server in real-world scenarios)
const correctAnswers = {
    answer1: "smith",  // Example answer for mother's maiden name
    answer2: "buddy",  // Example answer for first pet
    answer3: "greenwood" // Example answer for school name
};

// Handle form submission
form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Get user inputs
    const answer1 = document.getElementById("answer1").value.trim().toLowerCase();
    const answer2 = document.getElementById("answer2").value.trim().toLowerCase();
    const answer3 = document.getElementById("answer3").value.trim().toLowerCase();

    // Check if answers match the predefined correct answers
    if (answer1 === correctAnswers.answer1 && answer2 === correctAnswers.answer2 && answer3 === correctAnswers.answer3) {
        statusMessage.textContent = "Authentication successful!";
        statusMessage.style.color = "green";

        // Redirect to a new page after successful authentication (e.g., home page)
        setTimeout(() => {
            window.location.href = "home.html";  // Redirect to home page
        }, 2000);
    } else {
        statusMessage.textContent = "Authentication failed. Please try again.";
        statusMessage.style.color = "red";
    }
});
