// 1. قاعدة بيانات الألوان (احترافية وسهلة التوسيع)
const COLOR_PALETTE = [
    { name: "الأحمر", hex: "#FF5733" },
    { name: "الأخضر", hex: "#33FF57" },
    { name: "الأزرق", hex: "#3357FF" },
    { name: "الأصفر", hex: "#F3FF33" },
    { name: "البنفسجي", hex: "#8D33FF" },
    { name: "البرتقالي", hex: "#FF8D33" }
];

// 2. حالة اللعبة الحالية
let gameState = {
    level: 1,
    score: 0,
    targetColor: null,
    isProcessing: false // لمنع الضغط المتكرر أثناء الأنيميشن
};

const LogicEngine = {
    // اختيار الألوان بناءً على المستوى
    generateChallenge: function() {
        // زيادة عدد الخيارات تدريجياً من 2 إلى 6
        const count = Math.min(2 + Math.floor(gameState.level / 3), COLOR_PALETTE.length);
        const shuffled = [...COLOR_PALETTE].sort(() => 0.5 - Math.random());
        const options = shuffled.slice(0, count);
        
        // اختيار اللون المستهدف عشوائياً من الخيارات المتاحة
        gameState.targetColor = options[Math.floor(Math.random() * options.length)];
        
        return options;
    },

    processAnswer: function(colorHex) {
        if (gameState.isProcessing) return;
        gameState.isProcessing = true;

        const isCorrect = colorHex === gameState.targetColor.hex;
        const feedbackEl = document.getElementById('feedback');
        const container = document.getElementById('game-container');

        if (isCorrect) {
            gameState.score += 10;
            gameState.level++;
            this.updateUI("أحسنت! أنت ذكي جداً 🌟", "#2ECC71", "scale-up");
        } else {
            this.updateUI("حاول مرة أخرى، أنت تستطيع! 💪", "#E74C3C", "shake");
        }

        // إيقاف اللعب مؤقتاً لعرض النتيجة ثم الانتقال للتحدي التالي
        setTimeout(() => {
            feedbackEl.innerText = "";
            container.className = ""; // إزالة تأثيرات الأنيميشن
            gameState.isProcessing = false;
            this.render();
        }, 1500);
    },

    updateUI: function(msg, color, animationClass) {
        const feedbackEl = document.getElementById('feedback');
        const container = document.getElementById('game-container');
        const scoreEl = document.getElementById('score-display'); // تأكد من إضافة هذا في HTML

        feedbackEl.innerText = msg;
        feedbackEl.style.color = color;
        container.classList.add(animationClass);
        if(scoreEl) scoreEl.innerText = `النقاط: ${gameState.score}`;
    },

    render: function() {
        const options = this.generateChallenge();
        const optionsContainer = document.getElementById('options');
        const targetNameDisplay = document.getElementById('target-color-name');

        // تحديث النص المستهدف
        targetNameDisplay.innerText = gameState.targetColor.name;
        targetNameDisplay.style.color = "#4A4A4A";

        // بناء الأزرار
        optionsContainer.innerHTML = ''; 
        options.forEach(color => {
            const btn = document.createElement('button');
            btn.className = "game-btn";
            btn.style.backgroundColor = color.hex;
            btn.setAttribute('aria-label', color.name); // للوصول الشامل
            btn.onclick = () => this.processAnswer(color.hex);
            optionsContainer.appendChild(btn);
        });
    }
};

// تشغيل اللعبة
window.onload = () => LogicEngine.render();
