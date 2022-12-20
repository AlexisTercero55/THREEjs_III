/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
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
export let camera;
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
        camera = createCamera(15,15,15);
        renderer = createRenderer();
        scene = createScene();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);
        controls = createControls(camera, renderer.domElement);
        loop.add(controls);
        
        this.lights();
        const n = 5;
        this.createObjects(0, new THREE.Vector3(0,0,n));
        this.createObjects(1, new THREE.Vector3(n,0,0));
        this.createObjects(2, new THREE.Vector3(-n,0,0));
        this.createObjects(3, new THREE.Vector3(0,0,-n));
        this.createObjects(5);

        const resizer = new Resizer(container, camera, renderer);
    }

    lights()
    {
        // const ambientLight = createLight();
        // const pointLight = createLight('point');
        // pointLight.position.z = 15;
        // scene.add(ambientLight, pointLight);
        const lig = createLight('directional');
        lig.position.set(10, 10, 100);
        scene.add(lig);

        const l = createLight('point')
        l.position.set(5, 5, 5);
        scene.add(l);
    }

    createObjects(n=0, v=new THREE.Vector3(0,0,0))
    {
        const log = console.log;
        const grid = new THREE.GridHelper(30, 30,0x00ff00,0xff0000);
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

    #cameraTransition()
    {
        controls.enabled = false;
        controls.saveState();

        controls.reset();
    }
}
export {III_SPACE};