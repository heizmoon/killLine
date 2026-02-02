import * as THREE from 'three';
import { PlayerManager } from './PlayerManager.js';
import { World } from './World.js';
import { EventManager } from './EventManager.js';
import { SceneManager } from './SceneManager.js';
import { GameLoop } from './GameLoop.js';
import { IntroManager } from './IntroManager.js';
import { PersistenceManager } from './PersistenceManager.js';

// Setup Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.7, 0);

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0x404040, 2));
const dl = new THREE.DirectionalLight(0xffaa00, 1);
dl.position.set(0, 5, 5);
scene.add(dl);

// Managers
const persistence = new PersistenceManager();
const player = new PlayerManager(scene);
// Apply persistent spirit boost
player.visionValue = persistence.getStartingSpirit();

const world = new World(scene); // Reusing existing World.js logic for now (infinite scroll)
const sceneManager = new SceneManager();

// UI Helper
const uiHelper = {
    log: (msg) => {
        const log = document.getElementById('message-log');
        const p = document.createElement('div');
        p.innerText = msg;
        log.prepend(p);
        if (log.children.length > 5) log.lastChild.remove();
    },
    showEventModal: (event, callback) => {
        // Create Modal HTML
        const modal = document.createElement('div');
        modal.id = 'event-modal';
        Object.assign(modal.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            backgroundColor: '#111',
            border: '2px solid #555',
            padding: '20px',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: '200'
        });

        // Image
        if (event.image) {
            const img = document.createElement('img');
            img.src = event.image;
            img.style.width = '100%';
            img.style.imageRendering = 'pixelated';
            modal.appendChild(img);
        }

        // Title & Desc
        const title = document.createElement('h2');
        title.innerText = event.title;
        modal.appendChild(title);

        const desc = document.createElement('p');
        desc.innerText = event.description;
        modal.appendChild(desc);

        // Choices
        event.choices.forEach((choice, idx) => {
            const btn = document.createElement('button');
            btn.innerText = choice.text;

            // Check reqs
            if (choice.requirement && !player.hasItem(choice.requirement)) {
                btn.disabled = true;
                btn.innerText += " (Missing Item)";
                btn.style.opacity = '0.5';
            }

            btn.onclick = () => callback(idx);
            modal.appendChild(btn);
        });

        document.body.appendChild(modal);
    },
    showCombatUI: (event, callback) => {
        // Simple reuse of logic for MVP
        const modal = document.createElement('div');
        modal.id = 'event-modal'; // Same ID for auto cleanup
        Object.assign(modal.style, {
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '400px', backgroundColor: '#300', border: '2px solid #f00', padding: '20px', color: '#fff'
        });

        modal.innerHTML = `<h2>COMBAT: ${event.title}</h2><p>${event.description}</p>`;
        if (event.image) {
            modal.innerHTML += `<img src="${event.image}" style="width:100%; image-rendering:pixelated; margin-bottom:10px;">`;
        }

        const atkBtn = document.createElement('button');
        atkBtn.innerText = "攻击 (Attack)";
        atkBtn.onclick = () => callback('attack');

        const fleeBtn = document.createElement('button');
        fleeBtn.innerText = "逃跑 (Flee)";
        fleeBtn.onclick = () => callback('flee');

        modal.appendChild(atkBtn);
        modal.appendChild(fleeBtn);
        document.body.appendChild(modal);
    },
    hideModal: () => {
        const m = document.getElementById('event-modal');
        if (m) m.remove();
    }
};

const eventManager = new EventManager(player, uiHelper.showEventModal);
const game = new GameLoop(player, world, eventManager, sceneManager, persistence, uiHelper);

// Entry
const intro = new IntroManager(() => {
    game.start();
});
intro.start();

// Update Loop
function animate() {
    requestAnimationFrame(animate);
    game.update(0.016); // Fixed delta for MVP

    // Render
    renderer.render(scene, camera);

    // UI Updates
    document.getElementById('hp-bar').style.width = `${(player.hp / player.getMaxHp()) * 100}%`;
    document.getElementById('vision-bar').style.width = `${player.visionValue}%`;
}
animate();

// Hide old start screen just in case
document.getElementById('start-screen').style.display = 'none';
