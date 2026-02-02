import * as THREE from 'three';

export class PlayerManager {
    constructor(scene) {
        this.scene = scene;

        // Base Stats
        this.baseMaxHp = 100;
        this.hp = 100;
        this.sanity = 100;
        this.atk = 5; // Base punch damage

        // Vision
        this.visionValue = 0; // 0-100 Accumulative

        // Inventory & Equipment
        this.inventory = []; // Strings or Objects: [{id: 'burger', name: 'Burger', type: 'consumable'}]
        this.equipment = {
            rightHand: 'empty', // 'empty', 'lighter', 'sword'
        };

        // DOM Elements for Hands
        this.initHandVisuals();
    }

    initHandVisuals() {
        this.handContainer = document.createElement('div');
        this.handContainer.id = 'player-hands';
        Object.assign(this.handContainer.style, {
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            pointerEvents: 'none',
            backgroundImage: `url('assets/fps_hands_empty_pixel_1769173027916.png')`, // Default empty
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom center',
            transition: 'transform 0.1s linear', // For bobbing
            zIndex: '1000'
        });
        document.body.appendChild(this.handContainer);
    }

    // --- Stats Calculation ---
    getMaxHp() {
        let bonus = 0;
        if (this.hasItem('coat')) bonus += 20;
        return this.baseMaxHp + bonus;
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        return this.hp <= 0;
    }

    heal(amount) {
        this.hp += amount;
        const max = this.getMaxHp();
        if (this.hp > max) this.hp = max;
    }

    // --- Inventory ---
    addItem(itemId) {
        this.inventory.push(itemId);
        // Toast notification could go here

        // Auto-equip check (Simple MVP logic)
        if (itemId === 'lighter' && this.equipment.rightHand === 'empty') {
            this.equip('lighter');
        }
        if (itemId === 'sword') {
            this.equip('sword');
        }
    }

    removeItem(itemId) {
        const idx = this.inventory.indexOf(itemId);
        if (idx > -1) {
            this.inventory.splice(idx, 1);
        }
    }

    hasItem(itemId) {
        return this.inventory.includes(itemId);
    }

    equip(itemId) {
        this.equipment.rightHand = itemId;
        // Switch Sprite
        let url = '';
        if (itemId === 'empty') url = 'assets/fps_hands_empty_pixel_1769173027916.png';
        if (itemId === 'lighter') url = 'assets/fps_hand_lighter_pixel_1769173047441.png';
        if (itemId === 'sword') url = 'assets/fps_hand_sword_pixel_1769172404856.png'; // Using generated one

        if (url) {
            this.handContainer.style.backgroundImage = `url('${url}')`;
        }
    }

    // --- Visuals ---
    updateHandBob(walkTime) {
        // Simple Sine wave for breathing/walking
        const y = Math.sin(walkTime * 10) * 10;
        const x = Math.cos(walkTime * 5) * 5;
        this.handContainer.style.transform = `translateX(-50%) translate(${x}px, ${y}px)`;
    }
}
