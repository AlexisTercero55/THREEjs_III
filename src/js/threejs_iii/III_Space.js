/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import { createCamera } from './camera.js';
import { createCube } from './cube.js';
import { createLight } from './lights.js';
import { createScene } from './scene.js';
import { createRenderer } from './renderer.js';
import { createControls } from './controls.js'

import { Resizer } from './Resizer.js';
import { Loop } from './Loop.js';

/** Global variabes */
export let camera;
export let renderer;
export let scene;
export let loop;
export let gui;
export let controls;

/**textures */
import mercuryTexture from '../../img/mercury.jpg';
import venusTexture from '../../img/venus.jpg';
import earthTexture from '../../img/earth.jpg';
import marsTexture from '../../img/mars.jpg';
import jupiterTexture from '../../img/jupiter.jpg';
import saturnTexture from '../../img/saturn.jpg';
import saturnRingTexture from '../../img/saturn ring.png';
import uranusTexture from '../../img/uranus.jpg';
import uranusRingTexture from '../../img/uranus ring.png';
import neptuneTexture from '../../img/neptune.jpg';
import plutoTexture from '../../img/pluto.jpg';

//my
import { Sun } from '../solarSystem/sun.js';
import { Planet } from '../solarSystem/planet.js';

class III_SPACE
{
    /**
     * 
     * @param {DOMElement} container - where space will be render.
     */
    constructor(container) 
    {
        camera = createCamera(300,300,60);
        renderer = createRenderer();
        scene = createScene();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);
        controls = createControls(camera, renderer.domElement);
        loop.add(controls);
        
        this.lights();

        this.createObjects();

        const resizer = new Resizer(container, camera, renderer);
    }

    lights()
    {
        const ambientLight = createLight();
        const pointLight = createLight('point');
        scene.add(ambientLight, pointLight);
    }

    createObjects()
    {
        const sun = Sun();
        this.addObject(sun);

        //adding plantes
        const mercury = new Planet(3.2, mercuryTexture, 28,
                                  0.004, 0.04);
        scene.add(mercury.orbit);
        loop.add(mercury);

        const venus = new Planet(5.8, venusTexture, 44, 0.002,0.015);
        scene.add(venus.orbit);
        loop.add(venus);

        const earth = new Planet(6, earthTexture, 62, 0.02, 0.01);
        scene.add(earth.orbit);
        loop.add(earth);

        const mars = new Planet(4, marsTexture, 78, 0.018, 0.008);
        scene.add(mars.orbit);
        loop.add(mars);

        const jupiter = new Planet(12, jupiterTexture, 100,0.04,0.002);
        scene.add(jupiter.orbit);
        loop.add(jupiter);

        const saturn = new Planet(10, saturnTexture, 138,
                                  0.038, 0.0009,
                                 {
                                     innerRadius: 10,
                                     outerRadius: 20,
                                     texture: saturnRingTexture
                                 });
        scene.add(saturn.orbit);
        loop.add(saturn);

        const uranus = new Planet(7, uranusTexture, 176,
                                    0.03, 0.0004,
                                {
                                    innerRadius: 7,
                                    outerRadius: 12,
                                    texture: uranusRingTexture
                                });
        scene.add(uranus.orbit);
        loop.add(uranus);

        const neptune = new Planet(7, neptuneTexture, 200,0.032, 0.0001);
        scene.add(neptune.orbit);
        loop.add(neptune);

        const pluto = new Planet(2.8, plutoTexture, 216,0.008, 0.00007);
        
        scene.add(pluto.orbit);
        loop.add(pluto);
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