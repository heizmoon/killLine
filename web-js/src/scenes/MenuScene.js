export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        let bg = this.add.image(width / 2, height / 2, 'bg_city');
        // Scale to cover the vertical screen
        let scale = Math.max(width / bg.width, height / bg.height);
        bg.setScale(scale).setAlpha(0.5);

        // Title
        this.add.text(width / 2, height * 0.3, 'URBAN SEVERANCE', {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#ff0000',
            stroke: '#330000',
            strokeThickness: 6,
            shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 0, fill: true }
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.4, '都市斩杀线', {
            fontFamily: 'sans-serif',
            fontSize: '24px',
            color: '#ffaaaa',
        }).setOrigin(0.5);

        // Start Prompt
        let startText = this.add.text(width / 2, height * 0.7, 'CLICK TO START', {
            fontFamily: 'Courier',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Blinking effect
        this.tweens.add({
            targets: startText,
            alpha: 0,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Click to start
        this.input.once('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
