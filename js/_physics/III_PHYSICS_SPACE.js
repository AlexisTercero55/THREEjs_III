/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as THREE from 'three';
// import * as CANNON from 'cannon-es';
// import CannonDebugger from 'cannon-es-debugger';
import nipplejs from 'nipplejs';

//systems
import III_Cam, { createCamera } from '../threejs_iii/camera';
import { createLight } from '../threejs_iii/lights.js';
import { III_SCENE, createScene } from '../threejs_iii/scene.js';
import { III_WebGL_Renderer, createRenderer } from '../threejs_iii/renderer.js';
import { III_CONTROLS_, createControls } from '../threejs_iii/controls.js'
import { Resizer } from '../threejs_iii/Resizer.js';
import { Loop } from '../threejs_iii/Loop.js';

//Materials
import { RGBNormalMaterial } from '../threejs_iii/shaders/RGBNormalMaterial';

//textures
/**textures */
import tiles from '/textures/tiles.jpg';
import a from '/textures/dawnmountain-xpos.png';
import aa from '/textures/dawnmountain-xneg.png';
import aaa from '/textures/dawnmountain-ypos.png';
import aaaa from '/textures/dawnmountain-yneg.png';
import aaaaa from '/textures/dawnmountain-zpos.png';
import aaaaaa from '/textures/dawnmountain-zneg.png';
import III_PHYSICS from '../threejs_iii/III_Physics';

/** Global variabes */
//FIXME: to become into private fields and setUp getters and setters
export let camera;
export let renderer;
export let scene;
export let loop;
export let gui;
export let controls;

//_____________joystick code_____________________
// vars
let fwdValue = 0;
let bkdValue = 0;
let rgtValue = 0;
let lftValue = 0;
let tempVector = new THREE.Vector3();
let upVector = new THREE.Vector3(0, 1, 0);



export default class III_PHYSICS_SPACE
{
    #container = null;
    #physics = null;
    /**
     * 
     * @param {DOMElement} container - where space will be render.
     */
    constructor(container) 
    {
        // camera = createCamera({x:1,y:2,z:15});
        camera = new III_Cam({x:0,y:0,z:12});
        renderer = new III_WebGL_Renderer();//createRenderer();
        scene = new III_SCENE('BOX');
        
        // initCannon();//FIXME: add to PhysicsSystem Class
        // loop = new Loop(camera, scene, renderer,world,cannonDebugger);
        this.#initSystems();

        controls = new III_CONTROLS_(camera, renderer.domElement);
        controls.enablePan = false;
        controls.maxPolarAngle = Math.PI*0.4;
        controls.minPolarAngle = 0;
        // controls.enableRotate = false;
        
        // loop.add(camera);
        this.container = container;
        container.append(renderer.domElement);
        loop.add(controls);
        
        // this.lights();
        // this.physics_test();
        this.III_PHYSICS_test();
        this.sky();
        // this.joystickTest1();
        // this.floor();

        // this.createObjects();

        const resizer = new Resizer(container, camera, renderer);
    }

    #initSystems()
    {
        this.#physics = new III_PHYSICS({
            show : true,
            scene : scene
        });

        loop = new Loop(camera, scene, renderer,
            this.#physics);
    }

    floor()
    {
        // FLOOR
        var floorTexture = new THREE.TextureLoader().load(tiles);
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
        floorTexture.repeat.set( 10, 10 );
        var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
        var floorGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        // floor.position.y = -50.5;
        floor.rotateX(-Math.PI / 2);
        scene.add(floor);
    }

    joystickTest1()
    {
        //FIXME: move is to speed
        let step = 0.3;
        let mesh = this.createSphere();
        mesh.position.setY(1);
        let joystick = nipplejs.create({
            zone: this.container,
            color: 'blue'
        });

        joystick.on('move', function (evt, data) {
            
            const forward = data.vector.y
            const turn = data.vector.x
    
            if (forward > 0) {
              fwdValue = Math.abs(forward)
              bkdValue = 0
            } else if (forward < 0) {
              fwdValue = 0
              bkdValue = Math.abs(forward)
            }
    
            if (turn > 0) {
              lftValue = 0
              rgtValue = Math.abs(turn)
            } else if (turn < 0) {
              lftValue = Math.abs(turn)
              rgtValue = 0
            }
          })
    
         joystick.on('end', function (evt) {
            bkdValue = 0
            fwdValue = 0
            lftValue = 0
            rgtValue = 0
          })

        mesh.nextFrame = (delta, ET) =>{
            // console.log('Joystick player for: ', mesh.id);
            // move the player
            // console.log(mesh.position);
            const angle = controls.getAzimuthalAngle()
            if (fwdValue > 0) {
                tempVector
                  .set(0, 0, -fwdValue)
                  .applyAxisAngle(upVector, angle),
                mesh.position.addScaledVector(
                  tempVector,
                  step
                )
              }
          
              if (bkdValue > 0) {
                tempVector
                  .set(0, 0, bkdValue)
                  .applyAxisAngle(upVector, angle)
                mesh.position.addScaledVector(
                  tempVector,
                  step
                )
              }
        
              if (lftValue > 0) {
                tempVector
                  .set(-lftValue, 0, 0)
                  .applyAxisAngle(upVector, angle)
                mesh.position.addScaledVector(
                  tempVector,
                  step
                )
              }
        
              if (rgtValue > 0) {
                tempVector
                  .set(rgtValue, 0, 0)
                  .applyAxisAngle(upVector, angle)
                mesh.position.addScaledVector(
                  tempVector,
                  step
                )
              }
          
          mesh.updateMatrixWorld()
          
          //controls.target.set( mesh.position.x, mesh.position.y, mesh.position.z );
          // reposition camera
          camera.position.sub(controls.target)
          controls.target.copy(mesh.position)
          camera.position.add(mesh.position)
        }

        this.addObject(mesh);
    }

    sky()
    {
        // SKYBOX
        var skyGeometry = new THREE.BoxGeometry( 1000, 1000, 1000 );	
        
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

    III_PHYSICS_test()
    {
        let floor = this.#physics.FloorPhysics();//TODO: to III_PHYSICS | done

        let III_sphere = this.createSphere();
        let SP1 = this.#physics.SpherePhysics();//TODO: to III_PHYSICS | done
        III_sphere.nextFrame = (_,__)=>
        {
            III_sphere.position.copy(SP1.position);
            III_sphere.quaternion.copy(SP1.quaternion);
        };
        this.addObject(III_sphere);

        let boxP1 = this.#physics.BoxPhysics();
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

    physicsTest1()
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
        let material = RGBNormalMaterial();
        // let material = new THREE.MeshNormalMaterial();
        
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
