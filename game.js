const GameState = {
    score: 0,
    level: 1,
    currentTarget: null,
    isProcessing: false,
    timerId: null,
    audioReady: false,
    assets: {
        colors: [
            { name: "الأحمر", hex: "#ff5e57", icon: "🍎" },
            { name: "الأزرق", hex: "#1e90ff", icon: "💎" },
            { name: "الأخضر", hex: "#2ed573", icon: "🌿" },
            { name: "الأصفر", hex: "#ffa502", icon: "☀️" },
            { name: "البنفسجي", hex: "#a29bfe", icon: "🍇" }
        ],
        shapes: [
            { name: "الدائرة", hex: "#6c5ce7", icon: "⭕" },
            { name: "المربع", hex: "#fd9644", icon: "⬛" },
            { name: "النجمة", hex: "#f7b731", icon: "⭐" },
            { name: "المثلث", hex: "#26de81", icon: "🔺" },
            { name: "القلب", hex: "#eb4d4b", icon: "❤️" }
        ],
        animals: [
            { name: "الأسد", hex: "#e67e22", icon: "🦁" },
            { name: "الفيل", hex: "#95a5a6", icon: "🐘" },
            { name: "البطة", hex: "#f1c40f", icon: "🦆" },
            { name: "الأرنب", hex: "#ecf0f1", icon: "🐰" },
            { name: "القرد", hex: "#a04000", icon: "🐒" }
        ]
    }
};

const GameEngine = {
    init() {
        this.render();
    },

    // اختيار المرحلة وصعوبتها
    getConfig() {
        if (GameState.level <= 5) {
            return { type: 'colors', count: 2, bg: '#a1c4fd', timer: null };
        } else if (GameState.level <= 10) {
            return { type: 'shapes', count: 4, bg: '#84fab0', timer: 10 };
        } else {
            return { type: 'animals', count: 6, bg: '#fccb90', timer: 7 };
        }
    },

    render() {
        const config = this.getConfig();
        document.body.style.background = config.bg;
        
        const pool = GameState.assets[config.type];
        const options = [...pool].sort(() => 0.5 - Math.random()).slice(0, config.count);
        GameState.currentTarget = options[Math.floor(Math.random() * options.length)];

        // تحديث الواجهة
        document.getElementById('level').innerText = GameState.level;
        document.getElementById('score').innerText = GameState.score;
        document.getElementById('target-display').innerText = GameState.currentTarget.name;
        document.getElementById('feedback-msg').innerText = "";
        
        const grid = document.getElementById('options-grid');
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = options.length > 4 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)';

        options.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'color-btn animate__animated animate__zoomIn';
            btn.style.backgroundColor = item.hex;
            btn.innerHTML = item.icon;
            btn.onclick = () => this.checkAnswer(item);
            grid.appendChild(btn);
        });

        if (GameState.audioReady) this.speak();
        this.manageTimer(config.timer);
    },

    manageTimer(seconds) {
        clearInterval(GameState.timerId);
        const box = document.getElementById('timer-box');
        if (seconds) {
            box.style.visibility = 'visible';
            let left = seconds;
            document.getElementById('timer-val').innerText = left;
            GameState.timerId = setInterval(() => {
                left--;
                document.getElementById('timer-val').innerText = left;
                if (left <= 0) {
                    clearInterval(GameState.timerId);
                    this.handleResponse(false, "انتهى الوقت! ⏰");
                }
            }, 1000);
        } else {
            box.style.visibility = 'hidden';
        }
    },

    speak() {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(`أين هو ${GameState.currentTarget.name}`);
        msg.lang = 'ar-SA';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
    },

    checkAnswer(selected) {
        if (GameState.isProcessing) return;
        const isCorrect = selected.name === GameState.currentTarget.name;
        this.handleResponse(isCorrect, isCorrect ? "أحسنت! إجابة صحيحة 🌟" : "حاول مرة أخرى 😊");
    },

    handleResponse(success, msg) {
        GameState.isProcessing = true;
        clearInterval(GameState.timerId);
        
        const feedback = document.getElementById('feedback-msg');
        feedback.innerText = msg;
        feedback.style.color = success ? "#2ed573" : "#ff5e57";

        if (success) {
            GameState.score += 10;
            GameState.level++;
            new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3').play().catch(()=>{});
            setTimeout(() => {
                GameState.isProcessing = false;
                this.render();
            }, 1500);
        } else {
            document.getElementById('game-card').classList.add('animate__shakeX');
            setTimeout(() => {
                document.getElementById('game-card').classList.remove('animate__shakeX');
                GameState.isProcessing = false;
                if (msg.includes("الوقت")) this.render();
            }, 800);
        }
    }
};

function startApp() {
    GameState.audioReady = true;
    document.getElementById('start-overlay').style.display = 'none';
    GameEngine.init();
}
