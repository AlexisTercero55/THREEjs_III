/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as THREE from 'three';
import { createCamera } from '../../threejs_iii/camera';
import { createLight } from '../../threejs_iii/lights.js';
import { createScene } from '../../threejs_iii/scene.js';
import { createRenderer } from '../../threejs_iii/renderer.js';
import { createControls } from '../../threejs_iii/controls.js'
import { Resizer } from '../../threejs_iii/Resizer.js';
import { Loop } from '../../threejs_iii/Loop.js';

/** Global variabes */
export let camera;
export let renderer;
export let scene;
export let loop;
export let gui;
export let controls;
export let loadImg;

// TODO add shaders to custom shaders class III_Shaders
/**Shaders */
const _VS =`
varying vec3 vUv; 

void main() {
  vUv = position; 

  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition; 
}
`;
const _FS =`
uniform vec3 colorA; 
uniform vec3 colorB; 
varying vec3 vUv;

void main() {
  gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
}
`;
// import sunShader from "./shaders/sunShader.glsl";
import { createCube } from '../../threejs_iii/cube';

// textures
import nebula from '../../../img/nebula.jpg';
import { TextureLoader } from 'three';


class III_SPACE
{
    /**
     * 
     * @param {DOMElement} container - where space will be render.
     */
    constructor(container) 
    {
        camera = createCamera({y:-10,z:15});
        renderer = createRenderer();
        scene = createScene();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);
        controls = createControls(camera, renderer.domElement);
        loop.add(controls);
        loadImg = new TextureLoader();
        
        // this.lights();

        this.createObjects();

        const resizer = new Resizer(container, camera, renderer);
    }



    lights()
    {
        let pointLight = new THREE.PointLight(0xdddddd)
        //pointLight.position.set(-5, -3, 3)
        pointLight.position.set(10, 0, 0)
        scene.add(pointLight)
      
        let ambientLight = new THREE.AmbientLight(0x505050)
        scene.add(ambientLight)
    }
    // {
    //     const ambientLight = createLight('directional');
    //     ambientLight.position.set(100, 0,0);
    //     // const pointLight = createLight('point');
    //     scene.add(ambientLight);
    // }

    vertexShader() 
    {
        return `
        uniform float u_time;
        varying vec2 vUv;
        void main() 
        {
            vUv = uv;
            float newX = sin(position.x * u_time) * sin(position.y * u_time);

            vec3 newPosition = vec3(newX, position.y, position.z);

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); //vec4(newPosition, 1.0);
        }
        `;
      }

    /**
     * reference: https://www.youtube.com/watch?v=xZM8UJqN1eY&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho&index=4
     * @returns shader code on strimg mode.
     */
      fragmentShader() {
        // TODO: document the shaders terms
        
        return `
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;

        uniform sampler2D img;

        varying vec2 vUv;

        void main() 
        {
            //gl_FragCoord
            //TODO documentation for st meas see reference:
            vec2 st = gl_FragCoord.xy / u_resolution;

            vec4 texture = texture2D(img,vUv);
            float effect_negative = abs(sin(texture.x + u_time));

            gl_FragColor = vec4(vec3(effect_negative), 1.0);
            // gl_FragColor = vec4(texture.r, texture.g, texture.b, 1.0);
        }
        `;
      }

    createObjects()
    {
        const uniforms = {
            u_time : {type : 'f', value : 0.0},

            u_resolution : {type : 'v2',
                value : new THREE.Vector2( 
                    window.innerWidth, window.innerHeight
                ).multiplyScalar(window.devicePixelRatio),
            },

            u_mouse : {type : 'v2',
                value : new THREE.Vector2(0,0),
            },

            img : {type : 't', 
                    value: loadImg.load(nebula)},

            nextFrame(delta, ElapsedTime)
            {
                this.u_time.value = ElapsedTime;
            }
        };
        loop.add(uniforms);
        window.addEventListener('mousemove',(e) =>
        {
            uniforms.u_mouse.value.set(
                e.screenX / window.innerWidth,
                1 - e.screenY / window.innerHeight
            );
        });

        const geometry = new THREE.PlaneGeometry(10,10,30,30);
        const material = new THREE.ShaderMaterial(
        {
            side: THREE.DoubleSide,
            vertexShader: this.vertexShader(),
            fragmentShader : this.fragmentShader(),
            wireframe: false,
            uniforms,
        });
        const plane = new THREE.Mesh(geometry,material);
        scene.add(plane);

        scene.add(new THREE.AxesHelper(10));
    }

    createSphereShader()
    {
        // return `
        // varying vec3 v_Normal;
        // void main() 
        // {
        //     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        //     v_Normal = normal;
        // }
        // `;

        // return `
        // varying vec3 v_Normal;
        // void main() 
        // {
        //     gl_FragColor = vec4(v_Normal,1.0);
        // }
        // `;
        let uniforms = {
            colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
            colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)}
        }
    
        let geometry = new THREE.SphereGeometry(1, 30, 30);
        let material =  new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: this.fragmentShader(),
            vertexShader: this.vertexShader(),
        })
        
        let mesh = new THREE.Mesh(geometry, material)
        // mesh.position.x = 2
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