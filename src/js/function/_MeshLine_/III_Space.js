/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as THREE from 'three';
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';
import { createCamera } from '../threejs_iii/camera';
import { createLight } from '../threejs_iii/lights.js';
import { III_SCENE } from '../threejs_iii/scene.js';
import { III_WebGL_Renderer } from '../threejs_iii/renderer.js';
import { III_CONTROLS_ } from '../threejs_iii/controls.js'
import { Resizer } from '../threejs_iii/Resizer.js';
import { Loop } from '../threejs_iii/Loop.js';

/** Global variabes */
export let camera;
export let renderer;
export let scene;
export let loop;
export let gui;
export let controls;

class III_MeshLine
{
    /**
     * 
     * @param {Element} CONTAINER - where space will be render.
     */
    constructor(CONTAINER) 
    {
        camera = createCamera({x:0,y:0,z:25});
        renderer = new III_WebGL_Renderer();
        scene = new III_SCENE();
        loop = new Loop(camera, scene, renderer);
        CONTAINER.append(renderer.domElement);
        controls = new III_CONTROLS_(camera, renderer.domElement);
        loop.add(controls);
        
        this.colors = [
            0xed6a5a,
            0xf4f1bb,
            0x9bc1bc,
            0x5ca4a9,
            0xe6ebe0,
            0xf0b67f,
            0xfe5f55,
            0xd6d1b1,
            0xc7efcf,
            0xeef5db,
            0x50514f,
            0xf25f5c,
            0xffe066,
            0x247ba0,
            0x70c1b3
        ];
        
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
        const parametric = (t) =>
        {
            // shabe by: https://qr.ae/prYChe
            let x = t - 1.6*Math.cos(24*t);
            let y = t - 1.6*Math.sin(25*t);
            return new THREE.Vector3(t - 1.6*Math.cos(24*t),t - 1.6*Math.sin(25*t),0);
        };

        let line = this.plot2D(parametric,this.colors[3],5);
        this.addObject(line);
        // scene.add(line);

        // for (let index = -10; index < 11; index++) {
        //     let line = this.plot2D();
        //     line.position.setZ(index);
        //     this.addObject(line);
        // }

        // for (let index = -10; index < 11; index++) {
        //     let line = this.plot2D(this.colors[3]);
        //     line.position.setX(index);
        //     line.rotateY(Math.PI/2);
        //     this.addObject(line);
        // }
        
        this.axis(50);
    }

    meshLineSetUp(geometry, color=this.colors[0], width=10)
    {
        let _resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );
        let _line = new MeshLine();
        _line.setGeometry(geometry);
        let _material = new MeshLineMaterial( {
            useMap: false,
            color: new THREE.Color( color ),
            opacity: 1,
            resolution: _resolution,
            sizeAttenuation: false,
            lineWidth: width,
        });

        let mesh = new THREE.Mesh(_line.geometry,_material);
        mesh.meshline = _line;

        return mesh;
    }

    /**
     * TODO: f, isparametric, range = [min,max], color
     * @param {*} f 
     * @param {*} color 
     * @returns 
     */
    plot2D(f,color=this.colors[5],withd=10)
    {
        /**
         * Create an array of 3D coordinates
         * First, create the list of numbers that 
         * will define the 3D points for the line.
         */
        // const points = [];
        // for (let j = 0; j < Math.PI; j += (2 * Math.PI) / 100) {
        // points.push(Math.cos(j), Math.sin(j), 0);
        // }
        // const line = new MeshLine();
        // line.setPoints(points);

        // MeshLine also accepts a BufferGeometry looking up the vertices in it
        // Parametrics plot: (x,y) = (f(t),g(t))
        const points = [];
        for (let t = -14; t < 14; t+=0.01) {
            points.push(f(t))
            
        }
        // USUAL PLOT y=f(x)
        // for (let j = -2 * Math.PI; j <= 2 * Math.PI; j += 2 * Math.PI / 360) 
        // {
        //     points.push(new THREE.Vector3( j, Math.sin(j), 0));
        // }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const _mesh_line = this.meshLineSetUp(geometry,color,withd);

        //adding draw animation
        let numPoints = _mesh_line.geometry.getAttribute('position').array.length;
        let vn = 0;
        let animation = 'draw';
        // let amplitud_change = 1.03;
        _mesh_line.nextFrame = (delta,ElapsetTime) =>
        {
            if(vn > numPoints )
            {
                vn = 0;
                // animation = 'oscilations';
            }
            vn += 5;
            _mesh_line.geometry.setDrawRange(0,vn);            
        };

        return _mesh_line;

        
            // switch (animation) {
            //     case 'draw':
            //         // drawing animation
            //         if(vn > numPoints )
            //         {
            //             vn = 0;
            //             // animation = 'oscilations';
            //             break;
            //         }
            //         vn += 50;
            //         _mesh_line.geometry.setDrawRange(0,vn);
            //         break;
            
            //     // case 'oscilations':
            //     //     // update vertex positions
            //     //     points.map( v => {
            //     //         v.set(v.x,Math.sin(amplitud_change)*Math.sin(v.x),v.z);
            //     //     });
            //     //     amplitud_change += 0.03;
            //     //     _mesh_line.meshline.setGeometry(geometry.setFromPoints(points));
            //     //     break;
            // }
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
export {III_MeshLine as III_SPACE};