/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 * 
 * 
 * 
 */
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import III_SPACE from "../threejs_iii/III_Space";

export default class III_Floats extends III_SPACE
{
    constructor(container,{
        SceneRotation=false,
        POV={x:0,y:0,z:10},
    }={}){
        super(container,{
            SceneRotation,
            POV,
        });

        // this.controlsLookAt(new THREE.Vector3(0,3,0));
    }

    createObjects()
    {
        this.addObject(new THREE.GridHelper(32,32).rotateX(Math.PI/2));
        this.axis();

        const loader = new FontLoader(); 

        // loader.loadAsync

        loader.load('./fonts/helvetiker_regular.typeface.json',  font =>  {

            const geometry = new TextGeometry( '2^3', {
                font: font,
                size: 1,
                height: 0.1,
                curveSegments: 24,
                // bevelEnabled: true,
                // bevelThickness: 1,
                // bevelSize: 8,
                // bevelOffset: 0,
                // bevelSegments: 5
            } );
            var textsMaterial = new THREE.MeshBasicMaterial({color: 0xeeeeee});
            var text = new THREE.Mesh(geometry, textsMaterial);

            // text.rotation.x = -Math.PI/2;
            let s=0.3;
            text.scale.set(s,s,s);
            text.position.set(0.2,0.2,0);

            this.addObject(text)
        } );
    }
}