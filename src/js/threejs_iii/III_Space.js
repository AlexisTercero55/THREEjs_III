/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/orbitcontrols';
import * as dat from 'dat.gui';
 
class III_SPACE
{
    constructor([x,y,z]=[0,0,22])
    {
        this.setUpGUI();
        this.setUpRenderer();
        this.setUpScene();
        this.setUpCamera();
        window.addEventListener('resize', this.resizeRender);

        // for Scene classes that adds graphics and animations to the scene
        // class MYSCENE extends III_SPACE
        /**
         * constructor()
         * {
         *      super();
         *      ...
         *      super.renderer.setAnimationLoop(this.animate);
         * }
         */
    }

    // animate(time) 
    // {
    //     // time is default parameter
    //     // step += options.speed;
    //     // objs.box.position.y = 2 * Math.abs(Math.sin(step));
    //     // objs.box.rotation.x += 0.01;

    //     super.renderer.render(super.scene, super.camera);
    // }

    /**
     * call THREE.Scene.add() method
     * @param {} obj 
     */
    addObject(obj)
    {
        this.scene.add(obj);
    }

    setUpGUI()
    {
        this.guiOptions = {};
        this.gui = new dat.GUI();
    }

    setUpRenderer()
    {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
    }

    setUpScene()
    {
        this.scene = new THREE.Scene();
        // const textureLoader = new THREE.TextureLoader();
        // scene.background = textureLoader.load(nebula);
    }

    setUpCamera([x,y,z]=[0,0,22])
    {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(x,y,z);
        this.camera.lookAt(this.scene.position);
        this.cameraControl = new OrbitControls(this.camera, this.renderer.domElement);
        this.cameraControl.update();
    }

    resizeRender()
    {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
export {III_SPACE};

class MYSCENE extends III_SPACE
{
    constructor()
    {
        super();
        this.objs = {};
        this.createObjs();
        // createLights();
        super.renderer.setAnimationLoop((renderer = super.renderer) => {
            renderer.render(renderer.scene, renderer.camera);
        });
    }


    /**
     * animate
     * Here goes your animation updates
     * @param {*} time 
     */
    animate(time) 
    {
        super.renderer.render(super.scene, super.camera);
    }

    createObjs()
    {
        this.objs.axesHelper = new THREE.AxesHelper(10);
        this.addObject(this.objs.axesHelper);

        // objs.grid = new THREE.GridHelper(10,10);
        // scene.add(objs.grid);

        // cocoro3D();
        // torusKnot();

        this.grapher2D(
            this.paretoDistribution,
            0.1,10,50
        );

        console.log('THREEjs_iii objs was created');
        // createGUI();
    }

    grapher2D(f,min,max,steps = 10)
    {
        let x = min;
        const step = (max - min)/steps;
        const points = [];
        for(let i = 0; i < steps; i++)
        {
            points.push( new THREE.Vector3( x,f(x),0 ) );
            x += step;
        }
        const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        
        this.objs.line = new THREE.Line( geometry, material );
        super.addObject( this.objs.line );
    }

    paretoDistribution(x)
    {
        let a = 2, b = 3;
        return (a*Math.pow(b,a))/Math.pow(x,a+1);
    }
}

let scene = new MYSCENE();