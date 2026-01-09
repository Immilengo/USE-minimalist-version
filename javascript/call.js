
        document.addEventListener('DOMContentLoaded', function() {
            // Get URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('user') || '1';
            const callType = urlParams.get('type') || 'video';
            
            // Elements
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
            
            // State
            let callActive = true;
            let seconds = 0;
            let muted = false;
            let cameraOff = false;
            let subtitlesOn = false;
            let turtleRequested = false;
            let timerInterval;
            
            // Mock user data
            const users = {
                '1': { name: 'Maria Silva', level: 'Native Speaker', country: 'Brazil', avatar: 'https://i.pravatar.cc/150?img=1' },
                '2': { name: 'John Smith', level: 'Native Speaker', country: 'USA', avatar: 'https://i.pravatar.cc/150?img=2' },
                '3': { name: 'Sarah Chen', level: 'Fluent Speaker', country: 'China', avatar: 'https://i.pravatar.cc/150?img=3' }
            };
            
            const user = users[userId] || users['1'];
            
            // Update UI with user info
            document.getElementById('partnerName').textContent = user.name;
            document.getElementById('partnerLevel').textContent = `${user.level} • ${user.country}`;
            document.getElementById('partnerAvatar').src = user.avatar;
            
            // Start timer
            function startTimer() {
                timerInterval = setInterval(() => {
                    seconds++;
                    const mins = Math.floor(seconds / 60);
                    const secs = seconds % 60;
                    callTimer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                    
                    // Update call status
                    if (seconds === 1) {
                        callStatus.textContent = 'Connected';
                    } else if (seconds === 3) {
                        callStatus.textContent = 'Call in progress';
                    }
                    
                    // Show minute goal at 3 minutes
                    if (seconds === 180) {
                        minuteGoal.classList.add('active');
                    }
                    
                    // Hide minute goal after 5 minutes (chat unlocked)
                    if (seconds === 300) {
                        minuteGoal.classList.remove('active');
                        minuteGoal.innerHTML = '<i class="fas fa-unlock"></i> <span>Chat unlocked! You can now message this person.</span>';
                        minuteGoal.style.background = 'rgba(56, 176, 0, 0.9)';
                        minuteGoal.classList.add('active');
                        
                        setTimeout(() => {
                            minuteGoal.classList.remove('active');
                        }, 5000);
                    }
                    
                    // Add random subtitles
                    if (seconds % 15 === 0 && subtitlesOn) {
                        addSubtitle();
                    }
                }, 1000);
            }
            
            // Add subtitle
            function addSubtitle() {
                const subtitles = [
                    "How's the weather where you are?",
                    "I love practicing English with people from different countries.",
                    "What are your hobbies?",
                    "Have you traveled anywhere interesting recently?",
                    "Do you enjoy watching movies in English?",
                    "What's your favorite type of food?",
                    "How did you learn English?",
                    "I think your pronunciation is really good!",
                    "Let me know if I'm speaking too fast.",
                    "Could you repeat that, please?"
                ];
                
                const lines = subtitlesContainer.querySelectorAll('.subtitle-line');
                if (lines.length > 5) {
                    lines[0].remove();
                }
                
                const newLine = document.createElement('div');
                newLine.className = 'subtitle-line';
                
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                
                newLine.innerHTML = `
                    <span class="subtitle-time">${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}</span>
                    ${subtitles[Math.floor(Math.random() * subtitles.length)]}
                `;
                
                subtitlesContainer.appendChild(newLine);
                subtitlesContainer.scrollTop = subtitlesContainer.scrollHeight;
            }
            
            // End call
            function endCall() {
                callActive = false;
                clearInterval(timerInterval);
                
                // Show ended screen
                callContainer.style.display = 'none';
                callEndedScreen.style.display = 'flex';
                
                // Update final duration
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                finalDuration.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                
                // Calculate minutes earned
                const earned = Math.floor(seconds / 60);
                minutesEarned.textContent = earned;
                
                // Save minutes to localStorage
                const totalMinutes = parseInt(localStorage.getItem('use_total_minutes') || '0');
                localStorage.setItem('use_total_minutes', (totalMinutes + earned).toString());
            }
            
            // Event Listeners
            endCallBtn.addEventListener('click', endCall);
            
            muteBtn.addEventListener('click', function() {
                muted = !muted;
                this.classList.toggle('active', muted);
                this.innerHTML = muted ? '<i class="fas fa-microphone-slash"></i>' : '<i class="fas fa-microphone"></i>';
                
                // Update my video
                const myVideo = document.getElementById('myVideo');
                myVideo.classList.toggle('muted', muted);
                
                if (muted) {
                    myVideo.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #444;"><i class="fas fa-microphone-slash" style="font-size: 2rem; color: #ff4757;"></i></div>';
                } else {
                    myVideo.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #444;"><i class="fas fa-user" style="font-size: 2rem; color: #999;"></i></div>';
                }
            });
            
            cameraBtn.addEventListener('click', function() {
                cameraOff = !cameraOff;
                this.classList.toggle('active', cameraOff);
                this.innerHTML = cameraOff ? '<i class="fas fa-video-slash"></i>' : '<i class="fas fa-video"></i>';
            });
            
            subtitlesBtn.addEventListener('click', function() {
                subtitlesOn = !subtitlesOn;
                this.classList.toggle('active', subtitlesOn);
                subtitlesContainer.classList.toggle('active', subtitlesOn);
                
                if (subtitlesOn) {
                    // Add initial subtitle
                    addSubtitle();
                }
            });
            
            turtleBtn.addEventListener('click', function() {
                if (!turtleRequested) {
                    turtleRequested = true;
                    this.classList.add('active');
                    this.innerHTML = '<i class="fas fa-turtle"></i> Request Sent';
                    
                    // Show notification
                    const notification = document.createElement('div');
                    notification.style.cssText = `
                        position: absolute;
                        top: 80px;
                        left: 20px;
                        background: rgba(102, 126, 234, 0.9);
                        color: white;
                        padding: 10px 15px;
                        border-radius: 10px;
                        font-size: 0.9rem;
                        z-index: 100;
                        animation: slideIn 0.3s ease;
                    `;
                    notification.innerHTML = '<i class="fas fa-info-circle"></i> Slow down request sent to partner';
                    document.querySelector('.video-container').appendChild(notification);
                    
                    setTimeout(() => {
                        notification.remove();
                        turtleBtn.classList.remove('active');
                        turtleBtn.innerHTML = '<i class="fas fa-turtle"></i> Slow Down';
                        turtleRequested = false;
                    }, 3000);
                }
            });
            
            // Call again button
            document.getElementById('callAgainBtn').addEventListener('click', function() {
                window.location.reload();
            });
            
            // Go to chat button
            document.getElementById('goToChatBtn').addEventListener('click', function() {
                window.location.href = `chat-private.html?user=${userId}`;
            });
            
            // Back to hub button
            document.getElementById('backToHubBtn').addEventListener('click', function() {
                window.location.href = 'hub.html';
            });
            
            // Start the call simulation
            setTimeout(() => {
                startTimer();
                
                // Simulate connection changes
                setInterval(() => {
                    const status = document.getElementById('connectionStatus');
                    const qualities = ['good', 'poor', 'bad'];
                    const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
                    
                    status.className = `connection-status ${randomQuality}`;
                    status.innerHTML = `<i class="fas fa-signal"></i> <span>${randomQuality.charAt(0).toUpperCase() + randomQuality.slice(1)} Connection</span>`;
                }, 10000);
            }, 1000);
        });