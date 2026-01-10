document.addEventListener('DOMContentLoaded', function () {

    /* =======================
       URL PARAMS
    ======================== */
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('user'); // email
    const callType = urlParams.get('type') || 'video';

    /* =======================
       ELEMENTS
    ======================== */
    const callContainer = document.getElementById('callContainer');
    const callEndedScreen = document.getElementById('callEndedScreen');
    const callTimer = document.getElementById('callTimer');
    const callStatus = document.getElementById('callStatus');
    const endCallBtn = document.getElementById('endCallBtn');
    const muteBtn = document.getElementById('muteBtn');
    const cameraBtn = document.getElementById('cameraBtn');
    const subtitlesBtn = document.getElementById('subtitlesBtn');
    const turtleBtn = document.getElementById('turtleBtn');
    const minuteGoal = document.getElementById('minuteGoal');
    const subtitlesContainer = document.getElementById('subtitlesContainer');
    const finalDuration = document.getElementById('finalDuration');
    const minutesEarned = document.getElementById('minutesEarned');

    /* =======================
       STATE
    ======================== */
    let callActive = true;
    let seconds = 0;
    let muted = false;
    let cameraOff = false;
    let subtitlesOn = false;
    let turtleRequested = false;
    let timerInterval;

    /* =======================
       FETCH USER FROM INDEXEDDB
    ======================== */
    if (!userEmail) {
        document.getElementById('partnerName').textContent = 'Unknown user';
        return;
    }

    // =======================
// LOGGED USER (CALLER)
// =======================
const loggedUserEmail = localStorage.getItem("logged_user_email");

if (loggedUserEmail) {
    const openCallerDB = indexedDB.open("use_app");

    openCallerDB.onsuccess = function (event) {
        const db = event.target.result;
        const tx = db.transaction("users", "readonly");
        const store = tx.objectStore("users");
        const req = store.get(loggedUserEmail);

        req.onsuccess = function () {
            const user = req.result;
            if (user) {
                document.getElementById("callerName").textContent =
                    user.name || "You";
            } else {
                document.getElementById("callerName").textContent = "You";
            }
        };
    };
} else {
    document.getElementById("callerName").textContent = "You";
}


    const openRequest = indexedDB.open('use_app');

    openRequest.onerror = () => {
        console.error('IndexedDB error');
    };

    openRequest.onsuccess = function (event) {
        const db = event.target.result;
        const tx = db.transaction('users', 'readonly');
        const store = tx.objectStore('users');
        const request = store.get(userEmail);

        request.onsuccess = function () {
            const user = request.result;

            if (!user) {
                document.getElementById('partnerName').textContent = 'Unknown user';
                return;
            }

            // ✅ UPDATE UI HERE (CORRECT PLACE)
            document.getElementById('partnerName').textContent = user.name || 'User';
            document.getElementById('partnerLevel').textContent =
                `${capitalize(user.level)} • ${user.country || 'Unknown'}`;
            document.getElementById('partnerAvatar').src =
                user.avatar || 'https://i.pravatar.cc/150';
        };

        request.onerror = () => {
            console.error('Error fetching user');
        };
    };

    function capitalize(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    /* =======================
       TIMER
    ======================== */
    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;

            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;

            callTimer.textContent =
                `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

            if (seconds === 1) callStatus.textContent = 'Connected';
            if (seconds === 3) callStatus.textContent = 'Call in progress';

            if (seconds === 180) minuteGoal.classList.add('active');

            if (seconds === 300) {
                minuteGoal.classList.remove('active');
                minuteGoal.innerHTML =
                    '<i class="fas fa-unlock"></i> <span>Chat unlocked!</span>';
                minuteGoal.style.background = 'rgba(56,176,0,.9)';
                minuteGoal.classList.add('active');

                setTimeout(() => minuteGoal.classList.remove('active'), 5000);
            }

            if (seconds % 15 === 0 && subtitlesOn) addSubtitle();

        }, 1000);
    }

    function addSubtitle() {
        const subtitles = [
            "How's the weather where you are?",
            "I love practicing English with people from different countries.",
            "What are your hobbies?",
            "Do you enjoy watching movies in English?",
            "How did you learn English?",
            "Could you repeat that, please?"
        ];

        if (subtitlesContainer.children.length > 5) {
            subtitlesContainer.children[0].remove();
        }

        const line = document.createElement('div');
        line.className = 'subtitle-line';

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        line.innerHTML = `
          <span class="subtitle-time">
            ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}
          </span>
          ${subtitles[Math.floor(Math.random() * subtitles.length)]}
        `;

        subtitlesContainer.appendChild(line);
        subtitlesContainer.scrollTop = subtitlesContainer.scrollHeight;
    }

    /* =======================
       END CALL
    ======================== */
    function endCall() {
        clearInterval(timerInterval);
        callContainer.style.display = 'none';
        callEndedScreen.style.display = 'flex';

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        finalDuration.textContent =
            `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        const earned = Math.floor(seconds / 60);
        minutesEarned.textContent = earned;

        const total = parseInt(localStorage.getItem('use_total_minutes') || '0');
        localStorage.setItem('use_total_minutes', total + earned);
    }

    /* =======================
       EVENTS
    ======================== */
    endCallBtn.addEventListener('click', endCall);

    muteBtn.addEventListener('click', () => {
        muted = !muted;
        muteBtn.classList.toggle('active', muted);
    });

    cameraBtn.addEventListener('click', () => {
        cameraOff = !cameraOff;
        cameraBtn.classList.toggle('active', cameraOff);
    });

    subtitlesBtn.addEventListener('click', () => {
        subtitlesOn = !subtitlesOn;
        subtitlesBtn.classList.toggle('active', subtitlesOn);
        subtitlesContainer.classList.toggle('active', subtitlesOn);
        if (subtitlesOn) addSubtitle();
    });

    document.getElementById('goToChatBtn').addEventListener('click', () => {
        window.location.href = `chat.html?user=${userEmail}`;
    });

    document.getElementById('backToHubBtn').addEventListener('click', () => {
        window.location.href = 'explorar.html';
    });

    /* =======================
       START SIMULATION
    ======================== */
    setTimeout(startTimer, 1000);

});
