const GameData = {
    level: 1,           // المستوى الحالي (1-5)
    round: 1,           // المرحلة الحالية داخل المستوى (1-5)
    score: 0,
    maxLevels: 5,
    roundsPerLevel: 5,  // عدد المراحل المطلوبة في كل مستوى
    isProcessing: false,
    
    // بنك المعلومات المتنوع
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

const GameEngine = {
    start() {
        document.getElementById('start-overlay').style.display = 'none';
        this.render();
    },

    getStageConfig() {
        const configs = [
            { type: 'colors', name: 'عالم الألوان 🍎', count: 2, bg: '#a1c4fd' },
            { type: 'shapes', name: 'تحدي الأشكال 💠', count: 3, bg: '#84fab0' },
            { type: 'animals', name: 'مملكة الحيوان 🦁', count: 4, bg: '#fccb90' },
            { type: 'fruits', name: 'مزرعة الفواكه 🍓', count: 4, bg: '#ff9a9e' },
            { type: 'numbers', name: 'تحدي الأرقام 🔢', count: 6, bg: '#d57eeb' }
        ];
        return configs[GameData.level - 1];
    },

    render() {
        if (GameData.level > GameData.maxLevels) {
            this.showEnd();
            return;
        }

        const config = this.getStageConfig();
        document.body.style.backgroundColor = config.bg;
        
        // اختيار العناصر عشوائياً لكل مرحلة
        const pool = [...GameData.assets[config.type]].sort(() => 0.5 - Math.random());
        const options = pool.slice(0, config.count);
        this.target = options[Math.floor(Math.random() * options.length)];

        // تحديث النصوص والواجهة
        document.getElementById('mission-title').innerText = `${config.name} (المرحلة ${GameData.round}/5)`;
        document.getElementById('target-name').innerText = `أين${this.target.n}؟`;
        document.getElementById('score-val').innerText = GameData.score;
        this.updateProgressIcons();

        const grid = document.getElementById('options-grid');
        grid.innerHTML = ''; 
        grid.style.gridTemplateColumns = options.length > 4 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)';

        options.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'option-card animate__animated animate__zoomIn';
            btn.style.backgroundColor = item.c;
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
            this.handleSuccess(feedback);
        } else {
            this.handleFailure(feedback);
        }
    },

    handleSuccess(feedback) {
        GameData.score += 10;
        feedback.innerHTML = "<span style='color:#2ed573; font-size:1.5rem;'>بطل! إجابة صحيحة 🌟</span>";
        new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3').play().catch(()=>{});

        setTimeout(() => {
            if (GameData.round < GameData.roundsPerLevel) {
                GameData.round++; // نزيد المرحلة داخل نفس المستوى
            } else {
                GameData.level++; // ننتقل للمستوى التالي
                GameData.round = 1; // نصفر المراحل للمستوى الجديد
            }
            GameData.isProcessing = false;
            feedback.innerHTML = "";
            this.render();
        }, 1500);
    },

    handleFailure(feedback) {
        feedback.innerHTML = "<span style='color:#ff4757; font-size:1.5rem;'>حاول مرة أخرى 😊</span>";
        document.getElementById('game-card').classList.add('animate__shakeX');
        setTimeout(() => {
            document.getElementById('game-card').classList.remove('animate__shakeX');
            GameData.isProcessing = false;
        }, 1000);
    },

    updateProgressIcons() {
        const stars = document.querySelectorAll('.star');
        stars.forEach((s, i) => {
            // نضيء النجوم بناءً على المستويات المكتملة
            if (i < GameData.level - 1) {
                s.style.opacity = "1";
                s.style.filter = "grayscale(0)";
            } else {
                s.style.opacity = "0.2";
                s.style.filter = "grayscale(1)";
            }
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
        card.innerHTML = `
            <div style="padding: 40px; text-align:center;">
                <h1 style="font-size:3rem;">🎊 مبروك يا عبقري! 🎊</h1>
                <p style="font-size:1.5rem;">لقد اجتزت جميع المستويات والمراحل بنجاح!</p>
                <div style="font-size:2rem; margin:20px; color:#6c5ce7;">مجموع نقاطك: ${GameData.score}</div>
                <button onclick="location.reload()" class="main-btn">العب من جديد 🔄</button>
            </div>
        `;
        document.body.style.background = "linear-gradient(45deg, #6c5ce7, #a29bfe)";
    }
};

window.onload = () => {
    const startBtn = document.querySelector('.main-btn');
    if(startBtn) startBtn.onclick = () => GameEngine.start();
};
