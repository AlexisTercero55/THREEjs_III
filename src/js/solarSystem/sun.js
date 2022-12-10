import * as THREE from 'three';

/**textures */
import sunTexture from '../img/sun.jpg';

export function Sun()
{
    const textureLoader = new THREE.TextureLoader();
    const sunGeo = new THREE.SphereGeometry(16, 30, 30);
    const sunMat = new THREE.MeshBasicMaterial({
        map: textureLoader.load(sunTexture)
    });
    const sun =  new THREE.Mesh(sunGeo, sunMat);

    sun.nextFrame = (delta) =>
    {
        sun.rotateY(0.004);
    }

    return sun;
}