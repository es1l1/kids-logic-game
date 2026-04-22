/**
 * المحرك اللانهائي (Infinite Engine)
 */
const GameState = {
    level: 1,
    score: 0,
    isProcessing: false,
    // بنك المعرفة الشامل
    db: {
        colors: [
            {n: "الأخضر", i: "🌿", c: "#2ed573"}, {n: "الأزرق", i: "💎", c: "#1e90ff"},
            {n: "الأحمر", i: "🍎", c: "#ff4757"}, {n: "الأصفر", i: "☀️", c: "#ffa502"},
            {n: "البنفسجي", i: "🍇", c: "#a29bfe"}, {n: "البرتقالي", i: "🍊", c: "#ff7f50"}
        ],
        shapes: [
            {n: "المربع", i: "⬛", c: "#2f3542"}, {n: "الدائرة", i: "⭕", c: "#5352ed"},
            {n: "النجمة", i: "⭐", c: "#ffa502"}, {n: "القلب", i: "❤️", c: "#ff6b81"},
            {n: "المثلث", i: "🔺", c: "#2ed573"}
        ],
        animals: [
            {n: "الأسد", i: "🦁", c: "#e67e22"}, {n: "الباندا", i: "🐼", c: "#ced6e0"},
            {n: "الفيل", i: "🐘", c: "#70a1ff"}, {n: "الزرافة", i: "🦒", c: "#f1c40f"}
        ],
        numbers: [
            {n: "1", i: "1️⃣", c: "#2ed573"}, {n: "5", i: "5️⃣", c: "#ffa502"},
            {n: "9", i: "9️⃣", c: "#1e90ff"}, {n: "0", i: "0️⃣", c: "#747d8c"}
        ]
    }
};

const GameEngine = {
    start() {
        document.getElementById('start-overlay').style.display = 'none';
        this.nextChallenge();
    },

    /**
     * خوارزمية التوليد التلقائي
     */
    nextChallenge() {
        // 1. اختيار نوع التحدي عشوائياً
        const categories = Object.keys(GameState.db);
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        
        // 2. تحديد عدد الخيارات بناءً على المستوى (صعوبة تصاعدية)
        // يبدأ بـ 2 ويزيد كل مستوى حتى يصل لـ 8 خيارات بحد أقصى
        let count = Math.min(2 + Math.floor(GameState.level / 3), 8);
        
        // 3. استخراج الخيارات عشوائياً
        const pool = [...GameState.db[randomCat]].sort(() => 0.5 - Math.random());
        const options = pool.slice(0, count);
        this.target = options[Math.floor(Math.random() * options.length)];

        this.render(options);
    },

    render(options) {
        document.getElementById('mission-title').innerText = `المستوى ${GameState.level} 🚀`;
        document.getElementById('target-name').innerText = `أين هو ${this.target.n}؟`;
        document.getElementById('score-val').innerText = GameState.score;

        const grid = document.getElementById('options-grid');
        grid.innerHTML = '';
        
        // خوارزمية ذكية لتوزيع الشبكة (2 أعمدة أو 3 بناءً على العدد)
        grid.style.gridTemplateColumns = options.length > 4 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)';

        options.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'option-card animate__animated animate__backInUp';
            btn.style.backgroundColor = item.c;
            btn.innerHTML = item.i;
            btn.onclick = () => this.check(item);
            grid.appendChild(btn);
        });

        this.speak(`أين هو ${this.target.n}`);
    },

    check(selected) {
        if (GameState.isProcessing) return;
        GameState.isProcessing = true;

        if (selected.n === this.target.n) {
            GameState.score += 10;
            GameState.level++; // تقدم لا نهائي
            document.getElementById('feedback-area').innerHTML = "✨ رائعة!";
            new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3').play().catch(()=>{});
            
            setTimeout(() => {
                GameState.isProcessing = false;
                this.nextChallenge();
            }, 1200);
        } else {
            document.getElementById('game-card').classList.add('animate__shakeX');
            setTimeout(() => {
                document.getElementById('game-card').classList.remove('animate__shakeX');
                GameState.isProcessing = false;
            }, 800);
        }
    },

    speak(text) {
        window.speechSynthesis.cancel();
        const m = new SpeechSynthesisUtterance(text);
        m.lang = 'ar-SA';
        window.speechSynthesis.speak(m);
    }
};

window.onload = () => {
    const btn = document.querySelector('.main-btn');
    if(btn) btn.onclick = () => GameEngine.start();
};
