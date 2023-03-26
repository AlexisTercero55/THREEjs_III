import III_SPACE from "../threejs_iii/BASE/III_Space";

export default class III_MODELS extends III_SPACE
{
    constructor(container,{
        SceneRotation=true,
        POV={x:6,y:6,z:6},
    }={}){
        super(container,{
            SceneRotation,
            POV,
        });
    }

    // createObjects()
    // {
        
    // }
}