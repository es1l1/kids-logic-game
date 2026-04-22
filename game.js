const colors = [
    { name: "الأحمر", hex: "#FF0000" },
    { name: "الأزرق", hex: "#0000FF" },
    { name: "الأخضر", hex: "#00FF00" }
];

function initGame() {
    const target = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById('target-color-name').innerText = target.name;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ''; // تنظيف الخيارات السابقة

    colors.forEach(color => {
        const btn = document.createElement('button');
        btn.style.backgroundColor = color.hex;
        btn.onclick = () => checkAnswer(color.name, target.name);
        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(selected, target) {
    const feedback = document.getElementById('feedback');
    if(selected === target) {
        feedback.innerText = "بطل! إجابة صحيحة 🌟";
        setTimeout(initGame, 1500);
    } else {
        feedback.innerText = "حاول مرة أخرى يا ذكي! 😊";
    }
}

initGame();