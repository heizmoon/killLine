import { eventsList } from './EventData.js';

export class EventManager {
    constructor(player) {
        this.player = player;
        this.events = eventsList;
    }

    getRandomEvent(sceneIndex = 0) {
        let pool = [];
        if (sceneIndex === 0) {
            if (this.player.visionValue > 0) {
                // Already awakened, don't show kid again.
                pool = this.events.filter(e => e.id === 'trash_can');
            } else {
                pool = this.events.filter(e => e.id === 'beggar_kid_squitch' || e.id === 'trash_can');
            }
        } else if (sceneIndex === 1) {
            pool = this.events.filter(e => e.id === 'sewer_slime' || e.id === 'sugar_apple_hanging' || e.id === 'big_mouse');
        } else if (sceneIndex >= 2) {
            pool = this.events.filter(e => e.id === 'corpse_gundam');
        }

        if (pool.length === 0) return this.events[0];
        return pool[Math.floor(Math.random() * pool.length)];
    }

    executeChoice(event, choiceIndex) {
        if (!event.choices || !event.choices[choiceIndex]) return "什么也没发生。";
        const choice = event.choices[choiceIndex];
        const resultText = choice.outcome(this.player);
        return resultText;
    }
}
