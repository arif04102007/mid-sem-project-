// script.js

// 1. Check for Browser Support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const languageSelect = document.getElementById("language");

languageSelect.addEventListener("change", () => {
    recognition.lang = languageSelect.value;
});
navigator.mediaDevices.getUserMedia({ audio: true })
  .catch(() => {
      alert("Microphone access is required for this app to work.");
  });



if (!SpeechRecognition) {
    alert("Your browser does not support Speech Recognition. Please try Google Chrome.");
} else {
    const recognition = new SpeechRecognition();
    
    // Configuration
    recognition.continuous = true;   // Keep listening even after user pauses
    recognition.interimResults = false; // Only show final results for now
    recognition.lang = 'en-US';

    // Select DOM elements
    const notePad = document.getElementById('note-pad');
    const micBtn = document.getElementById('mic-btn');
    const statusText = document.getElementById('status-text');

    let isListening = false;

    // 2. Toggle Start/Stop
    micBtn.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });

    // 3. Handle Start/End Events (UI Updates)
    recognition.onstart = () => {
        isListening = true;
        statusText.textContent = "Listening... (Try saying 'Dark Mode')";
        micBtn.classList.add('listening'); // Triggers CSS Pulse
    };

    recognition.onend = () => {
        isListening = false;
        statusText.textContent = "Click to start";
        micBtn.classList.remove('listening'); // Stops CSS Pulse
    };

    // 4. The Core Logic + Voice Commands
    recognition.onresult = (event) => {
        // Get the latest result
        const currentResultIndex = event.results.length - 1;
        const transcript = event.results[currentResultIndex][0].transcript.trim();
        
        // Convert to lowercase for command matching
        const command = transcript.toLowerCase();

        console.log("Heard:", command); // Debugging

        // --- COMMAND LOGIC ---
        
        if (command.includes('delete all') || command.includes('clear text')) {
            // Command: Clear Area
            notePad.value = "";
            statusText.textContent = "Text cleared!";
            setTimeout(() => statusText.textContent = "Listening...", 1500);
        } 
        else if (command.includes('dark mode')) {
            // Command: Dark Mode
            document.body.classList.add('dark-mode');
            statusText.textContent = "Dark mode activated 🌙";
        }
        else if (command.includes('light mode')) {
            // Command: Light Mode
            document.body.classList.remove('dark-mode');
            statusText.textContent = "Light mode activated ☀️";
        }
        else if (command.includes('stop listening')) {
            // Command: Stop Microphone
            recognition.stop();
        }
        else if (command.includes("save note")) {
    localStorage.setItem("speechPadData", notePad.value);
    statusText.textContent = "Note saved 💾";
        }
        else if (command.includes("new line")) {
    notePad.value += "\n";
       }


        else {
            // No command detected? Append text as normal note
            // Add a space if there is already text
            const previousText = notePad.value;
            notePad.value = previousText + (previousText.length > 0 ? " " : "") + transcript + ".";
        }
    };
    
    // Error Handling
    recognition.onerror = (event) => {
        console.error(event.error);
        statusText.textContent = "Error occurred: " + event.error;
    };
}
// Auto Save
notePad.addEventListener("input", () => {
    localStorage.setItem("speechPadData", notePad.value);
});

// Load Saved Data on Refresh
window.onload = () => {
    const saved = localStorage.getItem("speechPadData");
    if (saved) notePad.value = saved;
};
const counter = document.getElementById("counter");

function updateCounter() {
    const text = notePad.value.trim();
    const words = text === "" ? 0 : text.split(/\s+/).length;
    const chars = text.length;
    counter.textContent = `Words: ${words} | Characters: ${chars}`;
}

notePad.addEventListener("input", updateCounter);
const downloadBtn = document.getElementById("download-btn");

downloadBtn.addEventListener("click", () => {
    const blob = new Blob([notePad.value], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "speech-note.txt";
    link.click();
});
const copyBtn = document.getElementById("copy-btn");

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(notePad.value);
    statusText.textContent = "Copied to clipboard ✅";
});





