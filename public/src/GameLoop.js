import * as THREE from 'three';

import { EndingManager } from './EndingManager.js';

export class GameLoop {
    constructor(playerManager, world, eventManager, sceneManager, persistenceManager, ui) {
        this.player = playerManager;
        this.world = world;
        this.eventManager = eventManager;
        this.sceneManager = sceneManager;
        this.endingManager = new EndingManager(); // Internal init
        this.persistence = persistenceManager;
        this.ui = ui; // Object with showEventModal etc.

        this.state = 'PAUSED'; // INTRO, WALKING, EVENT, COMBAT
        this.distanceTraveled = 0;
        this.eventTimer = 0;
        this.eventInterval = 5.0; // Seconds between events for testing
    }

    start() {
        this.state = 'WALKING';
        this.sceneManager.start();

        // Initial Items
        if (!this.player.hasItem('burger')) {
            this.player.addItem('burger');
        }
    }

    update(delta) {
        if (this.state === 'PAUSED') return;

        // Visuals
        this.player.updateHandBob(Date.now() / 200);

        if (this.state === 'WALKING') {
            const speed = 10;
            this.distanceTraveled += speed * delta;
            this.world.moveWorld(speed * delta);

            // Event Checks
            this.eventTimer += delta;
            if (this.eventTimer > this.eventInterval) {
                this.triggerEvent();
                this.eventTimer = 0;
            }
        }
    }

    triggerEvent() {
        this.state = 'EVENT';
        // Fix: Pass current scene index to get relevant events
        const event = this.eventManager.getRandomEvent(this.sceneManager.currentSceneIndex);

        if (event.type === 'combat_trigger') {
            // Combat Logic
            this.ui.showCombatUI(event, (action) => {
                if (action === 'attack') {
                    // Calc damage
                    const dmg = this.player.equipment.rightHand === 'sword' ? 20 : 5;
                    this.ui.log(`你造成了 ${dmg} 点伤害。`);

                    if (event.isBoss) {
                        // Win! -> Streamer Ending usually
                        this.endingManager.trigger(this.player, 'WIN');
                        this.state = 'PAUSED';
                        this.ui.hideModal();
                        return;
                    }

                    this.state = 'WALKING'; // Win immediately
                    this.ui.hideModal();
                } else if (action === 'flee') {
                    if (Math.random() > 0.5) {
                        this.ui.log('逃跑成功！');
                        this.state = 'WALKING';
                    } else {
                        // DEATH
                        this.player.takeDamage(100); // Fatal
                        this.ui.log('逃跑失败...被吞噬。');
                        this.endingManager.trigger(this.player, 'DIE');
                        this.state = 'PAUSED';
                    }
                    this.ui.hideModal();
                }
            });
        } else {
            // Narrative Event
            this.ui.showEventModal(event, (choiceIndex) => {
                const result = this.eventManager.executeChoice(event, choiceIndex);
                this.ui.log(result);

                // Record Progress
                this.persistence.recordRun(this.sceneManager.sceneNames[this.sceneManager.currentSceneIndex], 'X', false);

                // Advance Scene Logic
                this.eventsCompletedInScene = (this.eventsCompletedInScene || 0) + 1;
                if (this.eventsCompletedInScene >= 2) { // 2 Events per scene for pacing
                    this.sceneManager.nextScene();
                    this.eventsCompletedInScene = 0;
                }

                this.state = 'WALKING';
                this.ui.hideModal();
            });
        }
    }
}
