/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as THREE from 'three';
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

class III_DYNAMIC_GRAPHER
{
    /**
     * 
     * @param {DOMElement} container - where space will be render.
     */
    constructor(container) 
    {
        camera = createCamera({x:0,y:0,z:10});
        renderer = createRenderer();
        scene = createScene();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);
        controls = createControls(camera, renderer.domElement);
        loop.add(controls);
        
        // this.lights();

        this.dynamicPlot();

        const resizer = new Resizer(container, camera, renderer);
    }

    lights()
    {
        const ambientLight = createLight();
        const pointLight = createLight('point');
        scene.add(ambientLight, pointLight);
    }

    // TODO : complete the functions
    dynamicTube()
    {
        // Create the points that will make up the curve
        const numPoints = 100;
        const points = [];
        for (let i = 0; i <= numPoints; i++) 
        {
            const x = (i / numPoints) * 2 * Math.PI;
            const y = this.f(x);
            points.push(new THREE.Vector3(x, y, 0));
        }

        // Create the tube geometry and add it to the scene
        //SRC: https://threejs.org/docs/#api/en/extras/curves/CatmullRomCurve3
        const tubeGeometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points),  // the curve: Create a smooth 3d spline curve from a series of points using the Catmull-Rom algorithm
            numPoints, // segments
            0.2, // radius
            8, // radiusSegments
            false // closed
        );
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const tube = new THREE.Mesh(tubeGeometry, material);
        scene.add(tube);


        // Animate the drawing of the curve

        
        // Set up the animation loop
        let nv = 0;
        console.log(tubeGeometry.vertices); 
        let elapsedTime = 0;
        tubeGeometry.nextFrame = (delta,_)=>
        {
            nv += 7;// radius deffinition
            // const t = elapsedTime / n;
            if (nv > NumPoints) {
                nv = 0;
                //TODO: Make a loop remove(obj) method. Hashing would be work.
            }
            // const numVertices = Math.floor((t + 1 / numPoints) * numPoints);// const numVertices = Math.floor(t * numPoints);
            tubeGeometry.setDrawRange(0, nv);
        }
        loop.add(tubeGeometry);
        // const n = 0.1;
        // let elapsedTime = 0;
        // tubeGeometry.nextFrame = (delta,_)=>
        // {
        //     elapsedTime += delta;
        //     const t = elapsedTime / n;
        //     if (t > 12) {
        //         elapsedTime = 0;
        //         //TODO: Make a loop remove(obj) method. Hashing would be work.
        //     }
        //     const numVertices = Math.floor((t + 1 / numPoints) * numPoints);// const numVertices = Math.floor(t * numPoints);
        //     tubeGeometry.setDrawRange(0, numVertices);
        // }
        // loop.add(tubeGeometry);
        
  

        scene.add(new THREE.AxesHelper(5));
    }

    dynamicPlot()
    {
        // Create the points that will make up the curve
        const numPoints = 50;
        const points = [numPoints];
        // x-range [0,]
        for (let i = 0; i <= numPoints; i++) 
        {
            const x = (i / numPoints) * 2 * Math.PI;
            const y = this.f(x);
            points.push(new THREE.Vector2(x, y));
        }

        // Create the line geometry and add it to the scene
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const line = new THREE.Line(lineGeometry, material);
        scene.add(line);

        // Animate the drawing of the curve
        const n = 3;
        let elapsedTime = 0;
        lineGeometry.nextFrame = (delta,_) =>
        {
            elapsedTime += delta;
            const t = elapsedTime / n;
            if (t > 1) {
                elapsedTime = 0;
                //TODO: Make a loop remove(obj) method. Hashing would be work.
            }
            const numVertices = Math.floor(t * numPoints);
            // console.log(numVertices);
            lineGeometry.setDrawRange(0, numVertices);
        }
        loop.add(lineGeometry);
        scene.add(new THREE.AxesHelper(5));
    }

    f(x)
    {
        return Math.sin(x);
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
export {III_DYNAMIC_GRAPHER};