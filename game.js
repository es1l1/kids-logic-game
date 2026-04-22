/**
 * كائن البيانات الرئيسي - يحتوي على كل التحديات والمستويات
 */
const GameData = {
    level: 1,
    score: 0,
    maxLevels: 5,
    isProcessing: false,
    timerId: null,
    audioReady: false,
    
    // تعريف المستويات: كل مستوى له "نمط" مختلف
    stages: [
        { id: 1, title: "مرحلة الألوان 🍎", type: 'colors', count: 2, time: null, bg: "#a1c4fd" },
        { id: 2, title: "تحدي الأشكال 💠", type: 'shapes', count: 4, time: 12, bg: "#84fab0" },
        { id: 3, title: "مملكة الحيوان 🦁", type: 'animals', count: 4, time: 10, bg: "#fccb90" },
        { id: 4, title: "عالم الفواكه 🍓", type: 'fruits', count: 6, time: 8, bg: "#ff9a9e" },
        { id: 5, title: "تحدي الأرقام 🔢", type: 'numbers', count: 6, time: 6, bg: "#d57eeb" }
    ],

    // بنك العناصر المرئية
    assets: {
        colors: [
            { n: "أحمر", i: "🍎", c: "#ff4757" }, { n: "أزرق", i: "💎", c: "#1e90ff" },
            { n: "أخضر", i: "🌿", c: "#2ed573" }, { n: "أصفر", i: "☀️", c: "#ffa502" }
        ],
        shapes: [
            { n: "مربع", i: "⬛", c: "#2f3542" }, { n: "دائرة", i: "⭕", c: "#5352ed" },
            { n: "نجمة", i: "⭐", c: "#f7b731" }, { n: "قلب", i: "❤️", c: "#ff6b81" }
        ],
        animals: [
            { n: "أسد", i: "🦁", c: "#e67e22" }, { n: "باندا", i: "🐼", c: "#ced6e0" },
            { n: "فيل", i: "🐘", c: "#70a1ff" }, { n: "قرد", i: "🐒", c: "#a04000" }
        ],
        fruits: [
            { n: "موز", i: "🍌", c: "#eccc68" }, { n: "عنب", i: "🍇", c: "#a29bfe" },
            { n: "بطيخ", i: "🍉", c: "#ff6b81" }, { n: "فراولة", i: "🍓", c: "#ff4757" },
            { n: "أناناس", i: "🍍", c: "#ffa502" }, { n: "كرز", i: "🍒", c: "#ff5252" }
        ],
        numbers: [
            { n: "واحد", i: "1️⃣", c: "#2ed573" }, { n: "ثلاثة", i: "3️⃣", c: "#1e90ff" },
            { n: "خمسة", i: "5️⃣", c: "#ffa502" }, { n: "سبعة", i: "7️⃣", c: "#ff4757" },
            { n: "تسعة", i: "9️⃣", c: "#6c5ce7" }, { n: "صفر", i: "0️⃣", c: "#747d8c" }
        ]
    }
};

/**
 * المحرك الرئيسي للعبة
 */
const GameEngine = {
    
    // بدء اللعبة وإخفاء واجهة البداية
    start() {
        GameData.audioReady = true;
        const overlay = document.getElementById('start-overlay');
        if (overlay) overlay.style.display = 'none';
        this.render();
    },

    // رسم واجهة المستوى الحالي
    render() {
        // التحقق مما إذا فاز الطفل بجميع المراحل
        if (GameData.level > GameData.maxLevels) {
            this.showWinScreen();
            return;
        }

        const currentStage = GameData.stages[GameData.level - 1];
        
        // تحديث مظهر الصفحة
        document.body.style.background = currentStage.bg;
        this.updateProgressStars();
        
        // اختيار العناصر عشوائياً
        const pool = [...GameData.assets[currentStage.type]].sort(() => 0.5 - Math.random());
        const options = pool.slice(0, currentStage.count);
        this.target = options[Math.floor(Math.random() * options.length)];

        // تحديث النصوص في الواجهة
        document.getElementById('mission-title').innerText = currentStage.title;
        document.getElementById('target-name').innerText = `أين هو ${this.target.n}؟`;
        document.getElementById('score-val').innerText = GameData.score;
        document.getElementById('level').innerText = GameData.level;

        // إنشاء شبكة الأزرار
        const grid = document.getElementById('options-grid');
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = options.length > 4 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)';

        options.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'option-card animate__animated animate__zoomIn';
            btn.style.backgroundColor = item.c;
            btn.innerHTML = `<span class="icon">${item.i}</span>`;
            btn.onclick = () => this.checkAnswer(item);
            grid.appendChild(btn);
        });

        // نطق السؤال وتفعيل المؤقت
        if (GameData.audioReady) this.speak(`أين هو ${this.target.n}`);
        this.manageTimer(currentStage.time);
    },

    // إدارة المؤقت الزمني
    manageTimer(seconds) {
        clearInterval(GameData.timerId);
        const timerFill = document.getElementById('timer-fill');
        if (!timerFill) return;

        if (seconds) {
            timerFill.style.transition = 'none';
            timerFill.style.width = '100%';
            
            // تأخير بسيط لبدء الأنيميشن
            setTimeout(() => {
                timerFill.style.transition = `width ${seconds}s linear`;
                timerFill.style.width = '0%';
            }, 50);

            GameData.timerId = setInterval(() => {
                this.handleResponse(false, "انتهى الوقت! حاول مجدداً ⏰");
            }, seconds * 1000);
        } else {
            timerFill.style.width = '0%';
        }
    },

    // التحقق من صحة الإجابة
    checkAnswer(selected) {
        if (GameData.isProcessing) return;
        const isCorrect = selected.n === this.target.n;
        this.handleResponse(isCorrect, isCorrect ? "أحسنت! إجابة مذهلة ✨" : "حاول مرة أخرى يا ذكي 😊");
    },

    // التعامل مع النجاح أو الفشل
    handleResponse(isCorrect, message) {
        GameData.isProcessing = true;
        clearInterval(GameData.timerId);

        const feedback = document.getElementById('feedback-area');
        feedback.innerText = message;
        feedback.style.color = isCorrect ? "#2ed573" : "#ff4757";

        if (isCorrect) {
            GameData.score += 20;
            GameData.level += 1; // الانتقال للمستوى التالي
            this.playLocalSound('https://www.soundjay.com/buttons/sounds/button-3.mp3');
            
            setTimeout(() => {
                GameData.isProcessing = false;
                this.render();
            }, 1500);
        } else {
            // اهتزاز عند الخطأ
            const card = document.getElementById('game-card');
            card.classList.add('animate__shakeX');
            if (navigator.vibrate) navigator.vibrate(200);
            
            setTimeout(() => {
                card.classList.remove('animate__shakeX');
                GameData.isProcessing = false;
                // في حال انتهاء الوقت، نعيد رسم المستوى
                if (message.includes("الوقت")) this.render();
            }, 1000);
        }
    },

    // تحديث نجوم التقدم (Progress Stars)
    updateProgressStars() {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < GameData.level - 1) {
                star.classList.add('active');
            }
        });
    },

    // محرك النطق
    speak(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'ar-SA';
        msg.rate = 0.8;
        window.speechSynthesis.speak(msg);
    },

    playLocalSound(url) {
        new Audio(url).play().catch(() => console.log("Audio blocked"));
    },

    // شاشة النهاية
    showWinScreen() {
        const winScreen = document.getElementById('win-screen');
        if (winScreen) {
            winScreen.style.display = 'flex';
            document.getElementById('final-score-val').innerText = GameData.score;
        }
    }
};

// تهيئة اللعبة عند تحميل الصفحة
window.onload = () => {
    // محاولة تحميل الأصوات مسبقاً لمتصفح Chrome
    window.speechSynthesis.getVoices();
};
