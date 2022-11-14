import * as THREE from 'three';
import { Scene } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/orbitcontrols';
import * as dat from 'dat.gui';


const objs = {};
let options = {};
const gui = new dat.GUI();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
let u = 3;
camera.position.set(u,u,u);
camera.lookAt(scene.position);
const cameraControl =new OrbitControls(camera, renderer.domElement);
cameraControl.update();


createObjs();

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

function createObjs()
{
    const boxGeometry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshBasicMaterial({
        color: 0x0e00ff,
        wireframe: true
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
        boxWired: true,
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