const GameData = {
    level: 1,
    score: 0,
    maxLevels: 5,
    isProcessing: false,
    timer: null,
    // بنك المعلومات
    assets: {
        colors: [{n: "أخضر", i: "🌿", c: "#2ed573"}, {n: "أزرق", i: "💎", c: "#1e90ff"}, {n: "أحمر", i: "🍎", c: "#ff4757"}, {n: "أصفر", i: "☀️", c: "#ffa502"}],
        shapes: [{n: "مربع", i: "⬛", c: "#2f3542"}, {n: "دائرة", i: "⭕", c: "#5352ed"}, {n: "نجمة", i: "⭐", c: "#ffa502"}, {n: "قلب", i: "❤️", c: "#ff6b81"}],
        animals: [{n: "أسد", i: "🦁", c: "#e67e22"}, {n: "باندا", i: "🐼", c: "#ced6e0"}, {n: "فيل", i: "🐘", c: "#70a1ff"}, {n: "قرد", i: "🐒", c: "#a04000"}],
        fruits: [{n: "موز", i: "🍌", c: "#eccc68"}, {n: "عنب", i: "🍇", c: "#a29bfe"}, {n: "بطيخ", i: "🍉", c: "#ff6b81"}, {n: "فراولة", i: "🍓", c: "#ff4757"}],
        numbers: [{n: "واحد", i: "1️⃣", c: "#2ed573"}, {n: "خمسة", i: "5️⃣", c: "#ffa502"}, {n: "تسعة", i: "9️⃣", c: "#1e90ff"}, {n: "صفر", i: "0️⃣", c: "#747d8c"}]
    }
};

const GameEngine = {
    start() {
        const overlay = document.getElementById('start-overlay');
        if(overlay) overlay.style.display = 'none';
        this.render();
    },

    getStageConfig() {
        const stages = [
            { type: 'colors', name: 'مرحلة الألوان 🍎', count: 2, bg: '#a1c4fd' },
            { type: 'shapes', name: 'تحدي الأشكال 💠', count: 4, bg: '#84fab0' },
            { type: 'animals', name: 'مملكة الحيوان 🦁', count: 4, bg: '#fccb90' },
            { type: 'fruits', name: 'مزرعة الفواكه 🍓', count: 6, bg: '#ff9a9e' },
            { type: 'numbers', name: 'تحدي الأرقام 🔢', count: 6, bg: '#d57eeb' }
        ];
        return stages[GameData.level - 1];
    },

    render() {
        if (GameData.level > GameData.maxLevels) {
            this.showEnd();
            return;
        }

        const config = this.getStageConfig();
        document.body.style.backgroundColor = config.bg;
        
        // اختيار الخيارات
        const pool = [...GameData.assets[config.type]].sort(() => 0.5 - Math.random());
        const options = pool.slice(0, config.count);
        this.target = options[Math.floor(Math.random() * options.length)];

        // تحديث النصوص
        document.getElementById('mission-title').innerText = config.name;
        document.getElementById('target-name').innerText = `أين هو ${this.target.n}؟`;
        document.getElementById('score-val').innerText = GameData.score;
        this.updateStars();

        // رسم الأزرار (هنا الجزء الذي كان ينقصك)
        const grid = document.getElementById('options-grid');
        grid.innerHTML = ''; // تنظيف الأزرار السابقة
        
        // تنسيق الشبكة
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = options.length > 4 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)';
        grid.style.gap = '15px';

        options.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'option-card animate__animated animate__zoomIn';
            btn.style.backgroundColor = item.c;
            btn.style.padding = '20px';
            btn.style.border = '4px solid white';
            btn.style.borderRadius = '20px';
            btn.style.fontSize = '3rem';
            btn.style.cursor = 'pointer';
            btn.innerHTML = item.i;
            
            btn.onclick = () => this.check(item);
            grid.appendChild(btn);
        });

        this.speak(`أين هو ${this.target.n}`);
    },

    check(selected) {
        if (GameData.isProcessing) return;
        GameData.isProcessing = true;

        const feedback = document.getElementById('feedback-area');
        if (selected.n === this.target.n) {
            GameData.score += 20;
            GameData.level++;
            feedback.innerHTML = "<span style='color:green'>إجابة صحيحة! 🌟</span>";
            setTimeout(() => {
                GameData.isProcessing = false;
                this.render();
            }, 1500);
        } else {
            feedback.innerHTML = "<span style='color:red'>حاول مجدداً 😊</span>";
            setTimeout(() => {
                GameData.isProcessing = false;
                feedback.innerHTML = "";
            }, 1000);
        }
    },

    updateStars() {
        const stars = document.querySelectorAll('.star');
        stars.forEach((s, i) => {
            s.style.opacity = (i < GameData.level - 1) ? "1" : "0.2";
            s.style.filter = (i < GameData.level - 1) ? "grayscale(0)" : "grayscale(1)";
        });
    },

    speak(text) {
        window.speechSynthesis.cancel();
        const m = new SpeechSynthesisUtterance(text);
        m.lang = 'ar-SA';
        window.speechSynthesis.speak(m);
    },

    showEnd() {
        const card = document.getElementById('game-card');
        card.innerHTML = `<h1>🎉 مبروك! 🎉</h1><p>لقد أتممت التحدي بنجاح!</p><h2>النقاط: ${GameData.score}</h2><button onclick="location.reload()" style="padding:10px 20px; cursor:pointer;">العب مرة أخرى</button>`;
    }
};

// تشغيل اللعبة
window.onload = () => {
    // لضمان عمل زر البداية
    const startBtn = document.querySelector('.main-btn');
    if(startBtn) startBtn.onclick = () => GameEngine.start();
};
