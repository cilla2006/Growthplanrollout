// ======================================
// Growth Plan Player v1.0
// ======================================

// ---------- COURSE STATE ----------

let currentSlide = 0;
let score = 0;

// ---------- ELEMENTS ----------

const slideContainer = document.getElementById("slideContainer");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");

const slideCounter = document.getElementById("slideCounter");
const progressFill = document.getElementById("progressFill");

const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

// ---------- INITIALIZE ----------

init();

function init() {

    bindEvents();

    renderSlide();

}

// ---------- EVENTS ----------

function bindEvents() {

    nextBtn.addEventListener("click", nextSlide);

    backBtn.addEventListener("click", previousSlide);

    closeModal.addEventListener("click", closeImage);

    imageModal.addEventListener("click", closeImage);

}

// ---------- NAVIGATION ----------

function nextSlide() {

    if (currentSlide >= course.length - 1) {

               finishCourse();
 return;

    }

    currentSlide++;

    renderSlide();

}

function previousSlide() {

    if (currentSlide === 0) return;

    currentSlide--;

    renderSlide();

}

// ---------- PROGRESS ----------

function updateProgress() {

    slideCounter.textContent =
        `Slide ${currentSlide + 1} of ${course.length}`;

    const percent =
        ((currentSlide + 1) / course.length) * 100;

    progressFill.style.width = percent + "%";

}

// ---------- MAIN RENDER ----------

function renderSlide() {

    const slide = course[currentSlide];

    updateProgress();

    backBtn.disabled = currentSlide === 0;

   if (slide.audio) {

    nextBtn.disabled = true;

} else {

    nextBtn.disabled = false;

};

    switch (slide.type) {

        case "content":
            renderContent(slide);
            break;

        case "quiz":
            renderQuiz(slide);
            break;

        case "quizGroup":
            renderQuizGroup(slide);
            break;

        default:
            slideContainer.innerHTML =
                "<h2>Unknown slide type.</h2>";

            nextBtn.disabled = false;

    }

}

// ---------- CONTENT ----------

function renderContent(slide) {

    let text = "";

 const footer = `
        <div class="slide-footer">
            Developed by Yana Rassolko
        </div>
    `;

    // Title
    text += `<h2>${slide.title}</h2>`;

    // Intro
    if (slide.intro) {
        text += `<p>${slide.intro}</p>`;
    }

    // Section title
    if (slide.sectionTitle) {
        text += `<h3>${slide.sectionTitle}</h3>`;
    }
// Feature

if (slide.feature) {

    text += renderFeature(slide.feature);

}
    // ---------- CARDS ----------

if (slide.cards) {

    text += renderCards(slide.cards);

}
// Bullets
    if (slide.bullets) {
        text += renderBullets(slide.bullets);
    }
// ---------- NOTE ----------

if (slide.note) {

    text += `
        <div class="note">

            <strong>${slide.noteTitle}</strong>

            <p>${slide.note}</p>

        </div>
    `;

}


// ---------- AUDIO ----------

let audioHTML = "";

if (slide.audio) {

    audioHTML = `
        <audio id="slideAudio" controls preload="metadata">
            <source src="${slide.audio}" type="audio/mpeg">
            Your browser does not support audio.
        </audio>
    `;

}

   // ---------- SIDE LAYOUT (ONE LARGE + ONE SMALL) ----------

if (slide.layout === "side" && slide.image) {

    slideContainer.innerHTML = `

        <div class="content-side">

            <div class="content-text">

                ${text}

                ${audioHTML}

		
            </div>

            <div class="content-image">

                <img
                    src="${slide.image}"
                    class="slide-image"
                    alt="${slide.title}">

                ${
                    slide.secondaryImage
                        ? `
                        <img
                            src="${slide.secondaryImage}"
                            class="secondary-image"
                            alt="${slide.title}">
                        `
                        : ""
                }

            </div>

        </div>

    `;

}
 // ---------- SIDE LAYOUT ----------

   else if (slide.layout === "side" && slide.images) {

        slideContainer.innerHTML = `

            <div class="content-side">

                <div class="content-text">

                    ${text}

${audioHTML}


                </div>

               <div class="content-image">

    ${slide.images.map(image => `
        <img
            src="${image}"
            class="slide-image"
            alt="${slide.title}">
    `).join("")}

</div>

            </div>

        `;

    }

    // ---------- CENTER LAYOUT ----------

    else {

        if (slide.image) {

            text += `
                <img
                    src="${slide.image}"
                    alt="${slide.imageAlt || slide.title}"
                    class="slide-image">
            `;

        }

        text += audioHTML;

        slideContainer.innerHTML = text;

    }

    // Initialize after HTML exists
    setupImageZoom();
    setupAudio();
addFooter();
}
// ---------- IMAGE MODAL ----------

function closeImage() {

    imageModal.style.display = "none";

}
// ---------- FOOTER ----------

function addFooter() {

    const footer = document.createElement("div");

    footer.className = "slide-footer";

    footer.textContent =
        "Developed by Yana Rassolko";

    slideContainer.appendChild(footer);

}
// ---------- BULLETS ----------

function renderBullets(items) {

    let html = "<ul>";

    items.forEach(item => {

        html += `<li>${item}</li>`;

    });

    html += "</ul>";

    return html;

}
// ---------- IMAGE ZOOM ----------

function setupImageZoom() {

    const images = document.querySelectorAll(
        ".slide-image, .secondary-image"
    );

    if (!images.length) return;

    images.forEach(image => {

        image.addEventListener("click", () => {

            modalImage.src = image.src;

            imageModal.style.display = "flex";

        });

    });

}
function setupAudio() {

    const audio = document.getElementById("slideAudio");

    if (!audio) {
        nextBtn.disabled = false;
        return;
    }

    console.log("Audio found");

    nextBtn.disabled = true;

    audio.addEventListener("ended", function () {

        console.log("Audio finished");

        nextBtn.disabled = false;

    });

}
// ---------- QUIZ ----------

function renderQuiz(slide) {

    let html = "";

    html += `<h2>Knowledge Check</h2>`;

    html += `<p class="question">${slide.question}</p>`;

    html += `<div class="quiz-options">`;

    // Shuffle answers
    const options = slide.options.map((option, index) => ({
        text: option,
        originalIndex: index
    }));

    options.sort(() => Math.random() - 0.5);

    options.forEach(option => {

        html += `
            <button
                class="quiz-option"
                data-index="${option.originalIndex}">

                ${option.text}

            </button>
        `;

    });

    html += `</div>`;

    html += `<div id="quizFeedback"></div>`;

    slideContainer.innerHTML = html;

    nextBtn.disabled = true;

    setupQuiz(slide);

    addFooter();

}
// ---------- QUIZ LOGIC ----------

function setupQuiz(slide) {

    const buttons =
        document.querySelectorAll(".quiz-option");

    const feedback =
        document.getElementById("quizFeedback");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const answer =
                Number(button.dataset.index);

            buttons.forEach(btn => btn.disabled = true);

            if (answer === slide.correct) {

                button.classList.add("correct");

                score++;

                feedback.innerHTML = `
                    <p class="correct-text">
                        ✅ Correct!
                    </p>

                    <p>${slide.explanation}</p>
                `;

            }

            else {

                button.classList.add("wrong");

                buttons[slide.correct]
                    .classList.add("correct");

                feedback.innerHTML = `
                    <p class="wrong-text">
                        ❌ Incorrect.
                    </p>

                    <p>${slide.explanation}</p>
                `;

            }

            nextBtn.disabled = false;

        });

    });

}
// ---------- QUIZ GROUP ----------

function renderQuizGroup(slide) {

alert("QuizGroup loaded");

    let html = `<h2>Knowledge Check</h2>`;

    slide.questions.forEach((q, qIndex) => {

    html += `
        <div class="quiz-group-question">

            <p class="question">
                <strong>Question ${qIndex + 1}</strong><br>
                ${q.question}
            </p>

            <div class="quiz-options">
    `;

    // Shuffle answers
    const options = q.options.map((option, index) => ({
        text: option,
        originalIndex: index
    }));

    options.sort(() => Math.random() - 0.5);

    options.forEach(option => {

        html += `
            <button
                class="quiz-option"
                data-question="${qIndex}"
                data-answer="${option.originalIndex}">

                <span class="radio"></span>
                <span>${option.text}</span>

            </button>
        `;

    });

        html += `
                </div>
            </div>
        `;

    });

    html += `

        <button id="submitQuizGroup" class="primary">

            Submit

        </button>

        <div id="quizFeedback"></div>

    `;

    slideContainer.innerHTML = html;

    nextBtn.disabled = true;

    setupQuizGroup(slide);
addFooter();

}
// ---------- QUIZ GROUP LOGIC ----------

function setupQuizGroup(slide) {

    const submit =
        document.getElementById("submitQuizGroup");

    submit.addEventListener("click", () => {

        let scoreLocal = 0;

        slide.questions.forEach((q, qIndex) => {

            const buttons =
                document.querySelectorAll(
                    `[data-question="${qIndex}"]`
                );

            let selected = -1;

            buttons.forEach(button => {

                if (button.classList.contains("selected")) {

                    selected =
                        Number(button.dataset.answer);

                }

            });

            buttons.forEach(button => {

    button.disabled = true;

    button.classList.remove("selected");

});

            if (selected === q.correct) {

                scoreLocal++;

            }

            buttons[q.correct]
                .classList.add("correct");

            if (
                selected >= 0 &&
                selected !== q.correct
            ) {

                buttons[selected]
                    .classList.add("wrong");

            }

        });

        score += scoreLocal;

        document.getElementById("quizFeedback").innerHTML =

            `<p class="correct-text">
                You answered
                ${scoreLocal}
                of
                ${slide.questions.length}
                correctly.
            </p>`;

        submit.disabled = true;

        nextBtn.disabled = false;

    });

    const allButtons =
        document.querySelectorAll(".quiz-option");

    allButtons.forEach(button => {

        button.addEventListener("click", () => {

            const question =
                button.dataset.question;

            document
                .querySelectorAll(
                    `[data-question="${question}"]`
                )
                .forEach(btn =>
                    btn.classList.remove("selected")
                );

            button.classList.add("selected");

        });

    });

}
// ---------- TOTAL QUESTIONS ----------

function getTotalQuestions() {

    let total = 0;

    course.forEach(slide => {

        if (slide.type === "quiz") {

            total++;

        }

        if (slide.type === "quizGroup") {

            total += slide.questions.length;

        }

    });

    return total;

}
// ---------- FINISH COURSE ----------

function finishCourse() {

    const totalQuestions = getTotalQuestions();

    slideContainer.innerHTML = `

        <div class="course-complete">

            <h2>🎉 Congratulations!</h2>

            <p>
                You have successfully completed
                <strong>Creating a Growth Plan</strong>.
            </p>

            <p class="score">
                You answered
                <strong>${score}</strong>
                out of
                <strong>${totalQuestions}</strong>
                questions correctly.
            </p>

            <p class="completion-text">

    If your department requires completion tracking,
    please submit the confirmation form.

</p>

<button
    class="primary"
    onclick="window.open('https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=zZBvhXgilEGCzfE_qyKWWiRncwfEBCxFgHyd38i8lBJUQ1AyUjQ0OURPTjVZNkQ3MFEwRzlDMFA5Ri4u','_blank')">

    Confirm Completion

</button>

<br><br>

<button
    class="secondary"
    onclick="restartCourse()">

    Restart Course

</button>

        </div>

    `;

    nextBtn.style.display = "none";
    backBtn.style.display = "none";


}
// ---------- RESTART ----------

function restartCourse() {

    currentSlide = 0;
    score = 0;

    nextBtn.style.display = "inline-block";
    backBtn.style.display = "inline-block";

    renderSlide();

}
// ---------- FEATURE ----------

function renderFeature(feature) {

let color = "blue";

if (feature.title === "Experience") color = "green";
if (feature.title === "Education") color = "orange";

    return `

      <div class="feature-card ${color}">

            <div class="feature-icon">

                ${feature.icon}

            </div>

            <div class="feature-content">

                <h3>${feature.title}</h3>

                <p>${feature.description}</p>

            </div>

        </div>

    `;

}
// ---------- CARDS ----------

function renderCards(cards) {

    let html = `<div class="cards">`;

    cards.forEach(card => {

        html += `
            <div class="card">

                <h3>${card.title}</h3>
        `;

        // Text
        if (card.text) {

            html += `<p>${card.text}</p>`;

        }

        // Intro
        if (card.intro) {

            html += `<p><strong>${card.intro}</strong></p>`;

        }

        // Items
        if (card.items) {

            html += `<ul>`;

            card.items.forEach(item => {

                html += `
                    <li>

                        <span class="check">✔</span>

                        <span>${item}</span>

                    </li>
                `;

            });

            html += `</ul>`;

        }

        // Note
        if (card.note) {

            html += `

                <div class="note">

                    <strong>${card.noteTitle}</strong>

                    <p>${card.note}</p>

                </div>

            `;

        }

        html += `</div>`;

    });

    html += `</div>`;

    return html;

}