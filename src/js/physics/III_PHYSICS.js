/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

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
export let cannonDebugger;

/**textures */

//___________________________________________
class PhysicsSystem
{
    
}
function initCannon() {
	// Setup world
	world = new CANNON.World();
	world.gravity.set(0, -9.82, 0);

	initCannonDebugger();
}

function initCannonDebugger(){
  cannonDebugger = new CannonDebugger(scene, world,{
    onInit(body, mesh) {
  mesh.visible = true;
        // Toggle visibiliy on "d" press
        document.addEventListener("keydown", (event) => {
            if (event.key === "f") {
                mesh.visible = !mesh.visible;
            }
        });
    },
});
  /**
   * {
		onInit(body, mesh) {
      mesh.visible = false;
			// Toggle visibiliy on "d" press
			document.addEventListener("keydown", (event) => {
				if (event.key === "f") {
					mesh.visible = !mesh.visible;
				}
			});
		},
	}
   */
}
//_______________________________________


export class III_PHYSICS
{
    /**
     * 
     * @param {DOMElement} container - where space will be render.
     */
    constructor(container) 
    {
        camera = createCamera({x:1,y:2,z:15});
        renderer = createRenderer();
        scene = createScene();
        initCannon();//FIXME: add to PhysicsSystem Class
        loop = new Loop(camera, scene, renderer,world,cannonDebugger);
        // loop.add(camera);
        container.append(renderer.domElement);
        controls = createControls(camera, renderer.domElement);
        loop.add(controls);
        
        // this.lights();
        this.physics_test();

        // this.createObjects();

        const resizer = new Resizer(container, camera, renderer);
    }

    addPhysics(body)//FIXME: add to PhysicsSystem Class
    {
        // console.log("🚀 ~ file: III_PHYSICS.js:70 ~ body", body)
        if (!(body instanceof CANNON.Body)) 
        {
            throw new Error('The parameter must be a CANNON.Body object.');
        }
        world.addBody(body);
    }

    createFloorPhysics()
    {
        let setUP = {
            type:CANNON.Body.STATIC,
            shape:new CANNON.Plane(),
        };
        const floor =  new CANNON.Body(setUP);

        floor.quaternion.setFromEuler(-Math.PI/2,0,0);

        this.addPhysics(floor);
        return floor;
    }

    createSpherePhysics(r=1,mass=5,position={x:0,y:7,z:0})
    {
        let setUP = {
            mass,
            shape:new CANNON.Sphere(r),
        };

        const sphere = new CANNON.Body(setUP);
        sphere.position.set(position['x'],position['y'],position['z']);
        this.addPhysics(sphere);

        return sphere;
    }

    createBoxPhysics(mass=5,position={x:1,y:10,z:0})
    {
        const setUP = {
            mass,
            shape: new CANNON.Box(new CANNON.Vec3(1,1,1))
        };
        const box = new CANNON.Body(setUP);
        box.position.set(position['x'],position['y'],position['z']);
        this.addPhysics(box);
        return(box);
    }

    physics_test()
    {
        let floor = this.createFloorPhysics();

        let III_sphere = this.createSphere();
        let SP1 = this.createSpherePhysics();
        III_sphere.nextFrame = (_,__)=>
        {
            III_sphere.position.copy(SP1.position);
            III_sphere.quaternion.copy(SP1.quaternion);
        };
        this.addObject(III_sphere);

        let boxP1 = this.createBoxPhysics();
        let box = this.III_Box();
        box.nextFrame = () =>
        {
            box.position.copy(boxP1.position);
            box.quaternion.copy(boxP1.quaternion);
        }
        this.addObject(box);

        scene.add(new THREE.AxesHelper(10));
    }

    lights()
    {
        const ambientLight = createLight();
        const pointLight = createLight('point');
        scene.add(ambientLight, pointLight);
    }

    III_Box()
    {
        const boxGeo = new THREE.BoxGeometry(2, 2, 2);
        const boxMat = new THREE.MeshNormalMaterial();
        return new THREE.Mesh(boxGeo, boxMat);
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

        const sphereGeo = new THREE.SphereGeometry(2);
        const sphereMat = new THREE.MeshBasicMaterial({ 
            color: 0xff0000, 
            wireframe: true,
        });
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


    //TODO : move to III_MODELS module
    createSphere(radius=1)
    {
        let geometry = new THREE.SphereGeometry(radius);
        // let material = RGBNormalMaterial();
        let material = new THREE.MeshNormalMaterial();
        
        return new THREE.Mesh(geometry, material);
    }
    
    addObject(obj)
    {
        if (!(obj instanceof THREE.Mesh)) {
            throw new Error("obj must be an instance of THREE.Mesh");
        }
        if (!("nextFrame" in obj)) {
            throw new Error("obj must have a nextFrame method");
        }
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
