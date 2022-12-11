/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */

export class Sun
{
    constructor()
    {   
        const textureLoader = new THREE.TextureLoader();
        const sunGeo = new THREE.SphereGeometry(16, 30, 30);
        const sunMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(sunTexture)
        });
        this.sun =  new THREE.Mesh(sunGeo, sunMat);
    }

    nextFrame = (delta) =>
    {
        sun.rotateY(0.004);
    }
}