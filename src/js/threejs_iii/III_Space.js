/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as THREE from 'three';
import { createCamera } from './camera.js';
import { createLight } from './lights.js';
import { III_SCENE, createScene } from './scene.js';
import { III_WebGL_Renderer, createRenderer } from './renderer.js';
import { III_CONTROLS_, createControls } from './controls.js'

import { Resizer } from './Resizer.js';
import { Loop } from './Loop.js';
import { createCube } from './III_Primitives/cube.js';

/** Global variabes */
export let camera;
export let renderer;
export let scene;
export let loop;
export let gui;
export let controls;

class III_SPACE
{
    /**
     * 
     * @param {Element} CONTAINER - where space will be render.
     */
    constructor(CONTAINER) 
    {
        camera = createCamera({x:6,y:6,z:6});

        renderer = new III_WebGL_Renderer(); //createRenderer();
        scene = new III_SCENE();//createScene();
        loop = new Loop(camera, scene, renderer);
        CONTAINER.append(renderer.domElement);
        controls = new III_CONTROLS_(camera, renderer.domElement);//createControls(camera, renderer.domElement);
        loop.add(controls);
        
        // this.lights();

        this.createObjects();

        const resizer = new Resizer(CONTAINER, camera, renderer);
    }

    lights()
    {
        const ambientLight = createLight();
        const pointLight = createLight('point');
        scene.add(ambientLight, pointLight);
    }

    createObjects()
    {
        this.addObject(createCube());
        this.axis();
    }

    axis(n=5)
    {
        scene.add(new THREE.AxesHelper(n));
    }
    
    addObject(obj)
    {
        loop.add(obj);
        scene.add(obj);
    }

    /**
     * Render a single frame, no systems.
     */
    render() 
    {
        renderer.render(scene, camera);
    }
    
    /** Animation manager
     * 
     * start runs next systems:
     * 
     * - animation loop : changes on 3D world.
     * - resizing : changes on window resize event.
     * - camera control : changes on GUI provided by OrbitControls.js 
     */
    start()
    {
        loop.start();
    }
    
    /** Animation manager
     * 
     * stop breaks all systems.
     */
    stop()
    {
        loop.stop();
    }

    /** Working With the Camera While Using OrbitControls
     * With the controls in place, 
     * we have relinquished control of the camera to them. 
     * However, sometimes you need to take back control to 
     * manually position the camera. There are two ways 
     * to go about this:
     * 
     * - Cut/jump to a new camera position
     * - Smoothly animate to a new camera position. 
     * */
    /** Cut to a New Camera Position
     * 
     * To perform a camera cut, update the camera’s 
     * transform as usual, and then call 'controls.update'
     * If you’re calling .update in the loop, you don’t need 
     * to do it manually and you can simply move the camera. 
     * If you move the camera without calling .update, 
     * weird things will happen, so watch out!
     * 
     * One important thing to note here: 
     * when you move the camera, the controls.target does 
     * not move. If you have not moved it, it will remain 
     * at the center of the scene. When you move the camera 
     * to a new position but leave the target unchanged, 
     * the camera will not only move but also rotate so that 
     * it continues to point at the target. This means that 
     * camera movements may not work as you expect when using 
     * the controls. Often, you will need to move the camera 
     * and the target at the same time to get your desired 
     * outcome.
     * 
     * this method is useful for long animations and real time
     * animations even with gui implementations.
     */
    #cameraCut()
    {
        // move the camera
        camera.position.set(1,2,3);

        // and/or rotate the camera
        camera.rotation.set(0.5, 0, 0);
    }
    /** # Smoothly Transition to a New Camera Position
     * 
     * If you want to smoothly animate the camera to a 
     * new position, you will probably need to transition 
     * the camera and the target at the same time, and the 
     * best place to do this is in the controls.nextFrame 
     * method. However, you will need to disable the controls 
     * for the duration of the animation, otherwise, if the 
     * user attempts to move the camera before the animation 
     * has completed, you’ll end up with the controls fighting 
     * against your animation, often with disastrous results.
     * 
     * ## Save and Restore a View State
     * You can save the current view using .saveState()
     * and later restore it using .reset() 
     * 
     * If we call .reset() without first calling .saveState(), 
     * the camera will jump back to the position it was in when 
     * we created the controls.
     * 
     * */
    #cameraTransition()
    {
        controls.enabled = false;
        controls.saveState();

        // sometime later
        controls.reset();
    }
}
export {III_SPACE};