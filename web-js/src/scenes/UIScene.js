export class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: false });
    }

    init(data) {
        this.player = data.player;
    }

    create() {
        const { width, height } = this.cameras.main;

        // 1. Bottom Frame UI
        this.bottomFrame = this.add.image(width / 2, height, 'bottom_frame');
        this.bottomFrame.setOrigin(0.5, 1);

        // Scale to fit width, but keep aspect ratio
        const scale = width / this.bottomFrame.width;
        this.bottomFrame.setScale(scale);

        // 2. Info Button
        this.infoButton = this.add.image(width - 40 * scale, height - 120 * scale, 'info_button');
        this.infoButton.setOrigin(0.5, 0.5);
        this.infoButton.setScale(scale * 1.5);
        this.infoButton.setInteractive({ useHandCursor: true });
        this.infoButton.on('pointerdown', () => {
            this.logMessage("You clicked the Info / Quest Log button!");
        });

        // 3. Hand Layer (Moved to UIScene to render above everything)
        let initialRightHand = 'right_hand_0';
        if (this.player.equipment && this.player.equipment.rightHand === 'sword') initialRightHand = 'hand_sword';
        if (this.player.equipment && this.player.equipment.rightHand === 'lighter') initialRightHand = 'hand_lighter';

        this.leftHand = this.add.sprite(75, 548, 'left_hand_0');
        this.leftHand.setOrigin(0.5, 1);

        this.rightHand = this.add.sprite(369, 548, initialRightHand);
        this.rightHand.setOrigin(0.5, 1);

        this.tweens.add({
            targets: [this.leftHand, this.rightHand],
            y: 548 + 5, // Just bob down slightly from new anchor
            duration: 1500,
            yoyo: true,
            ease: 'Sine.easeInOut',
            repeat: -1
        });

        // 4. HP/Sanity Text (Replacing old bars with simple text on top of bottomFrame for now)
        this.hpText = this.add.text(width / 2 - 80 * scale, height - 120 * scale, 'HP: 100', {
            fontFamily: 'Courier', fontSize: `${20 * scale}px`, color: '#ffaaaa', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);

        // 5. Log Messages
        this.logText = this.add.text(20, height - 150, '', {
            fontFamily: 'Courier', fontSize: '14px', color: '#ffffff', stroke: '#000', strokeThickness: 3
        });

        // 6. Listeners from GameScene
        const gameScene = this.scene.get('GameScene');
        gameScene.events.on('SHOW_EVENT', this.showEventCard, this);
        gameScene.events.on('HIDE_EVENT', this.hideEventCard, this);
        gameScene.events.on('EQUIPMENT_CHANGED', this.updateHandTexture, this);

        // Container for Event Modal
        this.modalContainer = this.add.container(width / 2, height / 2);
        this.modalContainer.setVisible(false);

        // 7. Initialize Native Drag & Drop Debugger
        this.initNativeDebugger();
    }

    initNativeDebugger() {
        // Create an on-screen text display for coordinates
        const debugText = this.add.text(10, 10, 'DRAG ELEMENTS TO MOVE\nCoordinates will appear here.', {
            fontFamily: 'Courier', fontSize: '14px', color: '#00ff00', backgroundColor: '#000000dd', padding: { x: 10, y: 10 }
        });
        debugText.setDepth(1000); // Always on top

        // Make elements draggable
        const makeDraggable = (gameObject, name) => {
            gameObject.setInteractive({ cursor: 'move', draggable: true });
            this.input.setDraggable(gameObject);
        };

        makeDraggable(this.infoButton, 'infoButton');
        makeDraggable(this.bottomFrame, 'bottomFrame');
        makeDraggable(this.leftHand, 'leftHand');
        makeDraggable(this.rightHand, 'rightHand');

        this.input.on('dragstart', (pointer, gameObject) => {
            // Kill tween so an object (like the hands) isn't forced back to bottom while dragging
            this.tweens.killTweensOf(gameObject);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            debugText.setText(
                `-- DEBUG MODE --\n` +
                `Info Button: X:${Math.round(this.infoButton.x)} Y:${Math.round(this.infoButton.y)}\n` +
                `Bottom Frame: X:${Math.round(this.bottomFrame.x)} Y:${Math.round(this.bottomFrame.y)}\n` +
                `Left Hand: X:${Math.round(this.leftHand.x)} Y:${Math.round(this.leftHand.y)}\n` +
                `Right Hand: X:${Math.round(this.rightHand.x)} Y:${Math.round(this.rightHand.y)}`
            );
        });
    }

    update() {
        if (!this.player) return;

        // Update Text
        this.hpText.setText(`HP: ${this.player.hp}/${this.player.getMaxHp()}`);
    }

    updateHandTexture(itemId) {
        let key = 'right_hand_0';
        if (itemId === 'lighter') key = 'hand_lighter';
        if (itemId === 'sword') key = 'hand_sword';
        if (this.rightHand) {
            this.rightHand.setTexture(key);
        }
    }

    logMessage(msg) {
        this.logText.setText(msg);
        this.tweens.add({
            targets: this.logText,
            alpha: 0,
            delay: 2000,
            duration: 1000,
            onComplete: () => this.logText.setAlpha(1).setText('')
        });
    }

    showEventCard(event) {
        this.modalContainer.removeAll(true);
        this.modalContainer.setVisible(true);

        // Background Glass/Parchment
        const bg = this.add.graphics();
        bg.lineStyle(6, 0x000000, 1);
        bg.fillStyle(0xddccaa, 1); // Parchment color
        bg.fillRoundedRect(-180, -200, 360, 400, 16);
        bg.strokeRoundedRect(-180, -200, 360, 400, 16);
        this.modalContainer.add(bg);

        // Title Banner (Red with Black stroke)
        const banner = this.add.graphics();
        banner.lineStyle(4, 0x000000, 1);
        banner.fillStyle(0xcc4444, 1);
        banner.fillRect(-190, -180, 380, 50);
        banner.strokeRect(-190, -180, 380, 50);
        this.modalContainer.add(banner);

        // Outline Event Title
        const title = this.add.text(0, -155, event.title, {
            fontFamily: 'Courier', fontSize: '24px', color: '#ffffff', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5);
        this.modalContainer.add(title);

        // Description
        const desc = this.add.text(0, -80, event.description, {
            fontFamily: 'sans-serif', fontSize: '18px', color: '#000000', wordWrap: { width: 320 }, align: 'center'
        }).setOrigin(0.5);
        this.modalContainer.add(desc);

        // Buttons
        if (event.type === 'combat_trigger') {
            this.createButton(0, 50, 'ATTACK [ 攻击 ]', () => this.scene.get('GameScene').handleEvent('attack', event));
            this.createButton(0, 120, 'FLEE   [ 逃跑 ]', () => this.scene.get('GameScene').handleEvent('flee', event));
        } else {
            event.choices.forEach((choice, idx) => {
                this.createButton(0, 20 + idx * 70, choice.text, () => {
                    this.scene.get('GameScene').handleEvent(idx, event);
                });
            });
        }

        // Pop in animation
        this.modalContainer.setScale(0);
        this.tweens.add({ targets: this.modalContainer, scale: 1, duration: 400, ease: 'Back.easeOut' });
    }

    createButton(x, y, textStr, callback) {
        const btnBg = this.add.graphics();
        btnBg.lineStyle(4, 0x000000, 1);
        btnBg.fillStyle(0x44cc44, 1); // Green Pick button
        btnBg.fillRoundedRect(x - 140, y - 25, 280, 50, 8);
        btnBg.strokeRoundedRect(x - 140, y - 25, 280, 50, 8);

        const txt = this.add.text(x, y, textStr, {
            fontFamily: 'Courier', fontSize: '20px', color: '#ffffff', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        // Invisible hit area
        const hitArea = this.add.zone(x, y, 280, 50).setInteractive({ useHandCursor: true });
        hitArea.on('pointerdown', callback);

        this.modalContainer.add([btnBg, txt, hitArea]);
    }

    hideEventCard() {
        this.tweens.add({
            targets: this.modalContainer,
            scale: 0,
            duration: 200,
            onComplete: () => this.modalContainer.setVisible(false)
        });
    }
}
