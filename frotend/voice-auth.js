// // Variables for recording
// let mediaRecorder;
// let recordedChunks = [];

// // HTML Elements
// const recordButton = document.getElementById('recordButton');
// const stopButton = document.getElementById('stopButton');
// const audioPlayback = document.getElementById('audioPlayback');
// const submitButton = document.getElementById('submitButton');
// const statusMessage = document.getElementById('statusMessage');

// // Start Recording
// recordButton.addEventListener('click', async () => {
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         mediaRecorder = new MediaRecorder(stream);

//         mediaRecorder.ondataavailable = (event) => {
//             if (event.data.size > 0) {
//                 recordedChunks.push(event.data);
//             }
//         };

//         mediaRecorder.onstop = () => {
//             const blob = new Blob(recordedChunks, { type: 'audio/webm' });
//             audioPlayback.src = URL.createObjectURL(blob);
//             submitButton.disabled = false;
//         };

//         mediaRecorder.start();
//         recordButton.disabled = true;
//         stopButton.disabled = false;
//         statusMessage.textContent = "Recording...";
//     } catch (err) {
//         console.error("Error accessing microphone:", err);
//         statusMessage.textContent = "Error accessing microphone. Please check your permissions.";
//     }
// });

// // Stop Recording
// stopButton.addEventListener('click', () => {
//     mediaRecorder.stop();
//     recordButton.disabled = false;
//     stopButton.disabled = true;
//     statusMessage.textContent = "Recording stopped. You can play it back or submit.";
// });

// // Submit Voice
// submitButton.addEventListener('click', async () => {
//     const blob = new Blob(recordedChunks, { type: 'audio/webm' });
//     const formData = new FormData();
//     formData.append('voiceSample', blob);

//     statusMessage.textContent = "Processing...";

//     try {
//         const response = await fetch('/verify-voice', {
//             method: 'POST',
//             body: formData,
//         });

//         const result = await response.json();
//         if (result.success) {
//             statusMessage.textContent = "Voice verified successfully! Proceeding...";
//             // Redirect or perform next action
//             setTimeout(() => {
//                 window.location.href = "next-page.html";
//             }, 2000);
//         } else {
//             statusMessage.textContent = "Voice verification failed. Please try again.";
//         }
//     } catch (err) {
//         console.error("Error submitting voice sample:", err);
//         statusMessage.textContent = "An error occurred. Please try again.";
//     }
// });
document.addEventListener("DOMContentLoaded", function () {
    const recordButton = document.getElementById("recordButton");
    const stopButton = document.getElementById("stopButton");
    const submitButton = document.getElementById("submitButton");
    const audioPlayback = document.getElementById("audioPlayback");
    const statusMessage = document.getElementById("statusMessage");

    let mediaRecorder;
    let audioChunks = [];
    let audioBlob;
    let audioUrl;

    // Start recording the audio
    recordButton.addEventListener("click", function () {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = function (event) {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = function () {
                    audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                    audioUrl = URL.createObjectURL(audioBlob);
                    audioPlayback.src = audioUrl;

                    // Enable the Submit button after recording
                    submitButton.disabled = false;
                    statusMessage.textContent = "Recording completed. You can now submit your voice.";
                };

                mediaRecorder.start();
                recordButton.disabled = true; // Disable record button while recording
                stopButton.disabled = false; // Enable stop button while recording
                statusMessage.textContent = "Recording...";

            })
            .catch(function (error) {
                console.error("Error accessing microphone: ", error);
                statusMessage.textContent = "Error accessing microphone. Please try again.";
            });
    });

    // Stop recording the audio
    stopButton.addEventListener("click", function () {
        mediaRecorder.stop();
        stopButton.disabled = true; // Disable stop button after stopping
        recordButton.disabled = false; // Enable record button to record again
        statusMessage.textContent = "Stopping the recording...";
    });

    // Submit the recorded voice for verification
    submitButton.addEventListener("click", function () {
        const formData = new FormData();
        formData.append("voiceAudio", audioBlob, "voice.wav");

        fetch("http://localhost:3000/verify-voice", {
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    statusMessage.textContent = "Voice authentication successful! Redirecting...";
                    setTimeout(function () {
                        window.location.href = "/dashboard.html"; // Redirect to dashboard
                    }, 2000);
                } else {
                    statusMessage.textContent = "Voice authentication failed. Please try again.";
                }
            })
            .catch(error => {
                console.error("Error during voice verification: ", error);
                statusMessage.textContent = "Voice verification failed. Please try again later.";
            });
    });
});
