/**
 * نظام إدارة الحالة (State Management)
 * لفصل البيانات عن المنطق البرمجي
 */
const GameState = {
    level: 1,
    round: 1,
    score: 0,
    maxLevels: 5,
    roundsPerLevel: 5,
    isProcessing: false,
    assets: {
        colors: [
            {n: "الأخضر", i: "🌿", c: "#2ed573"}, {n: "الأزرق", i: "💎", c: "#1e90ff"},
            {n: "الأحمر", i: "🍎", c: "#ff4757"}, {n: "الأصفر", i: "☀️", c: "#ffa502"},
            {n: "البنفسجي", i: "🍇", c: "#a29bfe"}, {n: "البرتقالي", i: "🍊", c: "#ff7f50"}
        ],
        shapes: [
            {n: "المربع", i: "⬛", c: "#2f3542"}, {n: "الدائرة", i: "⭕", c: "#5352ed"},
            {n: "النجمة", i: "⭐", c: "#ffa502"}, {n: "القلب", i: "❤️", c: "#ff6b81"},
            {n: "المثلث", i: "🔺", c: "#2ed573"}, {n: "القمر", i: "🌙", c: "#f1c40f"}
        ],
        animals: [
            {n: "الأسد", i: "🦁", c: "#e67e22"}, {n: "الباندا", i: "🐼", c: "#ced6e0"},
            {n: "الفيل", i: "🐘", c: "#70a1ff"}, {n: "الأرنب", i: "🐰", c: "#ffffff"},
            {n: "الزرافة", i: "🦒", c: "#f1c40f"}, {n: "القرد", i: "🐒", c: "#a04000"}
        ],
        fruits: [
            {n: "الموز", i: "🍌", c: "#eccc68"}, {n: "العنب", i: "🍇", c: "#a29bfe"},
            {n: "البطيخ", i: "🍉", c: "#ff6b81"}, {n: "الكرز", i: "🍒", c: "#ff4757"},
            {n: "الأناناس", i: "🍍", c: "#ffa502"}, {n: "الكيوي", i: "🥝", c: "#2ed573"}
        ],
        numbers: [
            {n: "الرقم واحد", i: "1️⃣", c: "#2ed573"}, {n: "الرقم خمسة", i: "5️⃣", c: "#ffa502"},
            {n: "الرقم تسعة", i: "9️⃣", c: "#1e90ff"}, {n: "الرقم صفر", i: "0️⃣", c: "#747d8c"},
            {n: "الرقم أربعة", i: "4️⃣", c: "#ff4757"}, {n: "الرقم ثمانية", i: "8️⃣", c: "#6c5ce7"}
        ]
    }
};

/**
 * المحرك الرئيسي للعبة (Game Engine)
 */
const GameEngine = {
    // إعدادات الأصوات الخارجية
    sounds: {
        success: new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3'),
        win: new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3')
    },

    start() {
        const overlay = document.getElementById('start-overlay');
        if (overlay) overlay.classList.add('animate__fadeOut');
        setTimeout(() => overlay.style.display = 'none', 500);
        
        this.initVoice();
        this.render();
    },

    /**
     * تهيئة محرك الصوت لضمان العمل على جميع المتصفحات
     */
    initVoice() {
        window.speechSynthesis.getVoices();
        this.speak(""); // رسالة فارغة لفتح قناة الصوت
    },

    getStageConfig() {
        const configs = [
            { type: 'colors', name: 'عالم الألوان 🍎', count: 2, bg: '#a1c4fd' },
            { type: 'shapes', name: 'تحدي الأشكال 💠', count: 3, bg: '#84fab0' },
            { type: 'animals', name: 'مملكة الحيوان 🦁', count: 4, bg: '#fccb90' },
            { type: 'fruits', name: 'مزرعة الفواكه 🍓', count: 4, bg: '#ff9a9e' },
            { type: 'numbers', name: 'تحدي الأرقام 🔢', count: 6, bg: '#d57eeb' }
        ];
        return configs[GameState.level - 1];
    },

    render() {
        if (GameState.level > GameState.maxLevels) {
            this.showEnd();
            return;
        }

        const config = this.getStageConfig();
        this.applyTheme(config.bg);
        
        // اختيار العناصر بنظام "عدم التكرار"
        const options = this.shuffle([...GameState.assets[config.type]]).slice(0, config.count);
        this.target = options[Math.floor(Math.random() * options.length)];

        // تحديث واجهة المستخدم
        document.getElementById('mission-title').innerText = `${config.name} (المرحلة ${GameState.round}/5)`;
        document.getElementById('target-name').innerText = `أين ${this.target.n}؟`;
        document.getElementById('score-val').innerText = GameState.score;
        
        this.updateProgressIcons();
        this.buildGrid(options);
        
        // نطق السؤال بتأخير بسيط ليعطي شعوراً احترافياً
        setTimeout(() => this.speak(`أين هو ${this.target.n}`), 300);
    },

    applyTheme(color) {
        document.body.style.backgroundColor = color;
    },

    shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    },

    buildGrid(options) {
        const grid = document.getElementById('options-grid');
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = options.length > 4 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)';

        options.forEach((item, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-card animate__animated animate__fadeInUp';
            btn.style.animationDelay = `${index * 0.1}s`;
            btn.style.backgroundColor = item.c;
            btn.innerHTML = `<span class="icon-inner">${item.i}</span>`;
            btn.onclick = () => this.check(item, btn);
            grid.appendChild(btn);
        });
    },

    check(selected, btnElement) {
        if (GameState.isProcessing) return;
        GameState.isProcessing = true;

        const feedback = document.getElementById('feedback-area');
        
        if (selected.n === this.target.n) {
            btnElement.classList.add('correct-pulse');
            this.handleSuccess(feedback);
        } else {
            btnElement.classList.add('error-shake');
            this.handleFailure(feedback);
        }
    },

    handleSuccess(feedback) {
        GameState.score += 10;
        feedback.innerHTML = "<span class='status-success'>بطل! إجابة صحيحة 🌟</span>";
        this.sounds.success.play().catch(() => {});

        setTimeout(() => {
            if (GameState.round < GameState.roundsPerLevel) {
                GameState.round++;
            } else {
                GameState.level++;
                GameState.round = 1;
            }
            GameState.isProcessing = false;
            feedback.innerHTML = "";
            this.render();
        }, 1500);
    },

    handleFailure(feedback) {
        feedback.innerHTML = "<span class='status-error'>حاول مرة أخرى 😊</span>";
        const card = document.getElementById('game-card');
        card.classList.add('animate__shakeX');
        
        setTimeout(() => {
            card.classList.remove('animate__shakeX');
            GameState.isProcessing = false;
        }, 800);
    },

    updateProgressIcons() {
        const stars = document.querySelectorAll('.star');
        stars.forEach((s, i) => {
            const isActive = i < GameState.level - 1;
            s.style.opacity = isActive ? "1" : "0.2";
            s.style.filter = isActive ? "grayscale(0) drop-shadow(0 0 5px gold)" : "grayscale(1)";
            if (isActive) s.classList.add('animate__animated', 'animate__bounceIn');
        });
    },

    speak(text) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'ar-SA';
        msg.rate = 0.9;
        msg.pitch = 1.1; // صوت أكثر حيوية للأطفال
        window.speechSynthesis.speak(msg);
    },

    showEnd() {
        this.sounds.win.play().catch(() => {});
        const card = document.getElementById('game-card');
        card.className = "game-card final-win animate__animated animate__zoomIn";
        card.innerHTML = `
            <div class="end-content">
                <h1 class="bounce-text">🎊 عبقري مذهل! 🎊</h1>
                <p>لقد أثبتّ أنك بطل الألوان والأشكال!</p>
                <div class="final-score-pill">مجموع نقاطك: ${GameState.score}</div>
                <button onclick="location.reload()" class="retry-btn">مغامرة جديدة؟ 🔄</button>
            </div>
        `;
        document.body.style.background = "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)";
    }
};

/**
 * تهيئة اللعبة
 */
window.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.querySelector('.main-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => GameEngine.start());
    }
});
