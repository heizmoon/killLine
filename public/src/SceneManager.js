export class SceneManager {
    constructor() {
        this.titleElement = document.createElement('div');
        Object.assign(this.titleElement.style, {
            position: 'absolute',
            top: '40%',
            left: '0',
            width: '100%',
            textAlign: 'center',
            color: '#fff',
            fontFamily: "'Courier New', serif",
            fontSize: '48px',
            fontWeight: 'bold',
            textShadow: '0 0 10px #f00',
            opacity: '0',
            pointerEvents: 'none',
            zIndex: '500',
            transition: 'opacity 2s ease-in-out'
        });
        document.body.appendChild(this.titleElement);

        this.currentSceneIndex = 0;
        this.sceneNames = [
            "西雅图冷雨夜 (Seattle Rain)",
            "下水道深处 (The Sewers)",
            "血肉工厂 (Flesh Factory)",
            "斩杀线 (The Kill Line)"
        ];
    }

    showTitle(name) {
        this.titleElement.innerText = name;
        this.titleElement.style.opacity = '1';

        setTimeout(() => {
            this.titleElement.style.opacity = '0';
        }, 4000); // Show for 4s
    }

    nextScene() {
        this.currentSceneIndex++;
        if (this.currentSceneIndex < this.sceneNames.length) {
            this.showTitle(this.sceneNames[this.currentSceneIndex]);
        }
    }

    start() {
        this.showTitle(this.sceneNames[0]);
    }
}
