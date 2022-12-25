/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
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
import { Sun } from './sun.js';
import { Planet } from './planet.js';
import { III_CircleGraph } from '../threejs_iii/math/Grapher.class.js';

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
export class III_SOLARSYSTEM
{
    /**
     * 
     * @param {DOMElement} container - where space will be render.
     */
    constructor(container) 
    {
        camera = createCamera({x:300,y:120,z:280});
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

        let color = 0xffffff;

        //adding plantes
        const mercury = new Planet(3.2, mercuryTexture, 28,
                                  0.004, 0.04);
        scene.add(mercury.orbit);
        loop.add(mercury);
        // draw the orbit
        let orbit = new III_CircleGraph(28,color);
        scene.add(orbit.circle);

        const venus = new Planet(5.8, venusTexture, 44, 0.002,0.015);
        scene.add(venus.orbit);
        loop.add(venus);
        // draw the orbit
        orbit = new III_CircleGraph(44,color);
        scene.add(orbit.circle);

        const earth = new Planet(6, earthTexture, 62, 0.02, 0.01);
        scene.add(earth.orbit);
        loop.add(earth);
        // draw the orbit
        orbit = new III_CircleGraph(62,color);
        scene.add(orbit.circle);

        const mars = new Planet(4, marsTexture, 78, 0.018, 0.008);
        scene.add(mars.orbit);
        loop.add(mars);
        // draw the orbit
        orbit = new III_CircleGraph(78,color);
        scene.add(orbit.circle);

        const jupiter = new Planet(12, jupiterTexture, 100,0.04,0.002);
        scene.add(jupiter.orbit,color);
        loop.add(jupiter);
        // draw the orbit
        orbit = new III_CircleGraph(100,color);
        scene.add(orbit.circle,color);

        const saturn = new Planet(10, saturnTexture, 138,
                                  0.038, 0.0009,
                                 {
                                     innerRadius: 10,
                                     outerRadius: 20,
                                     texture: saturnRingTexture
                                 });
        scene.add(saturn.orbit);
        loop.add(saturn);
        // draw the orbit
        orbit = new III_CircleGraph(138,color);
        scene.add(orbit.circle);

        const uranus = new Planet(7, uranusTexture, 176,
                                    0.03, 0.0004,
                                {
                                    innerRadius: 7,
                                    outerRadius: 12,
                                    texture: uranusRingTexture
                                });
        scene.add(uranus.orbit);
        loop.add(uranus);
        // draw the orbit
        orbit = new III_CircleGraph(176,color);
        scene.add(orbit.circle);

        const neptune = new Planet(7, neptuneTexture, 200,0.032, 0.0001);
        scene.add(neptune.orbit);
        loop.add(neptune);
        // draw the orbit
        orbit = new III_CircleGraph(200,color);
        scene.add(orbit.circle);

        const pluto = new Planet(2.8, plutoTexture, 216,0.008, 0.00007);
        scene.add(pluto.orbit);
        loop.add(pluto);
        // draw the orbit
        orbit = new III_CircleGraph(216,color);
        scene.add(orbit.circle);
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
        // move the camera
        camera.position.set(1,2,3);

        // and/or rotate the camera
        camera.rotation.set(0.5, 0, 0);
    }
    
    #cameraTransition()
    {
        controls.enabled = false;
        controls.saveState();

        // sometime later
        controls.reset();
    }
}