// =====================
// RESULT STORAGE (SESSION)
// =====================

function saveResult(testType, severity, score) {
    let history = JSON.parse(localStorage.getItem("mindtrace_results")) || [];

    history.push({
        test: testType,
        severity: severity,
        score: score,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("mindtrace_results", JSON.stringify(history));
}

// =====================
// TEST BANK
// =====================

const tests = {
    depression: {
        title: "Depression Assessment",
        questions: [
            "Little interest or pleasure in activities.",
            "Feeling down or hopeless.",
            "Sleep disturbances.",
            "Low energy levels.",
            "Changes in appetite.",
            "Feeling worthless.",
            "Difficulty concentrating.",
            "Restlessness or slowing down.",
            "Thoughts of self-harm."
        ]
    },
    anxiety: {
        title: "Anxiety Assessment",
        questions: [
            "Feeling nervous or on edge.",
            "Unable to control worrying.",
            "Excessive worry.",
            "Difficulty relaxing.",
            "Restlessness.",
            "Irritability.",
            "Fear something bad may happen.",
            "Sudden panic episodes.",
            "Physical anxiety symptoms.",
            "Avoiding situations due to fear."
        ]
    },
    stress: {
        title: "Stress Assessment",
        questions: [
            "Feeling overwhelmed.",
            "Difficulty managing time.",
            "Physical tension.",
            "Trouble relaxing.",
            "Sleep disturbed by worries.",
            "Emotional exhaustion.",
            "Irritability under pressure.",
            "Reduced productivity.",
            "Frequent fatigue.",
            "Feeling unable to cope."
        ]
    },
    adhd: {
        title: "ADHD Screening",
        questions: [
            "Difficulty sustaining attention.",
            "Careless mistakes.",
            "Trouble organizing tasks.",
            "Avoiding mental effort.",
            "Frequently losing items.",
            "Easily distracted.",
            "Forgetfulness.",
            "Restlessness.",
            "Impulsive interruptions.",
            "Difficulty waiting turn."
        ]
    }
};

// =====================
// LOAD TEST
// =====================

const urlParams = new URLSearchParams(window.location.search);
const testType = urlParams.get("type");
const test = tests[testType];

document.getElementById("testTitle").innerText = test.title;

const form = document.getElementById("assessmentForm");
const progressBar = document.getElementById("progressBar");
const submitBtn = document.getElementById("submitBtn");

let answers = new Array(test.questions.length).fill(null);

test.questions.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    questionDiv.innerHTML = `
        <h4>${index + 1}. ${q}</h4>
        <div class="options">
            <div class="option-btn" onclick="selectOption(this, ${index}, 0)">Never</div>
            <div class="option-btn" onclick="selectOption(this, ${index}, 1)">Sometimes</div>
            <div class="option-btn" onclick="selectOption(this, ${index}, 2)">Often</div>
            <div class="option-btn" onclick="selectOption(this, ${index}, 3)">Always</div>
        </div>
    `;

    form.appendChild(questionDiv);
});

function selectOption(element, questionIndex, value) {
    const siblings = element.parentElement.querySelectorAll(".option-btn");
    siblings.forEach(btn => btn.classList.remove("active"));
    element.classList.add("active");
    answers[questionIndex] = value;
    updateProgress();
}

function updateProgress() {
    const answered = answers.filter(a => a !== null).length;
    const percent = (answered / answers.length) * 100;
    progressBar.style.width = percent + "%";

    if (answered === answers.length) {
        submitBtn.disabled = false;
        submitBtn.classList.add("enabled");
    }
}

function calculateScore() {
    let total = answers.reduce((a, b) => a + b, 0);

    let severity = "";
    let recommendation = "";

    if (total <= 10) {
        severity = "Low";
        recommendation = "Symptoms appear manageable.";
    }
    else if (total <= 20) {
        severity = "Moderate";
        recommendation = "Consider structured coping strategies.";
    }
    else {
        severity = "High";
        recommendation = "Professional consultation recommended.";
    }

    saveResult(testType, severity, total);

    document.getElementById("severityText").innerText =
        test.title + " Level: " + severity;

    document.getElementById("recommendationText").innerText =
        recommendation;

    document.getElementById("resultCard").style.display = "block";
}