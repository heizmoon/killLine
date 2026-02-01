import * as THREE from 'three';

export class World {
    constructor(scene) {
        this.scene = scene;
        this.segments = [];
        this.currentScroll = 0;

        // Load Textures
        const loader = new THREE.TextureLoader();
        // Use NearestFilter for pixel art look
        const loadTex = (path) => {
            const t = loader.load(path);
            t.magFilter = THREE.NearestFilter;
            t.minFilter = THREE.NearestFilter;
            t.wrapS = THREE.RepeatWrapping;
            t.wrapT = THREE.RepeatWrapping;
            return t;
        };

        this.textures = {
            city: loadTex('env_city_night_pixel_1769172471960.png'),
            sewer: loadTex('env_sewer_wall_pixel_1769172495452.png'),
            factory: loadTex('env_city_night_pixel_1769172471960.png') // Reuse city or generic for now if factory texture missing, or use sewer
        };

        // Materials
        this.mats = {
            floor: new THREE.MeshStandardMaterial({ map: this.textures.city }),
            wall: new THREE.MeshStandardMaterial({ map: this.textures.city })
        };

        // Initial segments (City)
        for (let i = 0; i < 15; i++) {
            this.spawnSegment(i * -20);
        }

        // The Kill Line (Visual only)
        this.initTheLine();
    }

    initTheLine() {
        const geometry = new THREE.PlaneGeometry(500, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0
        });
        this.theLine = new THREE.Mesh(geometry, material);
        this.theLine.position.set(0, 20, -100);
        this.scene.add(this.theLine);
    }

    spawnSegment(zPos) {
        // Floor
        const geo = new THREE.PlaneGeometry(20, 20); // Wider floor
        const floor = new THREE.Mesh(geo, this.mats.floor.clone()); // Clone to allow individual texture swarm if needed, or shared
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(0, 0, zPos);

        // Walls
        const wallGeo = new THREE.PlaneGeometry(20, 15); // Taller walls
        const leftWall = new THREE.Mesh(wallGeo, this.mats.wall.clone());
        leftWall.position.set(-10, 7.5, zPos);
        leftWall.rotation.y = Math.PI / 2;

        const rightWall = new THREE.Mesh(wallGeo, this.mats.wall.clone());
        rightWall.position.set(10, 7.5, zPos);
        rightWall.rotation.y = -Math.PI / 2;

        const segment = { floor, leftWall, rightWall, z: zPos };
        this.scene.add(floor);
        this.scene.add(leftWall);
        this.scene.add(rightWall);
        this.segments.push(segment);
    }

    moveWorld(amount, sceneIndex = 0) {
        // Decide texture based on scene
        let targetTex = this.textures.city;
        if (sceneIndex === 1) targetTex = this.textures.sewer;
        if (sceneIndex >= 2) targetTex = this.textures.sewer; // Factory darker

        // Move segments
        this.segments.forEach(seg => {
            seg.z += amount;
            seg.floor.position.z = seg.z;
            seg.leftWall.position.z = seg.z;
            seg.rightWall.position.z = seg.z;
        });

        // Recycle
        if (this.segments[0].z > 15) {
            const oldSeg = this.segments.shift();
            const lastZ = this.segments[this.segments.length - 1].z;
            const newZ = lastZ - 20;

            oldSeg.z = newZ;
            oldSeg.floor.position.z = newZ;
            oldSeg.leftWall.position.z = newZ;
            oldSeg.rightWall.position.z = newZ;

            // Texture Update (Pseudo fog transition)
            oldSeg.floor.material.map = targetTex;
            oldSeg.leftWall.material.map = targetTex;
            oldSeg.rightWall.material.map = targetTex;
            oldSeg.floor.material.needsUpdate = true;

            this.segments.push(oldSeg);
        }
    }

    // No legacy enemy checks anymore
}
