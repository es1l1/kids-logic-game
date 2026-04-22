// إعدادات اللعبة العالمية
const GameConfig = {
    currentLevel: 1,
    score: 0,
    difficultyMultiplier: 1.2,
    colors: ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#8D33FF"]
};

// كائن يمثل المحرك الذكي للعبة
const LogicEngine = {
    // توليد تحدي جديد بناءً على مستوى الطفل
    generateChallenge: function() {
        let numberOfOptions = Math.min(2 + Math.floor(GameConfig.currentLevel / 2), 6);
        let targetIndex = Math.floor(Math.random() * numberOfOptions);
        
        return {
            options: GameConfig.colors.slice(0, numberOfOptions),
            correctIndex: targetIndex,
            timeLimit: Math.max(10 - GameConfig.currentLevel, 3) // الوقت يقل مع تقدم المستوى
        };
    },

    // معالجة الإجابة وتطوير الصعوبة
    processAnswer: function(isCorrect) {
        if (isCorrect) {
            GameConfig.score += 10 * GameConfig.currentLevel;
            GameConfig.currentLevel++;
            this.showFeedback("أنت عبقري! ننتقل للمستوى " + GameConfig.currentLevel, "green");
        } else {
            this.showFeedback("حاول مجدداً، أنا أثق بك!", "orange");
            // لا نخفض المستوى لكي لا يشعر الطفل بالإحباط، بل نثبته
        }
        setTimeout(() => this.render(), 1000);
    },

    showFeedback: function(msg, color) {
        const f = document.getElementById('feedback');
        f.innerText = msg;
        f.style.color = color;
    },

    render: function() {
        const challenge = this.generateChallenge();
        const container = document.getElementById('options');
        container.innerHTML = ''; 

        challenge.options.forEach((color, index) => {
            const btn = document.createElement('button');
            btn.className = "game-btn";
            btn.style.backgroundColor = color;
            btn.onclick = () => this.processAnswer(index === challenge.correctIndex);
            container.appendChild(btn);
        });
    }
};

// بدء اللعبة عند تحميل الصفحة
window.onload = () => LogicEngine.render();
