export class Player {
    constructor() {
        // Stats
        this.hp = 100;
        this.maxHp = 100;
        this.atk = 10;
        this.sanity = 100;
        this.visionLevel = 0; // 0 or 1
        this.isDead = false;
    }

    toggleVision() {
        this.visionLevel = this.visionLevel === 0 ? 1 : 0;
        // Trigger UI update externally or event
        return this.visionLevel;
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        if (this.hp <= 0) this.isDead = true;
    }

    updateHeightCheck(height, delta) {
        // Kill Line Logic
        if (this.visionLevel === 1) {
            // "High Ground" logic or just random Sanity drain
            // For MVP: Simple drain constant
            this.sanity -= 2 * delta;

            // If height > 5 (Slope), massive drain
            if (height > 5) {
                this.sanity -= 20 * delta;
                this.hp -= 10 * delta; // Physical cuts
            }

            if (this.sanity < 0) {
                this.sanity = 0;
                this.hp -= 5 * delta;
            }
        } else {
            this.sanity += 5 * delta;
            if (this.sanity > 100) this.sanity = 100;
        }
    }
}
