document.addEventListener("DOMContentLoaded", () => {

    // LOGIN
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const message = document.getElementById("message");
            message.textContent = "";

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    message.style.color = "#4CAF50";
                    message.textContent = "Login successful";

                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 900);
                } else {
                    message.style.color = "#e53935";
                    message.textContent = data.message;
                }

            } catch {
                message.style.color = "#e53935";
                message.textContent = "Server connection error";
            }
        });
    }

    // REGISTER
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const message = document.getElementById("registerMessage");
            message.textContent = "";

            const username = document.getElementById("regUsername").value.trim();
            const password = document.getElementById("regPassword").value.trim();

            try {
                const response = await fetch("/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    message.style.color = "#4CAF50";
                    message.textContent = "Account created successfully";

                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1200);
                } else {
                    message.style.color = "#e53935";
                    message.textContent = data.message;
                }

            } catch {
                message.style.color = "#e53935";
                message.textContent = "Server connection error";
            }
        });
    }

    /* ===================================================== */
    /* 🔥 ADDED: MOOD OVERVIEW + ANIMATIONS (NO CHANGES ABOVE) */
    /* ===================================================== */

    function animateNumber(element, finalValue, suffix=""){
        let start = 0;
        let duration = 600;
        let step = finalValue / (duration / 16);

        function update(){
            start += step;
            if(start >= finalValue){
                element.innerText = finalValue + suffix;
            }else{
                element.innerText = parseFloat(start).toFixed(1) + suffix;
                requestAnimationFrame(update);
            }
        }

        update();
    }

    function loadMoodOverview(){

        let data = JSON.parse(localStorage.getItem("moods")) || [];

        if(data.length === 0){
            if(document.getElementById("avgMood"))
                document.getElementById("avgMood").innerText = "--";

            if(document.getElementById("streak"))
                document.getElementById("streak").innerText = "0 days";

            if(document.getElementById("trend"))
                document.getElementById("trend").innerText = "No Data";

            return;
        }

        let last7 = data.slice(0,7);
        let avg = last7.reduce((a,b)=>a+b.mood,0) / last7.length;

        if(document.getElementById("avgMood")){
            animateNumber(document.getElementById("avgMood"), avg.toFixed(1));
        }

        if(document.getElementById("avgCircle")){
            let angle = (avg / 5) * 360;
            document.getElementById("avgCircle").style.background =
            `conic-gradient(#6366f1 ${angle}deg, #e5e7eb ${angle}deg)`;
        }

        let emoji="😟";
        if(avg >= 4) emoji="😄";
        else if(avg >= 3) emoji="😊";
        else if(avg >= 2) emoji="🙂";

        if(document.getElementById("avgEmoji")){
            document.getElementById("avgEmoji").innerText = emoji;
        }

        let streak = 1;

        for(let i=1;i<data.length;i++){
            let prev = new Date(data[i-1].date);
            let curr = new Date(data[i].date);

            if((prev - curr)/(1000*60*60*24) === 1){
                streak++;
            } else break;
        }

        if(document.getElementById("streak")){
            animateNumber(document.getElementById("streak"), streak, " days");
        }

        let trendText = "Stable";
        let trendClass = "trend-stable";
        let trendEmoji = "📊";

        if(avg < 2){
            trendText = "Low";
            trendClass = "trend-low";
            trendEmoji = "📉";
        }
        else if(avg >= 3.5){
            trendText = "Positive";
            trendClass = "trend-positive";
            trendEmoji = "📈";
        }

        if(document.getElementById("trend")){
            let trendEl = document.getElementById("trend");
            trendEl.innerText = trendText;
            trendEl.classList.add(trendClass);
        }

        if(document.getElementById("trendEmoji")){
            document.getElementById("trendEmoji").innerText = trendEmoji;
        }

    }

    if(document.getElementById("avgMood")){
        loadMoodOverview();
    }

    /* ===================================================== */
    /* 🌙 NEW: DARK / LIGHT TOGGLE (ADDED ONLY) */
    /* ===================================================== */

    window.toggleTheme = function(){

        let toggle = document.getElementById("themeToggle");
        let circle = document.getElementById("toggleCircle");

        if(!toggle) return;

        if(toggle.checked){

            document.body.style.background = "#0f172a";
            document.body.style.color = "white";

            if(circle) circle.style.transform = "translateX(20px)";

            localStorage.setItem("theme","dark");
            }else{

    document.body.style.background = "";
    document.body.style.color = "";

    if(circle) circle.style.transform = "translateX(0px)";

    localStorage.setItem("theme","light");
}
    }

    // APPLY SAVED THEME
    let savedTheme = localStorage.getItem("theme");

    if(savedTheme === "dark"){
        let toggle = document.getElementById("themeToggle");
        if(toggle){
            toggle.checked = true;
            toggleTheme();
        }
    }

    /* ===================================================== */
    /* 🚀 NEW: SETTINGS MENU FUNCTIONALITY (ADDED ONLY) */
    /* ===================================================== */
    


});