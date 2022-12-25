/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as THREE from 'three';
// import { GUI } from 'dat.gui';

import { createCamera } from '../threejs_iii/camera.js';
import { createLight } from '../threejs_iii/lights.js';
import { createScene } from '../threejs_iii/scene.js';
import { createRenderer } from '../threejs_iii/renderer.js';
import { createControls } from '../threejs_iii/controls.js'

import { Resizer } from '../threejs_iii/Resizer.js';
import { Loop } from '../threejs_iii/Loop.js';

/** Global variabes */
export let camera;
export let renderer;
export let scene;
export let loop;
//TODO make function to create custom GUI objects | III update: createGUI() -> GUI
// export const gui = new GUI();
export let controls;

// textures
import img1 from './Grassy_Squares.jpg';
import img2 from './displacementmap.png';
import { MOUSE } from 'three';


export class III_DISPLACEMTMPAS
{
    /**
     * 
     * @param {DOMElement} container - where space will be render.
     */
    constructor(container) 
    {
        camera = createCamera({x:3,y:1.2,z:3});
        renderer = createRenderer();
        scene = createScene();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);
        controls = createControls(camera, renderer.domElement);
        loop.add(controls);
        camera.lookAt(scene.position);
        
        this.lights();

        this.createObjects();
        const resizer = new Resizer(container, camera, renderer);
    }

    lights()
    {
        const ambientLight = createLight('ambient',1);
        const pointLight = createLight('point',1);
        pointLight.color.setHex(0x0000FF);
        pointLight.position.set(0,1,0);
        ambientLight.position.set(15,15,15)

        var de = 0;
        pointLight.nextFrame = (delta) =>
        {
            pointLight.intensity = 6* Math.abs(Math.sin(de)) + 0.8;
            de += 0.02;
        }
        loop.add(pointLight);

        scene.add(ambientLight, pointLight);

        // const d = gui.addFolder('awa');
        // const a = gui.addFolder('awu');
        // const f = gui.addFolder('light');
        // f.open();
        // f.add(pointLight.position, 'x',0,3,0.01);
        // f.add(pointLight.position, 'y',0,3,0.01);
        // f.add(pointLight.position, 'z',0,3,0.01);
        // f.add(pointLight,'intensity',1,100,0.01).name('intensity');
        // f.close();
    }

    createObjects()
    {  
        /**textures */
        const loader = new THREE.TextureLoader();
        const texture = loader.load(img1);
        const dismap = loader.load(img2);
        //TODO make function to create custom planes | III update: createPlane() -> THREE.Mesh
        const planeG = new THREE.PlaneGeometry(3,3,64,64);
        const planeM = new THREE.MeshStandardMaterial({ color: 0xFFFFFF,
                                                        // map:texture,
                                                        side: THREE.DoubleSide,
                                                        displacementMap:dismap,
                                                        transparent:true,
                                                        alphaMap:dismap,
                                                        depthTest:false
                                                });

        const plane = new THREE.Mesh(planeG, planeM);
        plane.rotateX(-Math.PI/2);
        
        let mouseY = 1000;
        document.addEventListener("mousemove",(e) =>{
            mouseY = e.clientY + 50;
        })
        var s = 0;
        plane.nextFrame = (delta) => 
        {
            plane.material.displacementScale = Math.sin(s);//mouseY *0.0013 ;
            s+=0.02;
            plane.rotation.z += 0.003;
        }
        scene.add(plane);
        loop.add(plane);
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