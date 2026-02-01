export class IntroManager {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.container = document.createElement('div');
        this.container.id = 'intro-screen';
        Object.assign(this.container.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            color: '#ddd',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '1000',
            padding: '50px',
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '24px',
            lineHeight: '1.5',
            cursor: 'pointer',
            whiteSpace: 'pre-wrap'
        });

        this.text = "万圣节的寒夜，冰雨如注。\n街道冷清得有些诡异。\n\n本以为这只是异乡漂泊中又一个平淡无奇的夜晚，\n却未曾料到，\n这竟是我步入万劫不复深渊的起点……";

        this.textPage = document.createElement('div');
        this.container.appendChild(this.textPage);
        document.body.appendChild(this.container);

        this.charIndex = 0;
        this.isSkipped = false;

        // Skip/Next on click
        this.container.addEventListener('click', () => this.skipOrNext());
    }

    start() {
        this.typeWriter();
    }

    typeWriter() {
        if (this.isSkipped) return;

        if (this.charIndex < this.text.length) {
            this.textPage.innerHTML += this.text.charAt(this.charIndex);
            this.charIndex++;

            // Randomize typing speed slightly for realism
            const speed = Math.random() * 50 + 50;
            setTimeout(() => this.typeWriter(), speed);
        } else {
            // Done typing, wait for click to finish
            const hint = document.createElement('div');
            hint.innerText = ">> 点击继续";
            hint.style.fontSize = "14px";
            hint.style.marginTop = "20px";
            hint.style.color = "#666";
            hint.style.animation = "blink 1s infinite";
            this.container.appendChild(hint);

            // Add keyframes for blinking if not exists
            if (!document.getElementById('blink-style')) {
                const style = document.createElement('style');
                style.id = 'blink-style';
                style.innerHTML = `@keyframes blink { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } }`;
                document.head.appendChild(style);
            }
        }
    }

    skipOrNext() {
        if (this.charIndex < this.text.length) {
            // Skip typing
            this.isSkipped = true;
            this.textPage.innerHTML = this.text;
            this.charIndex = this.text.length;
        } else {
            // Finish
            this.container.style.transition = 'opacity 1s';
            this.container.style.opacity = '0';
            setTimeout(() => {
                this.container.remove();
                this.onComplete();
            }, 1000);
        }
    }
}
