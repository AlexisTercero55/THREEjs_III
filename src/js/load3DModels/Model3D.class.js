/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Model3D
{
    constructor()
    {
        const loader = new GLTFLoader();
        let mixer, model, clips;
        loader.load(_path, (glft) => 
        {
            model = glft.scene;
            mixer = new THREE.AnimationAction(model);
            clips = glft.animations;

        }, undefined, (err) => {console.log(err);}
        );
        this.obj = model;
    }

    nextFrame = (delta) => 
    {
        mixer.update(delta);
    };
}