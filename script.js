document.addEventListener("DOMContentLoaded", () => {
    initCategoryTabs();
    initQuiz();
});

/* ==========================================================================
   KELİME KATEGORİ SEÇİMİ VE GİZLE/GÖSTER MANTIĞI (JAVASCRIPT)
   ========================================================================== */
function initCategoryTabs() {
    const categoryButtons = document.querySelectorAll(".cat-btn");
    const wordPanels = document.querySelectorAll(".word-list-panel");

    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedCategory = button.getAttribute("data-category");

            // Tüm butonlardan active sınıfını çıkar, tıklanana ekle
            categoryButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            // Tüm panelleri gizle, seçili olana gösterim izni ver
            wordPanels.forEach(panel => {
                if (panel.id === `cat-${selectedCategory}`) {
                    panel.classList.remove("hidden");
                } else {
                    panel.classList.add("hidden");
                }
            });
        });
    });
}

/* ==========================================================================
   SESLİ TELAFFUZ (Web Speech API)
   ========================================================================== */
function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Tarayıcınız sesli okuma özelliğini desteklemiyor.");
    }
}

/* ==========================================================================
   MOBİL MENÜ
   ========================================================================== */
const mobileMenuBtn = document.getElementById("mobile-menu");
const navLinks = document.getElementById("nav-links");

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        if (link.getAttribute("target") !== "_blank" && navLinks && navLinks.classList.contains("active")) {
            navLinks.classList.remove("active");
        }
    });
});

/* ==========================================================================
   SİTE İÇİ ARAMA MANTIĞI
   ========================================================================== */
function searchSite(event) {
    if (event.key === "Enter") {
        executeSiteSearch();
    }
}

function executeSiteSearch() {
    const input = document.getElementById("site-search");
    if (!input) return;
    const query = input.value.toLowerCase().trim();
    if (!query) return;

    // Blog makalelerinde arama
    for (const key in blogArticles) {
        const art = blogArticles[key];
        if (art.title.toLowerCase().includes(query) || art.content.toLowerCase().includes(query)) {
            openBlog(key);
            input.value = "";
            return;
        }
    }

    // Kelime listelerinde arama
    const allVocabCards = document.querySelectorAll(".vocab-card");
    let found = false;
    allVocabCards.forEach(card => {
        const tr = card.querySelector(".vocab-tr").textContent.toLowerCase();
        const en = card.querySelector(".vocab-en").textContent.toLowerCase();
        if (tr.includes(query) || en.includes(query)) {
            const parentPanel = card.closest(".word-list-panel");
            if (parentPanel) {
                const catId = parentPanel.id.replace("cat-", "");
                const catBtn = document.querySelector(`.cat-btn[data-category="${catId}"]`);
                if (catBtn) catBtn.click();
                document.getElementById("kelimeler").scrollIntoView({ behavior: 'smooth' });
                found = true;
            }
        }
    });

    if (found) {
        input.value = "";
        return;
    }

    alert("Aradığınız '" + query + "' ifadesiyle ilgili sonuç bulunamadı.");
}

/* ==========================================================================
   BLOG MODAL MANTIĞI
   ========================================================================== */
const blogArticles = {
    kahve: {
        title: "Türk Kahvesi Geleneği",
        level: "A1 Seviye Okuma Metni",
        date: "16 Eylül 2026",
        img: "https://static.ticimax.cloud/cdn-cgi/image/width=-,quality=99/75263/uploads/urunresimleri/buyuk/bc5b40bc-20b5-4167-9d46-a389e8ec92d0-8425-4.png",
        content: `
            <p class="article-lead">Türk kahvesi sadece sıcak bir içecek değil, aynı zamanda dostluğun ve sohbetin simgesidir. 16. yüzyıldan beri pişirme tekniği hiç değişmemiştir: İnce çekilmiş kahve, soğuk su ve isteğe göre şeker cezvede kısık ateşte yavaşça kaynatılır.</p>
            <h4>Sunum</h4><p>Yanında daima bir lokum ve küçük bir bardak su ile servis edilir.</p>
            <h4>Kültürel Değer</h4><p>2013 yılında UNESCO Somut Olmayan Kültürel Miras Listesi'ne girmiştir.</p>
        `
    },
    istanbul: {
        title: "İstanbul ve Sanat",
        level: "B1 Seviye Okuma Metni",
        date: "10 Eylül 2026",
        img: "https://image.milimaj.com/i/milliyet/75/869x477/5c8d9f8b45d2a04bdc3fa338.jpg",
        content: `
            <p class="article-lead">İstanbul, asırlar boyunca yazarlar, ressamlar ve şairler için açık hava atölyesi işlevi görmüştür. Dili sokakta öğrenmek ve edebiyatın izini sürmek isteyenler için şehrin tarihi dokusu eşsiz bir bağlam sunar.</p>
            <h4>Edebi Rotalar</h4><p>Beyoğlu’ndaki sahaflar ve Orhan Veli’nin Boğaz’a bakan şiirleri dil pratiklerine edebi derinlik katar.</p>
        `
    },
    misafir: {
        title: "Türk Kültüründe Misafirperverlik",
        level: "A2 Seviye Okuma Metni",
        date: "02 Eylül 2026",
        img: "https://i.ytimg.com/vi/xSzxSBuYKZk/maxresdefault.jpg",
        content: `
            <p class="article-lead">Türk kültüründe eve gelen misafir "Tanrı misafiri" olarak görülür ve en iyi şekilde ağırlanır. Sosyal ilişkiler, durum bildiren kalıp nezaket cümleleri üzerine kuruludur.</p>
            <h4>Karşılama</h4><p>Kapıyı çalan kişiye "Hoş geldiniz", karşılık olarak ise "Hoş bulduk" denir.</p>
        `
    }
};

function openBlog(key) {
    const article = blogArticles[key];
    if (!article) return;
    const modal = document.getElementById("blog-modal");
    const modalBody = document.getElementById("modal-body");

    modalBody.innerHTML = `
        <span class="badge" style="margin-bottom:10px; display:inline-block;">${article.level}</span>
        <h2 style="font-size:1.6rem; margin-bottom:5px;">${article.title}</h2>
        <span class="blog-date" style="display:block; margin-bottom:15px;">${article.date}</span>
        <img src="${article.img}" alt="${article.title}" class="modal-blog-img">
        <div class="modal-article-text">${article.content}</div>
    `;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeBlog() {
    const modal = document.getElementById("blog-modal");
    if (modal) {
        modal.classList.add("hidden");
        document.body.style.overflow = "auto";
    }
}

window.addEventListener("click", (e) => {
    const modal = document.getElementById("blog-modal");
    if (e.target === modal) closeBlog();
});

/* ==========================================================================
   QUIZ MANTIĞI
   ========================================================================== */
const quizData = [
    {
        question: "1. Hangisi 'Büyük Ünlü Uyumu' kuralına UYMAZ?",
        options: ["Kitaplık", "Kalemlik", "Kardeş", "Çiçek"],
        answer: 0,
        explanation: "Türkçede bir kelimenin ilk hecesindeki ünlü ince ise (e, i, ö, ü), sonraki ünlüler de ince olmalıdır."
    },
    {
        question: "2. 'İki karpuz bir koltuğa sığmaz' atasözünün anlamı nedir?",
        options: [
            "Aynı anda birden fazla önemli işi yapmak zordur.",
            "Karpuz taşımak teknik gerektirir.",
            "Evde büyük eşyalara yer ayrılmalıdır.",
            "Yaz mevsiminde dikkatli olunmalıdır."
        ],
        answer: 0,
        explanation: "Bu atasözü, aynı anda iki büyük sorumluluğun bir arada yürütülemeyeceğini anlatır."
    },
    {
        question: "3. 'Dün sinemaya ...... .' cümlesinde boşluğa hangisi gelmelidir?",
        options: ["gidiyorum", "gittim", "gideceğim", "giderim"],
        answer: 1,
        explanation: "'Dün' geçmiş zaman belirttiği için Görülen Geçmiş Zaman (-di / -ti) eki kullanılmalıdır."
    }
];

let currentQuestion = 0;
let score = 0;

function initQuiz() {
    loadQuestion();
}

function loadQuestion() {
    resetQuizState();
    const currentQuiz = quizData[currentQuestion];
    const stepEl = document.getElementById("quiz-step");
    const questionEl = document.getElementById("quiz-question");
    const optionsEl = document.getElementById("quiz-options");

    if (!questionEl || !optionsEl) return;

    stepEl.textContent = `Soru ${currentQuestion + 1} / ${quizData.length}`;
    questionEl.textContent = currentQuiz.question;

    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option-btn");
        button.addEventListener("click", () => selectOption(index));
        optionsEl.appendChild(button);
    });
}

function resetQuizState() {
    const feedbackEl = document.getElementById("quiz-feedback");
    const nextBtn = document.getElementById("next-btn");
    const optionsEl = document.getElementById("quiz-options");

    if (feedbackEl) {
        feedbackEl.classList.add("hidden");
        feedbackEl.className = "quiz-feedback hidden";
    }
    if (nextBtn) nextBtn.classList.add("hidden");
    if (optionsEl) optionsEl.innerHTML = "";
}

function selectOption(selectedIndex) {
    const currentQuiz = quizData[currentQuestion];
    const optionsEl = document.getElementById("quiz-options");
    const feedbackEl = document.getElementById("quiz-feedback");
    const nextBtn = document.getElementById("next-btn");
    const buttons = optionsEl.querySelectorAll(".option-btn");

    buttons.forEach((btn) => btn.disabled = true);

    if (selectedIndex === currentQuiz.answer) {
        buttons[selectedIndex].classList.add("correct");
        feedbackEl.textContent = `Doğru! ${currentQuiz.explanation}`;
        feedbackEl.classList.add("correct");
        score++;
    } else {
        buttons[selectedIndex].classList.add("wrong");
        buttons[currentQuiz.answer].classList.add("correct");
        feedbackEl.textContent = `Yanlış. ${currentQuiz.explanation}`;
        feedbackEl.classList.add("wrong");
    }

    feedbackEl.classList.remove("hidden");
    nextBtn.classList.remove("hidden");
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    resetQuizState();
    const stepEl = document.getElementById("quiz-step");
    const questionEl = document.getElementById("quiz-question");
    const nextBtn = document.getElementById("next-btn");

    stepEl.textContent = "Test Tamamlandı!";
    questionEl.textContent = `Tebrikler! Quiz sonucunuz: ${quizData.length} sorudan ${score} tanesini doğru yanıtladınız.`;
    nextBtn.textContent = "Yeniden Başla";
    nextBtn.classList.remove("hidden");
    nextBtn.onclick = () => {
        currentQuestion = 0;
        score = 0;
        nextBtn.textContent = "Sonraki Soru";
        nextBtn.onclick = nextQuestion;
        loadQuestion();
    };
}

function scrollToQuiz() {
    document.getElementById("quiz").scrollIntoView({ behavior: 'smooth' });
}