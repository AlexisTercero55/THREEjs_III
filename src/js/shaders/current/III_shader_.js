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


class III_shader_v1
{
    /**
     * 
     * @param {DOMElement} container - where space will be render.
     */
    constructor(container) 
    {
        camera = createCamera({z:15});
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
        

        /**
         * Next, create a custom shader material using the Three.js ShaderMaterial class. In the vertex shader, you will need to pass the uv coordinates of the plane as a varying variable to the fragment shader.
         */

        
            const sineShader = {
                uniforms: {
                  time: { value: 0.0 },
                  frequency: { value: 1.0 },
                  color: { value: new THREE.Color(1.0, 1.0, 1.0) }
                },
                vertexShader: `
                  attribute float x;
                  uniform float time;
                  uniform float frequency;
                  void main() {
                    vec3 newPosition = position;
                    newPosition.y = sin(x * frequency + time);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition,1.0);
                  }
                `,
                fragmentShader: `
                  uniform vec3 color;
                  void main() {
                    gl_FragColor = vec4(color, 1.0);
                  }
                `
              };
              
              const sineMaterial = new THREE.ShaderMaterial({
                uniforms: sineShader.uniforms,
                vertexShader: sineShader.vertexShader,
                fragmentShader: sineShader.fragmentShader
              });
              
              const planeGeometry = new THREE.PlaneGeometry(2, 2);
              
              for (let i = 0; i < planeGeometry.vertices.length; i++) {
                planeGeometry.vertices[i].x = planeGeometry.vertices[i].x / 10;
              }
              
              planeGeometry.addAttribute('x', new THREE.BufferAttribute(new Float32Array(planeGeometry.vertices.length), 1));
              
              const plane = new THREE.Mesh(planeGeometry, sineMaterial);
              
              scene.add(plane);

          sineMaterial.nextFrame = (delta,elapsedTime) => {
            sineMaterial.uniforms.time.value += 0.01;
            sineMaterial.uniforms.frequency.value = 2.0;
            sineMaterial.uniforms.color.value = new THREE.Color(0.0, 1.0, 0.0);
          }
          loop.add(sineMaterial);

        plane.material = sineMaterial;
          

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
export {III_shader_v1};