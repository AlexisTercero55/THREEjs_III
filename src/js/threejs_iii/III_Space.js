/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import { createCamera } from './camera.js';
import { createCube } from './cube.js';
import { createLights } from './lights.js';
import { createScene } from './scene.js';
import { createRenderer } from './renderer.js';
import { createControls } from './controls.js'

import { Resizer } from './Resizer.js';
import { Loop } from './Loop.js';

import { AxesHelper } from 'three';

// import * as THREE from 'three';
// import * as dat from 'dat.gui';

/** Global variabes */
let camera;
let renderer;
let scene;
let loop;
let gui;
let controls;

/**
 * @class III_SPACE
 * 
 * It contains:
 *      - camera
 *      - renderer
 *      - scene
 *      - systems:
 *          - camera controls
 *          - animation loop
 *          - resizer system
 *      - objs 
 *          - lights
 *          - meshes
 *              - animations
 */
class III_SPACE
{
    /**
     * 
     * @param {DOMElement} container - where space will be render.
     */
    constructor(container) 
    {
        camera = createCamera();
        renderer = createRenderer();
        scene = createScene();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);

        controls = createControls(camera, renderer.domElement);
        loop.objs.push(controls);

        const cube = createCube();
        loop.objs.push(cube);
        scene.add(cube);

        const axes = new AxesHelper(100);
        scene.add(axes);

        const light = createLights();
        scene.add(light);

        const resizer = new Resizer(container, camera, renderer);
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
}
export {III_SPACE};


//----------------------------------------------------------------

// class MYSCENE extends III_SPACE
// {
//     constructor()
//     {
//         super();
//         this.objs = {};
//         this.createObjs();
//         // createLights();
//         super.renderer.setAnimationLoop((renderer = super.renderer) => {
//             renderer.render(renderer.scene, renderer.camera);
//         });
//     }


//     /**
//      * animate
//      * Here goes your animation updates
//      * @param {*} time 
//      */
//     animate(time) 
//     {
//         super.renderer.render(super.scene, super.camera);
//     }

//     createObjs()
//     {
//         this.objs.axesHelper = new THREE.AxesHelper(10);
//         this.addObject(this.objs.axesHelper);

//         // objs.grid = new THREE.GridHelper(10,10);
//         // scene.add(objs.grid);

//         // cocoro3D();
//         // torusKnot();

//         this.grapher2D(
//             this.paretoDistribution,
//             0.1,10,50
//         );

//         console.log('THREEjs_iii objs was created');
//         // createGUI();
//     }

//     grapher2D(f,min,max,steps = 10)
//     {
//         let x = min;
//         const step = (max - min)/steps;
//         const points = [];
//         for(let i = 0; i < steps; i++)
//         {
//             points.push( new THREE.Vector3( x,f(x),0 ) );
//             x += step;
//         }
//         const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
//         const geometry = new THREE.BufferGeometry().setFromPoints( points );
        
//         this.objs.line = new THREE.Line( geometry, material );
//         super.addObject( this.objs.line );
//     }

//     paretoDistribution(x)
//     {
//         let a = 2, b = 3;
//         return (a*Math.pow(b,a))/Math.pow(x,a+1);
//     }
// }