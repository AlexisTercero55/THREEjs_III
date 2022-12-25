/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { createCamera } from '../threejs_iii/camera.js';
import { createLight } from '../threejs_iii/lights.js';
import { createScene } from '../threejs_iii/scene.js';
import { createRenderer } from '../threejs_iii/renderer.js';
import { createControls } from '../threejs_iii/controls.js'

import { Resizer } from '../threejs_iii/Resizer.js';
import { Loop } from '../threejs_iii/Loop.js';
import { RGBNormalMaterial } from '../shaders/shader.js';

/** Global variabes */
export let camera;
export let renderer;
export let scene;
export let loop;
export let gui;
export let controls;
export let world ;

/**textures */

export class III_PHYSICS
{
    /**
     * 
     * @param {DOMElement} container - where space will be render.
     */
    constructor(container) 
    {
        camera = createCamera({x:-57.76,y:15.02,z:53.51});
        renderer = createRenderer();
        scene = createScene();
        world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.81, 0)
        });
        loop = new Loop(camera, scene, renderer,world);
        // loop.add(camera);
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
        const boxGeo = new THREE.BoxGeometry(2, 2, 2);
        const boxMat = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const boxMesh = new THREE.Mesh(boxGeo, boxMat);
        scene.add(boxMesh);

        // const sphereGeo = new THREE.SphereGeometry(2);
        // const sphereMat = new THREE.MeshBasicMaterial({ 
        //     color: 0xff0000, 
        //     wireframe: true,
        // });
        const sphereMesh = this.createSpherePhysics();
        scene.add(sphereMesh);

        const groundGeo = new THREE.PlaneGeometry(30, 30);
        const groundMat = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            side: THREE.DoubleSide,
            wireframe: true 
        });
        const groundMesh = new THREE.Mesh(groundGeo, groundMat);
        scene.add(groundMesh);

        // ------------------
        
        const groundPhysMat = new CANNON.Material();
        
        const groundBody = new CANNON.Body({
            //shape: new CANNON.Plane(),
            //mass: 10
            shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
            type: CANNON.Body.STATIC,
            material: groundPhysMat
        });
        world.addBody(groundBody);
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        
        const boxPhysMat = new CANNON.Material();
        
        const boxBody = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
            position: new CANNON.Vec3(1, 20, 0),
            material: boxPhysMat
        });
        world.addBody(boxBody);
        
        boxBody.angularVelocity.set(0, 10, 0);
        boxBody.angularDamping = 0.9;
        
        const groundBoxContactMat = new CANNON.ContactMaterial(
            groundPhysMat,
            boxPhysMat,
            {friction: 0.04}
        );
        
        world.addContactMaterial(groundBoxContactMat);
        
        const spherePhysMat = new CANNON.Material();
        
        const sphereBody = new CANNON.Body({
            mass: 4,
            shape: new CANNON.Sphere(2),
            position: new CANNON.Vec3(0, 10, 0),
            material: spherePhysMat
        });
        world.addBody(sphereBody);
        
        //friction
       //TODO: docuemnt
        sphereBody.linearDamping = 0.09
        
        const groundSphereContactMat = new CANNON.ContactMaterial(
            groundPhysMat,
            spherePhysMat,
            {restitution: 0.9}
        );
        
        world.addContactMaterial(groundSphereContactMat);


        // Loop settings
        groundMesh.nextFrame = (_,__) =>
        {
            const timeStep = 1 / 60;
            groundMesh.position.copy(groundBody.position);
            groundMesh.quaternion.copy(groundBody.quaternion);
        }
        loop.add(groundMesh);

        boxMesh.nextFrame = (_,__) =>
        {
            boxMesh.position.copy(boxBody.position);
            boxMesh.quaternion.copy(boxBody.quaternion);
        }
        loop.add(boxMesh);

        sphereMesh.nextFrame = (_,__) =>
        {
            sphereMesh.position.copy(sphereBody.position);
            sphereMesh.quaternion.copy(sphereBody.quaternion);
        }
        loop.add(sphereMesh);
        






        scene.add(new THREE.AxesHelper(10));
    }


    createSpherePhysics(radius=2)
    {
        let geometry = new THREE.SphereGeometry(radius);
        let material = RGBNormalMaterial();
        
        return new THREE.Mesh(geometry, material);
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