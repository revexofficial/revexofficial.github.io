const answerBox = document.getElementById("answer");
const userAnswerBox = document.getElementById("userAnswer");
const feedback = document.getElementById("feedback");

// Teaching Answer (Mock logic)
function teachAnswer() {
  const question = document.getElementById("question").value.trim();
  if (!question) {
    answerBox.value = "Please enter a question first!";
    return;
  }
  // Simulated answer generator (replace with real AI or DB)
  const mockAnswer = `This is the detailed explanation for: ${question}`;
  answerBox.value = mockAnswer;
  localStorage.setItem("lastAnswer", mockAnswer);
}

// Read Answer Aloud
function readAnswer() {
  const text = answerBox.value;
  if (!text) return;
  const speech = new SpeechSynthesisUtterance(text);
  speech.rate = 1;
  speech.pitch = 1;
  speech.lang = "en-US";
  window.speechSynthesis.speak(speech);
}

// Check Answer Similarity
function checkAnswer() {
  const correct = answerBox.value.toLowerCase();
  const user = userAnswerBox.value.toLowerCase();
  if (!user) {
    feedback.innerText = "Write your version first!";
    return;
  }
  let score = 0;
  const words = correct.split(" ");
  words.forEach(word => {
    if (user.includes(word)) score++;
  });
  const percent = Math.floor((score / words.length) * 100);
  feedback.innerText = `Similarity Score: ${percent}%\nTip: Use keywords and explain in your own style!`;
}

// Fullscreen Mode
function enterFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }
}

// Export Answer as TXT
function exportAnswers() {
  const blob = new Blob(
    [`Question:\n${question.value}\n\nAnswer:\n${answerBox.value}`],
    { type: "text/plain;charset=utf-8" }
  );
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "BigAnswer.txt";
  link.click();
}

// Camera Upload + OCR
function startCamera() {
  document.getElementById("imageInput").click();
}

document.getElementById("imageInput").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const img = new Image();
    img.src = reader.result;

    img.onload = async function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const worker = Tesseract.createWorker();
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");

      const { data } = await worker.recognize(canvas);
      document.getElementById("question").value = data.text;
      await worker.terminate();
    };
  };
  reader.readAsDataURL(file);
});

// Load Memory
window.onload = function () {
  const last = localStorage.getItem("lastAnswer");
  if (last) answerBox.value = last;
};

// Particle Background
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "#00f5d4";
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();
