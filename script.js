
let audio = document.querySelector(".fa-microphone-lines");
let notAudio = document.querySelector(".fa-microphone-lines-slash");
let confirmation = document.querySelector(".recording p");
let textarea = document.querySelector("textarea");
let speakBtn = document.getElementById("speakBtn");
let clearBtn = document.getElementById("clearBtn");
let saveBtn = document.getElementById("saveBtn");
let notesList = document.getElementById("notesList");

notAudio.style.display = "none";



const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    confirmation.innerText = "Speech Recognition NOT supported in this browser";
}

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;
recognition.lang = 'en-IN';

let finalTranscript = "";



recognition.addEventListener("result", (e) => {
    let interim = "";

    for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;

        if (e.results[i].isFinal) {
            finalTranscript += transcript + " ";
        } else {
            interim += transcript;
        }
    }

    textarea.value = finalTranscript + interim;
});

recognition.addEventListener("end", () => {
    if (notAudio.style.display === "inline") {
        recognition.start();
    }
});

recognition.addEventListener("error", (e) => {
    confirmation.innerText = "Mic Error: " + e.error;
});



audio.addEventListener('click', () => {
    confirmation.innerText = "Listening...";
    audio.style.display = "none";
    notAudio.style.display = "inline";
    recognition.start();
});

notAudio.addEventListener('click', () => {
    confirmation.innerText = "Stopped";
    audio.style.display = "inline";
    notAudio.style.display = "none";
    recognition.stop();
});


saveBtn.addEventListener("click", () => {
    const text = textarea.value.trim();
    if (text === "") return;

    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    notes.unshift({
        id: Date.now(),
        text: text
    });

    localStorage.setItem("notes", JSON.stringify(notes));

    renderNotes();
});



function deleteNote(id) {
    let notes = JSON.parse(localStorage.getItem("notes") || "[]");
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
}



function renderNotes() {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    notesList.innerHTML = notes.map(note => `
        <div class="note">
            <button onclick="deleteNote(${note.id})">X</button>
            ${note.text}
        </div>
    `).join("");
}

renderNotes();
