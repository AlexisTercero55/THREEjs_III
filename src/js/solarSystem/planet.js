import * as THREE from 'three';

/**
 * Planet.orbit is added to the scene.
 */
export class Planet
{
    constructor(size,
                texture, 
                position,
                speed_r,//speed for rotation
                speed_t, //speed for traslation
                ring=null
                )
    {
        this.speed_r = speed_r;
        this.speed_t = speed_t;

        const textureLoader = new THREE.TextureLoader();
        const geo = new THREE.SphereGeometry(size, 30, 30);
        const mat = new THREE.MeshStandardMaterial({
                            map: textureLoader.load(texture)
                        });
        this.planet = new THREE.Mesh(geo, mat);

        //for defining planet traslation (emulates sun).
        this.orbit = new THREE.Object3D();
        this.orbit.add(this.planet);
        if(ring) 
        {
            const ringGeo = new THREE.RingGeometry(
                                ring.innerRadius,
                                ring.outerRadius,
                                32);
            const ringMat = new THREE.MeshBasicMaterial({
                                map: textureLoader.load(ring.texture),
                                side: THREE.DoubleSide
                            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            this.orbit.add(ringMesh);
            ringMesh.position.x = position;
            ringMesh.rotation.x = -0.5 * Math.PI;
        }

        this.planet.position.x = position;
    }

    nextFrame(delta)
    {
        this.planet.rotateY(this.speed_r);
        this.orbit.rotateY(this.speed_t);
    }
        
}