/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
const log = console.log;
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createCamera } from '../threejs_iii/camera.js';
import { createLight } from '../threejs_iii/lights.js';
import { createScene } from '../threejs_iii/scene.js';
import { createRenderer } from '../threejs_iii/renderer.js';
import { createControls } from '../threejs_iii/controls.js'

import { Resizer } from '../threejs_iii/Resizer.js';
import { Loop } from '../threejs_iii/Loop.js';
import { glbLoad } from './objs.js';

/** Global variabes */
export var camera;
export let renderer;
export let scene;
export let loop;
export let gui;
export let controls;

/**textures */

class III_SPACE
{
    /**
     * 
     * @param {DOMElement} container - where space will be render.
     */
    constructor(container) 
    {
        camera = createCamera(0.1,3.18,8.36);
        renderer = createRenderer();
        scene = createScene();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);
        controls = createControls(camera, renderer.domElement);
        loop.add(controls);
        // loop.add(camera);
        controls.target.set( 0,3,0 );

        
        this.lights();
        const n = 5;
        this.createObjects();

        const resizer = new Resizer(container, camera, renderer);
    }

    lights()
    {
        // const ambientLight = createLight();
        // const pointLight = createLight('point');
        // pointLight.position.z = 15;
        // scene.add(ambientLight, pointLight);
        const lig = createLight('directional',25);
        lig.position.set(0, 20, 0);
        scene.add(lig);

        const l = createLight('point',100)
        l.position.set(5, 8, 5);
        scene.add(l);
    }

    createObjects(n=0, v=new THREE.Vector3(0,0,0))
    {
        const grid = new THREE.GridHelper(90, 90,0x00ff00,0xff0000);
        scene.add(grid); 
        glbLoad(scene, loop, n, v);
    }
    
    addObject(obj)
    {
        loop.add(obj);
        scene.add(obj);
    }

    render() 
    {
        renderer.render(scene, camera);
    }
    
    start()
    {
        loop.start();
    }
    
    stop()
    {
        loop.stop();
    }

    #cameraCut()
    {
        camera.position.set(1,2,3);

        camera.rotation.set(0.5, 0, 0);
    }

    // #cameraTransition()
    // {
    //     controls.enabled = false;
    //     controls.saveState();

    //     controls.reset();
    // }
}
export {III_SPACE};