// Start ekranı ile 1. soru ekranı arasındaki basit görünürlük kontrolü
// ve sahte uyarılar için ortak uyarı sesi + hafif ekran bozulma efekti.

// Uyarı sesi için kullanılacak AudioContext (varsa yeniden kullanılır)
let warningAudioContext = null;

// Kısa ve abartısız bir uyarı sesi çal
function playWarningTone() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) {
            return; // Tarayıcı desteklemiyorsa sessizce çık
        }

        if (!warningAudioContext) {
            warningAudioContext = new AudioCtx();
        }

        const duration = 0.18; // Saniye cinsinden, kısa bir bip

        const oscillator = warningAudioContext.createOscillator();
        const gainNode = warningAudioContext.createGain();

        oscillator.type = "sine"; // Yumuşak bir sinüs dalgası
        oscillator.frequency.value = 880; // Orta-yüksek fakat rahatsız etmeyen ton

        // Sesi zamanla yumuşakça azalt
        gainNode.gain.setValueAtTime(0.18, warningAudioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            warningAudioContext.currentTime + duration
        );

        oscillator.connect(gainNode);
        gainNode.connect(warningAudioContext.destination);

        oscillator.start();
        oscillator.stop(warningAudioContext.currentTime + duration);
    } catch {
        // Ses çalınamazsa hatayı kullanıcıya göstermeden yut
    }
}

// Her uyarı tıklamasında kısa süreli ekran bozulma efekti uygula
function triggerScreenGlitchEffect() {
    const body = document.body;
    if (!body) {
        return;
    }

    // Aynı anda birden fazla kez tetiklenmesini engelle
    if (body.classList.contains("screen-glitch")) {
        return;
    }

    body.classList.add("screen-glitch");

    // Birkaç saniye sonra efekti kaldır
    setTimeout(() => {
        body.classList.remove("screen-glitch");
    }, 900);
}

// Sahte uyarı butonlarına tıklandığında çalışacak ortak handler
function handleAlertInteraction() {
    // Her tıklamada kısa bir uyarı sesi çal
    playWarningTone();

    // Kısa ve hafif bir ekran bozulma efekti uygula
    triggerScreenGlitchEffect();
}

document.addEventListener("DOMContentLoaded", () => {
    // Başlangıç ekranı ve 1. soru ekranı bölümlerini seç
    const startScreen = document.getElementById("start-screen");
    const firstQuestionSection = document.getElementById("question-1");
    const startScreenStartButton = document.getElementById("start-screen-start");
    const startButton = document.getElementById("start-button");

    // Sahte uyarı bileşeninin parçaları
    const fakeAlertDialog = document.querySelector(".fake-alert");
    const fakeAlertCloseButton = document.getElementById("fake-alert-close");

    // Start ekranı sadece ilgili elemanlar varsa yönetilir
    if (startScreen && firstQuestionSection && startScreenStartButton) {
        // Sayfa ilk yüklendiğinde: start-screen açık, 1. soru ekranı gizli
        startScreen.hidden = false;
        firstQuestionSection.hidden = true;
        firstQuestionSection.style.display = "none";

        // "Teste Başla" butonuna tıklanınca görünürlükleri değiştir
        startScreenStartButton.addEventListener("click", () => {
            // Başlangıç ekranını gizle
            startScreen.hidden = true;
            startScreen.style.display = "none";

            // 1. soru ekranını göster
            firstQuestionSection.hidden = false;
            firstQuestionSection.style.display = "block";

            // Var olan oyun akışını kullanarak testi başlat
            if (startButton) {
                startButton.click();
            }
        });
    }

    // Uyarının ana gövdesine (dialog) tıklanınca ses + ekran efekti uygula
    if (fakeAlertDialog) {
        fakeAlertDialog.addEventListener("click", handleAlertInteraction);
    }

    // Kapatma butonuna basıldığında sadece uyarıyı kapat; ses/efekt tetikleme
    // Ayrıca event.stopPropagation() ile tıklamanın üst elemana taşmasını engelle
    if (fakeAlertCloseButton) {
        fakeAlertCloseButton.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    }
});
