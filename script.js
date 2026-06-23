const quizData = [
  {
    type: "single",
    question: "Which language is used for web development?",
    options: ["Python", "JavaScript", "C++", "Java"],
    answer: "JavaScript"
  },
  {
    type: "multi",
    question: "Select all front-end technologies:",
    options: ["HTML", "CSS", "Node.js", "React"],
    answer: ["HTML", "CSS", "React"]
  },
  {
    type: "fill",
    question: "Fill in the blank: CSS stands for ______.",
    answer: "Cascading Style Sheets"
  },
  {
    type: "single",
    question: "Which tag is used for creating hyperlinks in HTML?",
    options: ["<link>", "<a>", "<href>", "<p>"],
    answer: "<a>"
  }
];

// Shuffle questions for randomness
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("result");
const submitButton = document.getElementById("submit");
const timerDisplay = document.getElementById("timer");

let timeLeft = 60; // seconds
let timer;

function buildQuiz() {
  const shuffledData = shuffle(quizData);
  shuffledData.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    const questionText = document.createElement("p");
    questionText.textContent = `${index + 1}. ${q.question}`;
    questionDiv.appendChild(questionText);

    if (q.type === "single") {
      q.options.forEach(option => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="radio" name="q${index}" value="${option}"> ${option}`;
        questionDiv.appendChild(label);
        questionDiv.appendChild(document.createElement("br"));
      });
    } else if (q.type === "multi") {
      q.options.forEach(option => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" name="q${index}" value="${option}"> ${option}`;
        questionDiv.appendChild(label);
        questionDiv.appendChild(document.createElement("br"));
      });
    } else if (q.type === "fill") {
      const input = document.createElement("input");
      input.type = "text";
      input.name = `q${index}`;
      questionDiv.appendChild(input);
    }

    quizContainer.appendChild(questionDiv);
  });
}

function calculateScore() {
  let score = 0;

  quizData.forEach((q, index) => {
    if (q.type === "single") {
      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      if (selected && selected.value === q.answer) score++;
    } else if (q.type === "multi") {
      const selected = Array.from(document.querySelectorAll(`input[name="q${index}"]:checked`)).map(el => el.value);
      if (JSON.stringify(selected.sort()) === JSON.stringify(q.answer.sort())) score++;
    } else if (q.type === "fill") {
      const input = document.querySelector(`input[name="q${index}"]`);
      if (input && input.value.trim().toLowerCase() === q.answer.toLowerCase()) score++;
    }
  });

  resultContainer.textContent = `Your Score: ${score} / ${quizData.length}`;
  clearInterval(timer);
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      calculateScore();
      submitButton.disabled = true;
      timerDisplay.textContent = "Time's up!";
    }
  }, 1000);
}

buildQuiz();
startTimer();
submitButton.addEventListener("click", calculateScore);

