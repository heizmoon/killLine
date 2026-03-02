export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load UI and generic assets
        this.load.image('ground_1', 'assets/ground_1.png');
        this.load.image('bg_city', 'assets/env_city_night_pixel_1769172471960.png');
        this.load.image('bg_sewer', 'assets/env_sewer_wall_pixel_1769172495452.png');

        // Player Hands
        this.load.image('left_hand_0', 'assets/left_hand_0.png');
        this.load.image('right_hand_0', 'assets/right_hand_0.png');
        this.load.image('hand_empty', 'assets/fps_hands_empty_pixel_1769173027916.png');
        this.load.image('hand_sword', 'assets/fps_hand_sword_pixel_1769172404856.png');
        this.load.image('hand_lighter', 'assets/fps_hand_lighter_pixel_1769173047441.png');

        // Enemies
        this.load.image('enemy_monster', 'assets/enemy_monster_pixel_1769172448043.png');
        this.load.image('enemy_slime', 'assets/enemy_slime_pixel_1769176702938.png');
        this.load.image('enemy_kid', 'assets/enemy_halloween_kid_pixel_1769172423750.png');
        this.load.image('enemy_mech', 'assets/enemy_corpse_mech_pixel_1769176726135.png');
        this.load.image('enemy_BigMouse', 'assets/enemy_BigMouse.png');

        // UI
        this.load.image('bottom_frame', 'assets/bottom_frame.png');
        this.load.image('info_button', 'assets/info_button.png');
        this.load.image('item_frame', 'assets/item_frame.png');

        // Items
        this.load.image('item_burger', 'assets/item_burger_pixel_1769173727189.png');
        this.load.image('item_coat', 'assets/item_coat_pixel_1769173744890.png');

        // Loading Bar implementation
        let loadingText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Loading...', {
            font: '20px Courier',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            // Can add a graphic bar here later
        });

        this.load.on('complete', () => {
            loadingText.destroy();
        });
    }

    create() {
        this.scene.start('MenuScene');
    }
}
