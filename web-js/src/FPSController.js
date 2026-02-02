import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class FPSController {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        this.controls = new PointerLockControls(camera, domElement);
        
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.canJump = false;

        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        this.initListeners();
    }

    initListeners() {
        const onKeyDown = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = true;
                    break;
                // case 'Space':
                //     if ( this.canJump === true ) this.velocity.y += 350;
                //     this.canJump = false;
                //     break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = false;
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        
        // Click to start
        const startScreen = document.getElementById('start-screen');
        startScreen.addEventListener('click', () => {
            this.controls.lock();
        });

        this.controls.addEventListener('lock', () => {
            startScreen.style.display = 'none';
        });

        this.controls.addEventListener('unlock', () => {
            startScreen.style.display = 'flex';
        });
    }

    update(delta) {
        if (!this.controls.isLocked) return;

        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;
        // this.velocity.y -= 9.8 * 100.0 * delta; // Mass = 100.0

        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize(); // this ensures consistent movements in all directions

        if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * 400.0 * delta;
        if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 400.0 * delta;

        this.controls.moveRight(-this.velocity.x * delta);
        this.controls.moveForward(-this.velocity.z * delta);
    }

    // Get Pitch (looking up/down angle) in RADIANS. 
    // Positive = looking down (usually), Negative = looking up.
    // Three.js rotation.x: 0 is level. -Math.PI/2 is straight up.
    getCameraPitch() {
        return this.camera.rotation.x;
    }
}
