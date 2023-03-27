/** 26/03/2022 - CDMX|México
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as  THREE from 'three';
import III_SPACE from "../threejs_iii/III_Space";
import glbLoad from '../threejs_iii/III_MODELS/glbLoad';
import createLight from '../threejs_iii/lights';


export default class III_MODELS extends III_SPACE
{
    constructor(container,{
        SceneRotation=false,
        POV={x:0,y:4,z:-7.5},
    }={}){
        super(container,{
            SceneRotation,
            POV,
        });

        this.controlsLookAt(new THREE.Vector3(0,5,0));
    }

    async createObjects()
    {
        const grid = new THREE.GridHelper(90, 90,0x00ff00,0xff0000);
        this.addObject(grid);
        let model = await glbLoad('./models/tyrannosaurus_rex.glb',
        new THREE.Vector3(0,0.8,0));
        model.rotateY(-Math.PI);
        // model.scale.multiplyScalar(1);
        this.addObject(model,true);

        // model.scale;

        let lig = createLight('directional',100);
        lig.position.set(0, 10, 0);
        this.addObject(lig);

        lig = createLight('directional',100);
        lig.position.set(5, 10,-3 );
        this.addObject(lig);

        lig = createLight('directional',100);
        lig.position.set(-5, 10,-3 );
        this.addObject(lig);

        lig = createLight('directional',200);
        lig.position.set(0, 4,-7 );
        this.addObject(lig);

        const l = createLight('point',10)
        // l.position.set(0, 5, -5);
        this.addObject(l);

        this.axis();

    }
}