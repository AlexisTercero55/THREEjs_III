/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as THREE from 'three';
import III_Cam from '../camera';
import { createLight } from '../lights';
import { III_SCENE } from '../scene';
import { III_WebGL_Renderer } from '../renderer';
import { III_CONTROLS_ } from '../controls'
import { Resizer } from '../Resizer';
import { Loop } from '../Loop';

import { createCube } from '../III_Primitives/cube';



export default class III_SPACE
{
    //#region 
    #camera = null;
    #renderer = null;
    #scene = null;
    #loop = null;
    #controls = null;
    #container = null;
    #physics = null;
    //#endregion
    /**
     * 
     * @param {DOMElement} container - where space will be render.
     */
    constructor(container) 
    {
        this.#container = container;
        this.#initSystems();
        this.#container.append(this.#renderer.domElement);
        this.#loop.add(this.#controls);
        
        // this.lights();

        this.createObjects();

        const resizer = new Resizer(this.#container, 
                                    this.#camera, 
                                    this.#renderer);
    }

    /**
     * * Initit
     * * Camera
     * * Renderer
     * * Scene
     * * Physics
     * * Render loop
     * * Control GUI
     * * Joystick
     */
    #initSystems()
    {
        this.#camera = new III_Cam({x:0,y:0,z:12, far:4000});
        this.#renderer = new III_WebGL_Renderer();
        this.#scene = new III_SCENE('BOX');
        // this.#physics = new III_PHYSICS({
        //     show : true,
        //     scene : this.#scene
        // });
        this.#loop = new Loop(this.#camera, 
                              this.#scene, 
                              this.#renderer);

        this.#controls = new III_CONTROLS_(this.#camera, 
                                           this.#renderer.domElement);
        // this.#controls.enablePan = false;
        // this.#controls.maxPolarAngle = Math.PI*0.4;
        // this.#controls.minPolarAngle = Math.PI*0.2;

        // Joystick = new III_Joystick(this.#container,
        //                                   this.#camera,
        //                                   this.#controls);
    }

    // beta

    background()
    {
        // background
        var grometry = new THREE.IcosahedronGeometry(100,2)
        var back = new THREE.Mesh( grometry, new THREE.MeshBasicMaterial( { map:this.gradTexture([[0.75,0.6,0.4,0.25], ['#1B1D1E','#3D4143','#72797D', '#b0babf']]), side:THREE.BackSide, depthWrite: false, fog:false }  ));
        // back.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(15*ToRad));
        this.#scene.add( back );
    }

    gradTexture(color) {
        var c = document.createElement("canvas");
        var ct = c.getContext("2d");
        var size = 1024;
        c.width = 16; c.height = size;
        var gradient = ct.createLinearGradient(0,0,0,size);
        var i = color[0].length;
        while(i--){ gradient.addColorStop(color[0][i],color[1][i]); }
        ct.fillStyle = gradient;
        ct.fillRect(0,0,16,size);
        var texture = new THREE.Texture(c);
        texture.needsUpdate = true;
        return texture;
    }

    // release

    lights()
    {
        const ambientLight = createLight();
        const pointLight = createLight('point');
        this.#scene.add(ambientLight, pointLight);
    }

    createObjects()
    {
        this.addObject(createCube());
        // this.axis();
    }

    axis(n=5)
    {
        this.#scene.add(new THREE.AxesHelper(n));
    }
    
    addObject(obj)
    {
        if (!(obj instanceof THREE.Mesh)) {
            throw new Error("obj must be an instance of THREE.Mesh");
        }
        if (!("nextFrame" in obj)) {
            throw new Error("obj must have a nextFrame method");
        }
        this.#loop.add(obj);
        this.#scene.add(obj);
    }

    /**
     * Render a single frame, no systems.
     */
    render() 
    {
        this.#renderer.render(this.#scene, 
                              this.#camera);
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
        this.#loop.start();
    }
    
    /** Animation manager
     * 
     * stop breaks all systems.
     */
    stop()
    {
        this.#loop.stop();
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
        this.#camera.position.set(1,2,3);

        this.#camera.rotation.set(0.5, 0, 0);
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
        this.#controls.enabled = false;
        this.#controls.saveState();

        this.#controls.reset();
    }
}