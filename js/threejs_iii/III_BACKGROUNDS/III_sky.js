import * as THREE from 'three';

let urls = [
    './textures/dawnmountain-xpos.png',
    './textures/dawnmountain-xneg.png',
    './textures/dawnmountain-ypos.png',
    './textures/dawnmountain-yneg.png',
    './textures/dawnmountain-zpos.png',
    './textures/dawnmountain-zneg.png'
]

export default function sky()
{
    // SKYBOX
    var skyGeometry = new THREE.BoxGeometry( 100, 100, 100 );	
    
    // var urls = [a,aa,aaa,aaaa,aaaaa,aaaaaa];
    var materialArray = [];
    const loader_ = new THREE.TextureLoader();
    urls.forEach((url) =>
    {
        materialArray.push( new THREE.MeshBasicMaterial({
            map: loader_.load(url),
            side: THREE.BackSide
        }));
    });
        
    // var skyMaterial = new THREE.CubeTextureLoader ( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, materialArray );
    return skyBox;
}