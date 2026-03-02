export class PlayerManager {
    constructor(sceneEvents) {
        this.sceneEvents = sceneEvents;
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
        if (this.sceneEvents) {
            this.sceneEvents.emit('EQUIPMENT_CHANGED', itemId);
        }
    }


}
