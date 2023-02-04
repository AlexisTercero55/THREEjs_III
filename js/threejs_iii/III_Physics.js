/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 * 
 * Physics System Class to simulations.
 */
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

export default class III_PHYSICS
{
    #world = null;
    #cannonDebugger = null;

    constructor({g=-9.82, show = false, scene = false})
    {
        this.#initCannon(g,show,scene);
    }

    BoxPhysics(mass=5,position={x:1,y:10,z:0})
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

    SpherePhysics(r=1,mass=5,position={x:0,y:7,z:0})
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

    FloorPhysics()
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

    addPhysics(body)//TODO : Add bodies list to the class in order to manage bodies on each intances
    {
        // console.log("🚀 ~ file: III_PHYSICS.js:70 ~ body", body)
        if (!(body instanceof CANNON.Body)) 
        {
            throw new Error('The parameter must be a CANNON.Body object.');
        }
        this.#world.addBody(body);
    }

    get world()
    {
        return this.#world;
    }

    get debugger()
    {
        return this.#cannonDebugger;
    }

    #initCannon(g,show,scene)
    {
        this.#world = new CANNON.World();
        this.#world.gravity.set(0, g, 0);

        if(show)
        {
            this.#initCannonDebugger(scene);
        }
    }

    #initCannonDebugger(scene)
    {
        this.#cannonDebugger = new CannonDebugger(
            scene, 
            this.#world,
            {
                onInit(body, mesh) 
                {
                    mesh.visible = true;
                    // Toggle visibiliy on "d" press
                    document.addEventListener("keydown", (event) => 
                    {
                        if (event.key === "f") 
                        {
                            mesh.visible = !mesh.visible;
                        }
                    });
                },
            });
    }
}