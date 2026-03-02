import { PlayerManager } from '../PlayerManager.js';
import { EventManager } from '../EventManager.js';
import { SceneManager } from '../SceneManager.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Initialize Managers
        this.playerManager = new PlayerManager(this.events);
        this.events.on('EQUIPMENT_CHANGED', this.updateHandTexture, this);
        this.sceneMgr = new SceneManager();
        this.eventMgr = new EventManager(this.playerManager, this.handleEvent.bind(this));

        // 1. Background Layer (Infinite Scrolling)
        const bgScale = Math.max(width / 512, height / 512); // Assuming 512x512 textures

        // Move the background up slightly so the sky/city is at the top
        this.bg = this.add.tileSprite(width / 2, height * 0.35, width / bgScale, height / bgScale, 'bg_city');
        this.bg.setScale(bgScale);

        // 1.5 Pseudo-3D Ground using Phaser 3 Plane
        // We ensure the plane is in front of the background
        this.ground = this.add.plane(width / 2, height, 'ground_1');
        this.ground.setDepth(10);

        // Rotate X to lean backward, showing perspective
        this.ground.modelRotation.x = Phaser.Math.DegToRad(-85);
        this.ground.viewPosition.z = 2.4;
        this.ground.viewPosition.y = 1.0;
        this.ground.scaleY = 2; // Stretch it a bit to ensure it reaches the bottom of the screen

        // Give player a tuning panel for perfect adjustment
        this.initGroundDebugger(width, height);

        // 2. Entity Layer (Monsters/Events)
        this.entityGroup = this.add.group();

        // Launch UIScene in parallel
        this.scene.launch('UIScene', { player: this.playerManager });

        // Game State
        this.gameState = 'WALKING';
        this.scrollSpeed = 2; // Pixel speed for TileSprite
        this.eventTimer = 0;
    }

    update(time, delta) {
        if (this.gameState === 'WALKING') {
            // Scroll background downwards to simulate moving forward
            const timeDelta = delta / 16;
            this.bg.tilePositionY -= this.scrollSpeed * timeDelta;

            // Scroll the ground plane UV to move forward continuously
            if (this.ground.uvScroll) {
                // Adjusting the V coordinate simulates running over the ground
                this.ground.uvScroll(0, -this.scrollSpeed * 0.005 * timeDelta);
            } else if (this.ground.panZ) {
                // Fallback spatial movement
                this.ground.panZ(this.scrollSpeed * 0.05 * timeDelta);
            }

            // Trigger events
            this.eventTimer += delta;
            if (this.eventTimer > 4000) { // Every 4 seconds for testing
                this.triggerRandomEvent();
                this.eventTimer = 0;
            }
        }
    }

    triggerRandomEvent() {
        this.gameState = 'PAUSED';
        const event = this.eventMgr.getRandomEvent(this.sceneMgr.currentSceneIndex);

        // Spawn Entity Sprite if it's a combat or has an image (Mockup)
        if (event.type === 'combat_trigger') {
            let enemyKey = 'enemy_monster';
            if (event.title.includes('Kid')) enemyKey = 'enemy_kid';
            if (event.title.includes('Slime')) enemyKey = 'enemy_slime';
            if (event.title.includes('Mech')) enemyKey = 'enemy_mech';
            if (event.image === 'enemy_BigMouse') enemyKey = 'enemy_BigMouse';

            let enemy = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 50, enemyKey);
            enemy.setScale(0);
            this.tweens.add({ targets: enemy, scale: 2, duration: 500, ease: 'Back.easeOut' });
            this.currentEnemy = enemy;
        }

        // Tell UIScene to show the card
        this.events.emit('SHOW_EVENT', event);
    }

    handleEvent(action, event) {
        // Called by UIScene when a button is clicked
        const uiScene = this.scene.get('UIScene');

        if (action === 'attack') {
            uiScene.logMessage('Attacked for 20 damage!');
            this.endEvent();
        } else if (action === 'flee') {
            uiScene.logMessage('Fled successfully!');
            this.endEvent();
        } else if (typeof action === 'number') {
            // Narrative choice
            const result = this.eventMgr.executeChoice(event, action);
            uiScene.logMessage(result);
            this.endEvent();
        }
    }

    endEvent() {
        if (this.currentEnemy) {
            this.currentEnemy.destroy();
            this.currentEnemy = null;
        }
        this.events.emit('HIDE_EVENT');
        this.gameState = 'WALKING';
    }

    updateHandTexture(equipment) {
        // Placeholder for player hand sprite updates
        // e.g. this.leftHand.setTexture(equipment.leftHandTexture);
    }

    initGroundDebugger(width, height) {
        if (!window.Tweakpane) return;

        if (window.groundPane) {
            window.groundPane.dispose();
        }

        const pane = new window.Tweakpane.Pane({ title: 'Ground 3D Tuning' });
        window.groundPane = pane;

        // Ensure we don't pass undefined to Tweakpane which causes the Object error
        const viewY = this.ground.viewPosition ? this.ground.viewPosition.y : 0.5;
        const viewZ = this.ground.viewPosition ? this.ground.viewPosition.z : 2.4;
        const sX = this.ground.scaleX !== undefined ? this.ground.scaleX : 1;
        const sY = this.ground.scaleY !== undefined ? this.ground.scaleY : 1;

        const PARAMS = {
            x: this.ground.x || width / 2,
            y: this.ground.y || height,
            scaleX: sX,
            scaleY: sY,
            rotX: -85,
            camY: viewY,
            camZ: viewZ,
            speed: this.scrollSpeed || 2
        };

        const fGeo = pane.addFolder({ title: 'Plane Position & Scale' });
        fGeo.addInput(PARAMS, 'x', { min: -width, max: width * 2 }).on('change', ev => this.ground.x = ev.value);
        fGeo.addInput(PARAMS, 'y', { min: 0, max: height * 2 }).on('change', ev => this.ground.y = ev.value);
        fGeo.addInput(PARAMS, 'scaleX', { min: 0.1, max: 5 }).on('change', ev => this.ground.scaleX = ev.value);
        fGeo.addInput(PARAMS, 'scaleY', { min: 0.1, max: 5 }).on('change', ev => this.ground.scaleY = ev.value);

        const fCam = pane.addFolder({ title: 'Camera & Rotation' });
        fCam.addInput(PARAMS, 'rotX', { min: -180, max: 0 }).on('change', ev => {
            this.ground.modelRotation.x = Phaser.Math.DegToRad(ev.value);
        });
        fCam.addInput(PARAMS, 'camY', { min: -5, max: 5, label: 'Camera Y' }).on('change', ev => {
            if (this.ground.viewPosition) this.ground.viewPosition.y = ev.value;
        });
        fCam.addInput(PARAMS, 'camZ', { min: 0.1, max: 10, label: 'Camera Z' }).on('change', ev => {
            if (this.ground.viewPosition) this.ground.viewPosition.z = ev.value;
        });

        const fGame = pane.addFolder({ title: 'Speed' });
        fGame.addInput(PARAMS, 'speed', { min: 0, max: 15 }).on('change', ev => this.scrollSpeed = ev.value);
    }
}
