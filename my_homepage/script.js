document.addEventListener('DOMContentLoaded', () => {
    // ================= 原有逻辑：飘落动画 =================
    const leafCount = 15;
    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.classList.add('falling-leaf');
        
        const size = Math.random() * 15 + 12; 
        const left = Math.random() * 100; 
        const delay = Math.random() * 15; 
        const duration = Math.random() * 10 + 18; 
        const isGreen = Math.random() > 0.5;
        
        leaf.style.width = `${size}px`;
        leaf.style.height = `${size}px`;
        leaf.style.left = `${left}%`;
        leaf.style.animation = `fall ${duration}s linear ${delay}s infinite`;
        
        if (isGreen) {
            leaf.innerHTML = `<svg viewBox="0 0 24 24" fill="rgba(143, 188, 143, 0.5)"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>`;
        } else {
            leaf.innerHTML = `<svg viewBox="0 0 20 20" fill="rgba(255, 255, 255, 0.8)"><ellipse cx="10" cy="10" rx="4" ry="8" transform="rotate(45 10 10)"/></svg>`;
        }
        document.body.appendChild(leaf);
    }

    // ================= 原有逻辑：播放器交互 =================
    const playBtn = document.querySelector('.play-btn');
    const progress = document.querySelector('.progress');
    let isPlaying = false;
    let progressInterval;

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                playBtn.innerHTML = '❚❚';
                playBtn.style.fontSize = '0.8rem';
                playBtn.style.letterSpacing = '-2px';
                
                let width = parseFloat(progress.style.width) || 30;
                progressInterval = setInterval(() => {
                    width += 0.1;
                    if (width >= 100) width = 0;
                    progress.style.width = `${width}%`;
                }, 100);
            } else {
                playBtn.innerHTML = '▶';
                playBtn.style.fontSize = '1rem';
                playBtn.style.letterSpacing = 'normal';
                clearInterval(progressInterval);
            }
        });
    }

    // ================= 新增逻辑：电子木鱼 =================
    const fishContainer = document.getElementById('fishContainer');
    const fishIcon = document.getElementById('fishIcon');
    const meritCountEl = document.getElementById('meritCount');
    let meritCount = 0;

    // 使用 Web Audio API 合成木鱼"咚"声 (无需外部音频文件)
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    function playDongSound() {
        // 恢复被浏览器挂起的音频上下文
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        // 模拟沉闷的敲击声
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(180, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.6, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.4);
    }

    if (fishContainer) {
        fishContainer.addEventListener('click', (e) => {
            // 1. 功德 +1
            meritCount++;
            meritCountEl.textContent = meritCount;

            // 2. 在鼠标点击位置生成飘字
            const floatText = document.createElement('div');
            floatText.classList.add('floating-text');
            // 随机显示 '功德+1' 或 '烦恼-1'
            floatText.textContent = Math.random() > 0.5 ? '功德 +1' : '烦恼 -1';
            
            // 获取点击坐标并定位
            const x = e.clientX;
            const y = e.clientY;
            floatText.style.left = `${x}px`;
            floatText.style.top = `${y}px`;
            
            document.body.appendChild(floatText);
            
            // 动画结束后移除 DOM 元素，防止内存泄漏
            setTimeout(() => {
                floatText.remove();
            }, 1500);

            // 3. 屏幕微微震动 (主要针对移动端设备)
            if (navigator.vibrate) {
                navigator.vibrate(40);
            }

            // 4. 播放音效
            playDongSound();
        });
    }
});