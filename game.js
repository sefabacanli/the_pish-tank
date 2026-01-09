// Kimlik Avcısı (The Phish-Tank)
// Oyun akışını yöneten basit değişkenler ve fonksiyonlar.

let currentQuestionIndex = 0;
let score = 0;
let hasAnsweredCurrentQuestion = false;
let clickedAlert = false;
let uiDelayMs = 0;
let alertShown = false;
let alertClicked = false;
let alertClosed = false;
let clickedSystemAlert = false;
let clickedRewardAlert = false;
let clickedUrgencyAlert = false;
let gloomLevel = 0;
let totalRuns = 0;
let totalGloomSum = 0;
let totalSystemClicks = 0;
let totalRewardClicks = 0;
let totalUrgencyClicks = 0;

const ALERT_TYPES = {
    SYSTEM: "SYSTEM_ALERT",
    REWARD: "REWARD_ALERT",
    URGENCY: "URGENCY_ALERT"
};

let currentAlertType = null;

// Soru görselleri için basit eşleme
// currentQuestionIndex, questions dizisindeki sıraya göre ilerler.
// Elinizde q1–q10 görselleri olduğundan, ilk 10 soru doğrudan q1–q10 ile,
// son soru ise q10 görseli tekrar kullanılarak eşlenir.
const questionImageElement = document.getElementById("question-image");
const questionImageSources = [
    "images/q1.png",
    "images/q2.png",
    "images/q3.png",
    "images/q4.png",
    "images/q5.png",
    "images/q6.png",
    "images/q7.png",
    "images/q8.png",
    "images/q9.png",
    "images/q10.png",
    // Son soru için q10 görselini tekrar kullan
    "images/q10.png"
];

const questionImageAlts = [
    "Birinci soruya ait kimlik avı örneğini gösteren görsel",
    "İkinci soruya ait kimlik avı örneğini gösteren görsel",
    "Üçüncü soruya ait kimlik avı örneğini gösteren görsel",
    "Dördüncü soruya ait kimlik avı örneğini gösteren görsel",
    "Beşinci soruya ait kimlik avı örneğini gösteren görsel",
    "Altıncı soruya ait kimlik avı örneğini gösteren görsel",
    "Yedinci soruya ait kimlik avı örneğini gösteren görsel",
    "Sekizinci soruya ait kimlik avı örneğini gösteren görsel",
    "Dokuzuncu soruya ait kimlik avı örneğini gösteren görsel",
    "Onuncu soruya ait kimlik avı örneğini gösteren görsel",
    // 11. soru: görsel olarak q10 tekrar kullanılır
    "On birinci soruya ait kimlik avı örneğini gösteren görsel"
];

const questionTextElement = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const optionButtons = Array.from(document.querySelectorAll(".option"));
const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button");
const testContainer = document.querySelector(".test-container");
const debriefScreen = document.getElementById("debrief-screen");
const debriefBehaviorText = document.getElementById("debrief-behavior");
const debriefRestartButton = document.getElementById("debrief-restart");
const debriefPersonalText = document.getElementById("debrief-personal");
const classSummaryText = document.getElementById("class-summary-text");
const startScreen = document.getElementById("start-screen");

const fakeAlertOverlay = document.getElementById("fake-alert-overlay");
const fakeAlertCloseButton = document.getElementById("fake-alert-close");
const fakeAlertDetailsButton = document.getElementById("fake-alert-details");
const fakeAlertTitleElement = document.getElementById("fake-alert-title");
const fakeAlertMessageElement = document.querySelector(".fake-alert-message");
const themeToggleButton = document.getElementById("theme-toggle");

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", nextQuestion);

optionButtons.forEach((button, index) => {
    button.addEventListener("click", () => handleOptionClick(index));
});

if (fakeAlertCloseButton) {
    fakeAlertCloseButton.addEventListener("click", () => {
        alertClosed = true;
        hideFakeAlert();
    });
}

if (fakeAlertDetailsButton) {
    fakeAlertDetailsButton.addEventListener("click", handleFakeAlertDetails);
}

if (debriefRestartButton) {
    debriefRestartButton.addEventListener("click", () => {
        // Oyun durumunu sıfırla ve değerlendirme ekranını kapat
        resetRunState();

        if (debriefScreen) {
            debriefScreen.hidden = true;
        }

        // Kapanıştan sonra doğrudan 1. soru ekranına dön
        if (startScreen) {
            startScreen.hidden = true;
            startScreen.style.display = "none";
        }

        if (testContainer) {
            testContainer.hidden = false;
            testContainer.style.display = "block";
        }

        // Var olan oyun akışını kullanarak testi baştan başlat
        startGame();
    });
}

if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
        const body = document.body;
        const isDark = body.classList.contains("dark-theme");
        if (isDark) {
            body.classList.remove("dark-theme");
            body.classList.add("light-theme");
            themeToggleButton.textContent = "🌙";
        } else {
            body.classList.remove("light-theme");
            body.classList.add("dark-theme");
            themeToggleButton.textContent = "☀️";
        }
    });
}

function startGame() {
    resetRunState();

    startButton.disabled = true;
    nextButton.disabled = false;
    optionsContainer.style.display = "flex";

    showQuestion();
}

function resetRunState() {
    currentQuestionIndex = 0;
    score = 0;
    hasAnsweredCurrentQuestion = false;
    clickedAlert = false;
    uiDelayMs = 0;
    alertShown = false;
    alertClicked = false;
    alertClosed = false;
    clickedSystemAlert = false;
    clickedRewardAlert = false;
    clickedUrgencyAlert = false;
    currentAlertType = null;
    gloomLevel = 0;
    resetGloomClasses();
    document.body.classList.remove("ui-degraded");
}

function showQuestion() {
    if (!questions || questions.length === 0) {
        questionTextElement.textContent = "Henüz soru eklenmemiş.";
        optionButtons.forEach((button) => {
            button.textContent = "";
            button.disabled = true;
        });
        nextButton.disabled = true;
        return;
    }

    if (currentQuestionIndex >= questions.length) {
        finishQuiz();
        return;
    }

    hasAnsweredCurrentQuestion = false;

    const currentQuestion = questions[currentQuestionIndex];
    questionTextElement.textContent = currentQuestion.questionText;

    // Mevcut soruya ait görseli güncelle (q1–q10)
    if (questionImageElement) {
        const imageIndex = currentQuestionIndex;
        const hasImage = imageIndex >= 0 && imageIndex < questionImageSources.length;

        if (hasImage) {
            questionImageElement.src = questionImageSources[imageIndex];
            questionImageElement.alt = questionImageAlts[imageIndex];
            questionImageElement.style.display = "block";
        } else {
            // Eğer bu indeks için görsel tanımlı değilse gizle
            questionImageElement.style.display = "none";
        }
    }

    optionButtons.forEach((button, index) => {
        button.disabled = false;
        button.classList.remove("option-selected");

        const optionText = currentQuestion.options[index] ?? "";
        button.textContent = optionText;
        button.style.display = optionText ? "block" : "none";
    });
}

function handleOptionClick(selectedIndex) {
    if (hasAnsweredCurrentQuestion) {
        return;
    }

    const run = () => {
        const currentQuestion = questions[currentQuestionIndex];

        if (!currentQuestion) {
            return;
        }

        optionButtons.forEach((button) => {
            button.disabled = true;
            button.classList.remove("option-selected");
        });

        const selectedButton = optionButtons[selectedIndex];
        if (selectedButton) {
            selectedButton.classList.add("option-selected");
        }

        if (selectedIndex === currentQuestion.correctAnswerIndex) {
            score += 1;
        }
    };

    runWithDelay(run);

    hasAnsweredCurrentQuestion = true;
}

function nextQuestion() {
    if (!questions || questions.length === 0) {
        return;
    }

    const run = () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex += 1;
            maybeShowAlertForCurrentQuestion();
            showQuestion();
        } else {
            finishQuiz();
        }
    };

    runWithDelay(run);
}

function finishQuiz() {
    totalRuns += 1;
    totalGloomSum += gloomLevel;
    if (clickedSystemAlert) {
        totalSystemClicks += 1;
    }
    if (clickedRewardAlert) {
        totalRewardClicks += 1;
    }
    if (clickedUrgencyAlert) {
        totalUrgencyClicks += 1;
    }

    resetGloomClasses();
    document.body.classList.remove("ui-degraded");

    if (testContainer) {
        testContainer.style.display = "none";
    }

    if (debriefScreen) {
        updateDebriefContent();
        debriefScreen.hidden = false;
    }

    optionsContainer.style.display = "none";

    nextButton.disabled = true;
    startButton.disabled = false;
}

function updateDebriefContent() {
    if (!debriefBehaviorText) {
        return;
    }

    if (alertClicked) {
        debriefBehaviorText.textContent =
            "Bu uyarıya tıkladın. Bu, sosyal mühendislik saldırılarında sıkça görülen bir davranıştır.";
    } else if (alertClosed) {
        debriefBehaviorText.textContent =
            "Uyarıyı kapattın. Bu, çoğu durumda güvenli ve dikkatli bir davranıştır.";
    } else if (alertShown) {
        debriefBehaviorText.textContent =
            "Uyarıyı yok saydın. Bu da pek çok durumda sakin kalıp acele etmemek için doğru bir yaklaşımdır.";
    } else {
        debriefBehaviorText.textContent = "Bu turda herhangi bir uyarı ile karşılaşmadın.";
    }

    updatePersonalFeedback();
    updateClassSummary();
}

function updatePersonalFeedback() {
    if (!debriefPersonalText) {
        return;
    }

    let clickedTypes = [];
    if (clickedSystemAlert) {
        clickedTypes.push("sistem uyarıları");
    }
    if (clickedRewardAlert) {
        clickedTypes.push("ödül vaat eden uyarılar");
    }
    if (clickedUrgencyAlert) {
        clickedTypes.push("acele ettiren uyarılar");
    }

    let message = "Dikkat etmen gereken nokta, karşına çıkan uyarıları acele etmeden değerlendirmek.";

    if (clickedTypes.length === 0) {
        if (gloomLevel === 0) {
            message =
                "Dikkat etmen gereken nokta, bu dikkatli yaklaşımını sürdürmek. Uyarıları okumadan tıklamaman güzel bir alışkanlık.";
        } else {
            message =
                "Dikkat etmen gereken nokta, uyarıları yok sayarken bile neyi reddettiğini anlamaya çalışmak. Sakin kalman yine de olumlu.";
        }
    } else if (clickedTypes.length === 1) {
        message =
            "Dikkat etmen gereken nokta, özellikle " +
            clickedTypes[0] +
            " karşısında hemen tıklamak yerine, kaynağın gerçekten güvenilir olup olmadığını kontrol etmek.";
    } else {
        message =
            "Dikkat etmen gereken nokta, farklı türde uyarılarla karşılaştığında hepsine aynı hızla tıklamamak. Bir an durup metni ve kaynağı incelemek güvenli bir davranıştır.";
    }

    debriefPersonalText.textContent = message;
}

function updateClassSummary() {
    if (!classSummaryText || totalRuns === 0) {
        return;
    }

    const avgGloom = totalGloomSum / totalRuns;

    let mostClickedType = null;
    let maxClicks = 0;
    if (totalSystemClicks > maxClicks) {
        mostClickedType = "sistem uyarıları";
        maxClicks = totalSystemClicks;
    }
    if (totalRewardClicks > maxClicks) {
        mostClickedType = "ödül vaat eden uyarılar";
        maxClicks = totalRewardClicks;
    }
    if (totalUrgencyClicks > maxClicks) {
        mostClickedType = "acele ettiren uyarılar";
        maxClicks = totalUrgencyClicks;
    }

    let summary = "Bu tur için sınıf gözlemi oluşturmak için yeterli veri yok.";
    if (mostClickedType && maxClicks > 0) {
        summary =
            "Bu grupta en çok " +
            mostClickedType +
            " öne çıkmıştır. Ortalama kasvet seviyesi " +
            avgGloom.toFixed(1) +
            " civarındadır. Bu, bu tür uyarıların özellikle dikkat çektiğini gösterir.";
    } else {
        summary =
            "Bu grupta uyarılara karşı genel olarak temkinli bir yaklaşım gözleniyor. Ortalama kasvet seviyesi " +
            avgGloom.toFixed(1) +
            " düzeyindedir.";
    }

    classSummaryText.textContent = summary;
}

function runWithDelay(action) {
    if (!clickedAlert || uiDelayMs <= 0) {
        action();
        return;
    }

    setTimeout(() => {
        action();
    }, uiDelayMs);

    if (uiDelayMs < 400) {
        uiDelayMs += 50;
    }
}

function showFakeAlert() {
    if (!fakeAlertOverlay) {
        return;
    }
    configureFakeAlertContent();
    fakeAlertOverlay.style.display = "flex";
    fakeAlertOverlay.setAttribute("aria-hidden", "false");
    alertShown = true;
}

function hideFakeAlert() {
    if (!fakeAlertOverlay) {
        return;
    }
    fakeAlertOverlay.style.display = "none";
    fakeAlertOverlay.setAttribute("aria-hidden", "true");
}

function handleFakeAlertDetails() {
    clickedAlert = true;
    alertClicked = true;
    uiDelayMs = 150;
    document.body.classList.add("ui-degraded");
    applyNextGloomLevel();

    if (currentAlertType === ALERT_TYPES.SYSTEM) {
        clickedSystemAlert = true;
    } else if (currentAlertType === ALERT_TYPES.REWARD) {
        clickedRewardAlert = true;
    } else if (currentAlertType === ALERT_TYPES.URGENCY) {
        clickedUrgencyAlert = true;
    }

    hideFakeAlert();
}

function configureFakeAlertContent() {
    if (!fakeAlertTitleElement || !fakeAlertMessageElement) {
        return;
    }

    switch (currentAlertType) {
        case ALERT_TYPES.SYSTEM:
            fakeAlertTitleElement.textContent = "Tarayıcı güncellemesi mevcut";
            fakeAlertMessageElement.textContent =
                "Bu sadece örnek bir tarayıcı bildirimidir. Gerçek güncellemeler için her zaman ayarlardan veya resmi siteden kontrol etmelisin.";
            break;
        case ALERT_TYPES.REWARD:
            fakeAlertTitleElement.textContent = "Tebrikler! Ek puan kazandınız";
            fakeAlertMessageElement.textContent =
                "Bu, seni tıklamaya yönlendirmek için tasarlanmış örnek bir ödül mesajıdır. Gerçekte bu tür tekliflere dikkatle yaklaşmak gerekir.";
            break;
        case ALERT_TYPES.URGENCY:
            fakeAlertTitleElement.textContent = "Oturumunuz sona ermek üzere";
            fakeAlertMessageElement.textContent =
                "Bu, acele karar vermeni istemek için hazırlanmış örnek bir uyarıdır. Gerçek hayatta önce sakin kalıp mesajın kaynağını kontrol etmek önemlidir.";
            break;
        default:
            fakeAlertTitleElement.textContent = "Bilgilendirme";
            fakeAlertMessageElement.textContent =
                "Bu sadece örnek bir bilgilendirme penceresidir. Teste güvenle devam edebilirsin.";
    }
}

function applyNextGloomLevel() {
    if (gloomLevel >= 4) {
        return;
    }
    gloomLevel += 1;
    resetGloomClasses();
    const body = document.body;
    body.classList.add(`gloom-${gloomLevel}`);
}

function resetGloomClasses() {
    const body = document.body;
    body.classList.remove("gloom-1", "gloom-2", "gloom-3", "gloom-4");
}

function maybeShowAlertForCurrentQuestion() {
    // Farklı sorulardan sonra farklı uyarı türlerini göster.
    switch (currentQuestionIndex) {
        case 3:
            currentAlertType = ALERT_TYPES.SYSTEM;
            showFakeAlert();
            break;
        case 6:
            currentAlertType = ALERT_TYPES.REWARD;
            showFakeAlert();
            break;
        case 9:
            currentAlertType = ALERT_TYPES.URGENCY;
            showFakeAlert();
            break;
        default:
            break;
    }
}
