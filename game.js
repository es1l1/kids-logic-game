/**
 * المحرك اللانهائي المطور (Advanced Infinite Engine)
 */
const GameState = {
    level: 1,
    score: 0,
    isProcessing: false,
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
            {n: "واحد", i: "1️⃣", c: "#2ed573"}, {n: "خمسة", i: "5️⃣", c: "#ffa502"},
            {n: "تسعة", i: "9️⃣", c: "#1e90ff"}, {n: "صفر", i: "0️⃣", c: "#747d8c"},
            {n: "أربعة", i: "4️⃣", c: "#ff4757"}, {n: "ثمانية", i: "8️⃣", c: "#6c5ce7"}
        ]
    }
};

const GameEngine = {
    selectedVoice: null,

    start() {
        // تهيئة الأصوات فور الضغط
        this.loadVoices();
        document.getElementById('start-overlay').style.display = 'none';
        this.nextChallenge();
    },

    /**
     * خوارزمية اختيار الصوت العربي الصحيح (للكومبيوتر)
     */
    loadVoices() {
        const voices = window.speechSynthesis.getVoices();
        // البحث عن صوت عربي (سلمى، شاكر، أو أي صوت يدعم ar)
        this.selectedVoice = voices.find(v => v.lang.includes('ar')) || null;
    },

    nextChallenge() {
        const categories = Object.keys(GameState.db);
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        
        // صعوبة تصاعدية ذكية
        let count = Math.min(2 + Math.floor(GameState.level / 3), 8);
        
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

        const feedback = document.getElementById('feedback-area');

        if (selected.n === this.target.n) {
            GameState.score += 10;
            GameState.level++;
            feedback.innerHTML = "✨ رائعة يا بطل!";
            new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3').play().catch(()=>{});
            
            setTimeout(() => {
                feedback.innerHTML = "";
                GameState.isProcessing = false;
                this.nextChallenge();
            }, 1200);
        } else {
            feedback.innerHTML = "حاول مرة أخرى 😊";
            document.getElementById('game-card').classList.add('animate__shakeX');
            setTimeout(() => {
                document.getElementById('game-card').classList.remove('animate__shakeX');
                GameState.isProcessing = false;
            }, 800);
        }
    },

    /**
     * محرك النطق المصلح للكمبيوتر
     */
    speak(text) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        
        // إذا لم يتم تحميل الأصوات بعد، حاول جلبها مجدداً
        if (!this.selectedVoice) this.loadVoices();
        
        if (this.selectedVoice) {
            msg.voice = this.selectedVoice;
        }
        
        msg.lang = 'ar-SA';
        msg.rate = 0.8; // سرعة هادئة لتناسب الأطفال
        msg.pitch = 1.1; 
        window.speechSynthesis.speak(msg);
    }
};

// حدث هام لمتصفح كروم على الكمبيوتر لضمان تحميل الأصوات
window.speechSynthesis.onvoiceschanged = () => GameEngine.loadVoices();

window.onload = () => {
    const btn = document.querySelector('.main-btn');
    if(btn) btn.onclick = () => GameEngine.start();
};
