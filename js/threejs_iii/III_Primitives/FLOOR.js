import * as  THREE from 'three';
export default function floor()
{
    // FLOOR
    let tiles = './textures/tiles.jpg';
    var floorTexture = new THREE.TextureLoader().load(tiles);
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
    floorTexture.repeat.set( 10, 10 );
    var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    // floor.position.y = -50.5;
    floor.rotateX(-Math.PI / 2);
    // scene.add(floor);
    return floor;
}