export class SceneManager {
    constructor() {
        this.currentSceneIndex = 0;
        this.sceneNames = [
            "西雅图冷雨夜 (Seattle Rain)",
            "下水道深处 (The Sewers)",
            "血肉工厂 (Flesh Factory)",
            "斩杀线 (The Kill Line)"
        ];
    }

    getCurrentSceneName() {
        return this.sceneNames[this.currentSceneIndex];
    }

    nextScene() {
        if (this.currentSceneIndex < this.sceneNames.length - 1) {
            this.currentSceneIndex++;
            return true;
        }
        return false;
    }
}
