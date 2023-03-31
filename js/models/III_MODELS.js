/** 26/03/2022 - CDMX|México
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as  THREE from 'three';
import III_SPACE from "../threejs_iii/III_Space";
import glbLoad from '../threejs_iii/III_MODELS/glbLoad';
import createLight from '../threejs_iii/lights';
import { CController } from '../threejs_iii/III_MODELS/BotFSM';


export default class III_MODELS extends III_SPACE
{
    constructor(container,{
        SceneRotation=false,
        POV={x:-8,y:3,z:0},
    }={}){
        super(container,{
            SceneRotation,
            POV,
        });

        this.controlsLookAt(new THREE.Vector3(0,3,0));
    }

    createObjects(){
        this.GLBAnimated();
    }

    

    /**GLB animated load */
    async GLBAnimated()
    {
        const grid = new THREE.GridHelper(90, 90,0x00ff00,0xff0000);
        this.addObject(grid);

        let model = await glbLoad('./models/cats/an_animated_cat.glb',
        new THREE.Vector3(0,0,0));
        model.rotateY(-Math.PI);
        model.scale.multiplyScalar(0.2);
        this.addObject(model,true);

        model = await glbLoad('./models/cats/animated_bengal_cat.glb',
        new THREE.Vector3(0,0,3));
        model.rotateY(-Math.PI);
        model.scale.multiplyScalar(3);
        this.addObject(model,true);

        model = await glbLoad('./models/cats/toon_cat_free.glb',
        new THREE.Vector3(0,0,-3));
        model.rotateY(-Math.PI);
        model.scale.multiplyScalar(0.01);
        model.rotateY(Math.PI/2)
        this.addObject(model,true);


        

        let l = createLight(undefined,8);
        this.addObject(l);
        // this.axis();
        // this.centerLigthing();

    }

    centerLigthing(){
        let lig = createLight('directional',10);
        lig.position.set(0, 10, 0);
        this.addObject(lig);

        lig = createLight('directional',10);
        lig.position.set(0, -10, 0);
        this.addObject(lig);

        lig = createLight('directional',10);
        lig.position.set(10, 5,0 );
        this.addObject(lig);

        lig = createLight('directional',10);
        lig.position.set(-10, 5,0 );
        this.addObject(lig);
    }

    FSMCharacter()
    {
        const grid = new THREE.GridHelper(90, 90,0xFF535D,0xff0000);
        this.addObject(grid);
        const params = {
            model : 'X Bot.fbx',
            camera: this.camera,
            scene : this.scene,
        }
        
        var controls = new CController(params);

        controls.nextFrame = (delta,_) =>{
            controls.Update(delta);
        }
        this.addLoop(controls);

        const l = createLight('ambient',3);
        this.addObject(l);

        let lig = createLight('directional',3);
        lig.position.set(0, 10, 0);
        this.addObject(lig);

        // this.axis();
    }
}