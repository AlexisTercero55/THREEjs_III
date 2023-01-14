/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
// TODO: migrate shaders templete to THREEJS_III_v2
import * as THREE from 'three';
import { createCamera } from '../../threejs_iii/camera';
import { createLight } from '../../threejs_iii/lights.js';
import { III_SCENE, createScene } from '../../threejs_iii/scene.js';
import { III_WebGL_Renderer, createRenderer } from '../../threejs_iii/renderer.js';
import { III_CONTROLS_, createControls } from '../../threejs_iii/controls.js'
import { Resizer } from '../../threejs_iii/Resizer.js';
import { Loop } from '../../threejs_iii/Loop.js';

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
     * @param {DOMElement} container - where space will be render.
     */
    constructor(container) 
    {
        camera = createCamera({x:2,y:2,z:0});
        renderer = new III_WebGL_Renderer();//createRenderer();
        scene = new III_SCENE('BOX');
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);
        controls = new III_CONTROLS_(camera, renderer.domElement);
        loop.add(controls);
        
        // this.lights();

        this.createObjects();
        // scene.add(new THREE.AxesHelper(10));
        const size = 1;
        const divisions = 10;

        const gridHelper = new THREE.GridHelper( size, divisions );
        scene.add( gridHelper );

        const resizer = new Resizer(container, camera, renderer);
    }

    lights()
    {
        // let pointLight = new THREE.PointLight(0xdddddd)
        // //pointLight.position.set(-5, -3, 3)
        // pointLight.position.set(10, 0, 0)
        // scene.add(pointLight)
      
        // let ambientLight = new THREE.AmbientLight(0x505050)
        // scene.add(ambientLight)
    }
    vertexShader() 
    {
        return `
        varying float x;
        varying float y;
        varying float z;
        varying vec3 vUv; 
        uniform float u_time;

        void main() 
        {
            x = abs(position.x);
            y = abs(position.y);

            // float z = 2.0*sin(abs(position.x) + abs(position.y) + u_time*5.0);
            // float z = sin(position.x*position.y + u_time*5.0);
            // float z = position.x*cos(position.y + u_time*5.0);
            float z = pow(position.x,2.0)/1.0 - pow(position.y,2.0)/0.5;


            gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x,position.y,z, 1.0);
            vUv = position;
        }
        `;
    }

    fragmentShader() {
        
        return `
        varying float x;
        varying float y;
        varying float z;
        varying vec3 vUv;

        // uniform float u_time;

        void main() {
            // gl_FragColor = vec4(1.0,0,0, 1.0);
            gl_FragColor = vec4((32.0 - abs(x)) / 32.0, (32.0 - abs(y)) / 32.0, (abs(x + y) / 2.0) / 32.0, 1.0);
        }
        `;
    }

    createObjects()
    {
        let uniforms = {
            colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
            colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)},
            u_time: { type: "f", value: 1.0 }
        }
        uniforms.nextFrame = (delta,_) =>
        {
            uniforms.u_time.value += delta;
            // console.log(uniforms.u_time.value);
        };
        loop.add(uniforms);

        let material =  new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: this.fragmentShader(),
            vertexShader: this.vertexShader(),
            wireframe:true,
        })

        // material = new THREE.MeshNormalMaterial({wireframe:true});

        let r = 64;
        let geometry = new THREE.PlaneGeometry(1,1,r,r) //SphereGeometry(1, 30, 30);
        let mesh = new THREE.Mesh(geometry, material)
        mesh.rotateX(-Math.PI/2);
        // mesh.scale.set(1,0.12,1);
        scene.add(mesh)
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