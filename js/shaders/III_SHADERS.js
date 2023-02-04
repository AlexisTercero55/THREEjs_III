/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
// TODO: migrate shaders templete to THREEJS_III_v2
import * as THREE from 'three';
import { createCamera } from '../threejs_iii/camera';
import { createLight } from '../threejs_iii/lights.js';
import { III_SCENE, createScene } from '../threejs_iii/scene.js';
import { III_WebGL_Renderer, createRenderer } from '../threejs_iii/renderer.js';
import { III_CONTROLS_, createControls } from '../threejs_iii/controls.js'
import { Resizer } from '../threejs_iii/Resizer.js';
import { Loop } from '../threejs_iii/Loop.js';
import { FresnelShader } from './shaders/fresnel';

/** Global variabes */
export let camera;
export let renderer;
export let scene;
export let loop;
export let gui;
export let controls;


["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];

/**textures */
import tiles from '/textures/tiles.jpg';
import a from '/textures/dawnmountain-xpos.png';
import aa from '/textures/dawnmountain-xneg.png';
import aaa from '/textures/dawnmountain-ypos.png';
import aaaa from '/textures/dawnmountain-yneg.png';
import aaaaa from '/textures/dawnmountain-zpos.png';
import aaaaaa from '/textures/dawnmountain-zneg.png';

class III_SHADERS
{
    /**
     * 
     * @param {DOMElement} container - where space will be render.
     */
    constructor(container) 
    {
        camera = createCamera({x:6,y:6,z:6});
        renderer = new III_WebGL_Renderer();//createRenderer();
        scene = new III_SCENE('BOX');
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);
        controls = new III_CONTROLS_(camera, renderer.domElement);
        controls.autoRotate = true;
        loop.add(controls);
        
        this.lights();
        this.floor();
        this.sky();

        
        let d = 2;
        const s1 = this._fresnel_bubble('transparent');
        s1.position.set(d,2,d);

        const s2 = this._fresnel_bubble('metalic');
        s2.position.set(-d,2,-d);
        // this.background();
        scene.add(new THREE.AxesHelper(10));

        const resizer = new Resizer(container, camera, renderer);
    }

    floor()
    {
        // FLOOR
        var floorTexture = new THREE.TextureLoader().load(tiles);
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
        floorTexture.repeat.set( 10, 10 );
        var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
        var floorGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        // floor.position.y = -50.5;
        floor.rotateX(-Math.PI / 2);
        scene.add(floor);
    }

    //TODO: move to main class as buffer
    sky()
    {
        // SKYBOX
        var skyGeometry = new THREE.BoxGeometry( 100, 100, 100 );	
        
        var urls = [a,aa,aaa,aaaa,aaaaa,aaaaaa];
        var materialArray = [];
        const loader_ = new THREE.TextureLoader();
        urls.forEach((url) =>
        {
            materialArray.push( new THREE.MeshBasicMaterial({
                map: loader_.load(url),
                side: THREE.BackSide
            }));
        });
            
        // var skyMaterial = new THREE.CubeTextureLoader ( materialArray );
        var skyBox = new THREE.Mesh( skyGeometry, materialArray );
        scene.add( skyBox );
    }

    _fresnel_bubble(type = 'transparent')
    {
        /*
            Based on https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Bubble.html
            By: Lee Stemkoski
            Date: July 2013 (three.js v59dev)


            this.refractSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
	        scene.add( refractSphereCamera );
        */
        
        var fShader = FresnelShader ;

        // Create cube render target
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);//( 128, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
        cubeRenderTarget.texture.type = THREE.HalfFloatType;


        // Create cube camera
        const refractSphereCamera = new THREE.CubeCamera( 1, 100000, cubeRenderTarget );
        // scene.add( refractSphereCamera );

        // const refractSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
        // scene.add( refractSphereCamera );

        var fresnelUniforms = 
        {
            "mRefractionRatio": { type: "f", value: 1.02 },
            "mFresnelBias": 	{ type: "f", value: 0.1 },
            "mFresnelPower": 	{ type: "f", value: 2.0 },
            "mFresnelScale": 	{ type: "f", value: 1.0 },
            "tCube": 			{ type: "t", value: cubeRenderTarget.texture } //  textureCube }
        };

        // create custom material for the shader
        let customMaterial;
        switch (type) {
            case 'transparent':
                customMaterial = new THREE.ShaderMaterial( 
                    {
                        uniforms: 		fresnelUniforms,
                        vertexShader:   fShader.vertexShader,
                        fragmentShader: fShader.fragmentShader,
                    }   );
                
                break;
        
            case 'metalic':
                customMaterial = new THREE.MeshStandardMaterial( {
                    envMap: cubeRenderTarget.texture,
                    roughness: 0.05,
                    metalness: 1
                } );
            break;
        }

        // var customMaterial = new THREE.ShaderMaterial( 
        // {
        //     uniforms: 		fresnelUniforms,
        //     vertexShader:   fShader.vertexShader,
        //     fragmentShader: fShader.fragmentShader,
        // }   );

        // const material = new THREE.MeshStandardMaterial( {
        //     // envMap: cubeRenderTarget.texture,
        //     roughness: 0.05,
        //     metalness: 1
        // } );

        // var sphereGeometry = new THREE.SphereGeometry( 2, 64, 32 );
        let sphere = new THREE.Mesh( new THREE.IcosahedronGeometry( 2, 8 ), customMaterial );//new THREE.Mesh( sphereGeometry, customMaterial );
        sphere.position.set(0, 2,0);
        scene.add(sphere);
        
        refractSphereCamera.position.set(sphere.position.x,
                                        sphere.position.y,
                                        sphere.position.z  );

        sphere.nextFrame = (_,__) =>
        {
            sphere.visible = false;
            refractSphereCamera.update( renderer, scene );
            sphere.visible = true;
        };
        loop.add(sphere);

        return sphere;

    }

    lights()
    {
        var light = new THREE.PointLight(0xff00ff);
        light.position.set(0,1,0);
        scene.add(light);
    }

    vertexShader() 
    {
        return `
        varying vec3 vUv; 

        void main() 
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vUv = position;
        }
        `;
    }

    fragmentShader() {
        
        return `
        varying vec3 vUv;

        void main() {
            gl_FragColor = vec4(1.0,0,0, 1.0);
        }
        `;
    }

    createObjects()
    {
        let uniforms = {
            colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
            colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)}
        }
        let material =  new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: this.fragmentShader(),
            vertexShader: this.vertexShader(),
        })

        let geometry = new THREE.SphereGeometry(1, 30, 30);
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
export {III_SHADERS};