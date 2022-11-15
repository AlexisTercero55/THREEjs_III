import * as THREE from 'three';
import { Scene } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/orbitcontrols';
import * as dat from 'dat.gui';

/**
 * {} global variable
 */
const objs = {};
/**
 * {} global variable
 */
let options = {};
const gui = new dat.GUI();
/**
 * THREE.WebGLRenderer global variable
 */
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/**
 * THREE.Scene global variable
 */
const scene = new THREE.Scene();

/**
 * THREE.PerspectiveCamera global variable
 */
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
let u = 3;
camera.position.set(10,8,-6);
camera.lookAt(scene.position);
const cameraControl =new OrbitControls(camera, renderer.domElement);
cameraControl.update();


createObjs();
createLights();


/**
 * number global variable
 */
let step = 0;
function animate(time) 
{
    // time is default parameter
    step += options.speed;
    objs.box.position.y = 2 * Math.abs(Math.sin(step));

    objs.box.rotation.x += 0.01;

    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// renderer.shadowMap.enabled = true;
// ----------------------------------------------------------------

function createObjs()
{
    //# create 3D objects class:
    //# {
    //     material,
    //     geometry,
    //     obj,
    //     (add scene),
    //  }
    const boxGeometry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshStandardMaterial({
        color: 0x0e00ff,
        wireframe: false
    });
    objs.box = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(objs.box);

    objs.axesHelper = new THREE.AxesHelper(5);
    scene.add(objs.axesHelper);

    objs.grid = new THREE.GridHelper(10,10);
    scene.add(objs.grid);

    console.log('THREEjs_iii objs was created');
    createGUI();
}

function createGUI()
{
    // define parameters for GUI
    //#  must be constant and add parameters as options.param = value;
    options = {
        cubeColor: '#0e00ff',
        boxWired: false,
        speed: 0.003
    };

    // define GUI for colors
    gui.addColor(options,'cubeColor').onChange(
        function (e)
        {
            objs.box.material.color.set(e);
        }
    );

    // check box
    gui.add(options,'boxWired').onChange(
        function (e)
        {
            objs.box.material.wireframe = e;
        }
    );

    // interval GUI
    gui.add(options, 'speed', 0, 0.1);

    console.log('GUI added');
}

function createLights()
{
    /**Ambient light  THREE.AmbientLight
     * 
     * It deals with THREE.MeshStandardMaterial
     * for some reflection and shadows features.
    */
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // /**Directional light THREE.DirectionalLight*/
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    scene.add(directionalLight);
    // directionalLight.position.set(-30, 50, 0);
    // directionalLight.castShadow = true;
    // directionalLight.shadow.camera.bottom = -12;
    // const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    // scene.add(dLightHelper);
    // const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(dLightShadowHelper);
    
    // /**Spot light THREE.SpotLight*/
    // const spotLight = new THREE.SpotLight(0xFFFFFF);
    // scene.add(spotLight);
    // spotLight.position.set(-100, 100, 0);
    // spotLight.castShadow = true;
    // spotLight.angle = 0.2;
    // const sLightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(sLightHelper);

    // //scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
    // scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

    //renderer.setClearColor(0xFFEA00);
}