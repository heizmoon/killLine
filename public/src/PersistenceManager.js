export class PersistenceManager {
    constructor() {
        this.STORAGE_KEY = 'urban_severance_save_v1';
        this.data = this.load();
    }

    load() {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw);
        } else {
            return {
                maxDistance: "None",
                startingSpirit: 0,
                runCount: 0
            };
        }
    }

    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    }

    recordRun(sceneName, eventIndex, reachedEnd) {
        this.data.runCount++;

        // Increase starting spirit lightly for next run (Roguelite element)
        // Cap at some reasonable number, e.g., 50
        if (this.data.startingSpirit < 50) {
            this.data.startingSpirit += 2;
        }

        // Update Max Distance (Simple string comparison isn't great, but sufficient for display MVP)
        // Ideally we'd compare an integer score
        this.data.lastRunDistance = `${sceneName} - Event ${eventIndex}`;

        // For max distance, we really need a numeric score. 
        // Let's assume the calling code provides a score too, or we just overwrite if it looks "longer".
        // For MVP, just saving last run display.

        this.save();
    }

    getStartingSpirit() {
        return this.data.startingSpirit;
    }
}
