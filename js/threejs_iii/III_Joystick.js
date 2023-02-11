/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */

import nipplejs from 'nipplejs';
import { Vector3 } from 'three';

let Forward = null;
let Backward = null;
let Right = null;
let Left = null;
let TempVec = new Vector3();
let UpVec = new Vector3(0, 1, 0);
let Step = 0.3;//FIXME: move is to speed

export default class III_Joystick
{
    #controls = null;
    #Joystick = null;
    
    // #Right = null; Direction values can't be store in private fields.
    //FIXME: try with closures.

    constructor(container, camera, controls ,color='blue')
    {
        
        this.#Joystick = nipplejs.create({
            zone: container,
            color: color
        });
        this.camera = camera;
        this.#controls = controls;
        this.#config();
    }

    addJoystick(mesh)
    {
        let controls  = this.#controls;
        mesh.nextFrame = (delta, ET) =>
        {
            const angle = controls.getAzimuthalAngle();
            if ( Forward > 0) 
            {
                 TempVec
                  .set(0, 0, - Forward)
                  .applyAxisAngle( UpVec, angle);
                mesh.position.addScaledVector(
                     TempVec,
                     Step
                );
            }
          
            if ( Backward > 0) 
            {
                 TempVec
                  .set(0, 0,  Backward)
                  .applyAxisAngle( UpVec, angle);
                mesh.position.addScaledVector(
                     TempVec,
                     Step
                );
            }
        
            if ( Left > 0) 
            {
                 TempVec
                  .set(- Left, 0, 0)
                  .applyAxisAngle( UpVec, angle);
                mesh.position.addScaledVector(
                     TempVec,
                     Step
                );
            }
        
            if ( Right > 0) 
            {
                 TempVec
                  .set( Right, 0, 0)
                  .applyAxisAngle( UpVec, angle);
                mesh.position.addScaledVector(
                     TempVec,
                     Step
                );
            }
          
          mesh.updateMatrixWorld();
          
          //controls.target.set( mesh.position.x, mesh.position.y, mesh.position.z );
          // reposition camera
          this.camera.position.sub( controls.target)
           controls.target.copy(mesh.position)
           this.camera.position.add(mesh.position)
        }
    }

    get forward()
    {
        return  Forward;
    }

    #config()
    {
        this.#Joystick.on('move', function (evt, data) 
        {
            
            const turn = data.vector.x
            const forward = data.vector.y
    
            if (forward > 0) 
            {
                Forward = Math.abs(forward);
                Backward = 0
            } else if (forward < 0) 
            {
                Forward = 0
                Backward = Math.abs(forward)
            }
    
            if (turn > 0) 
            {
                 Left = 0
                 Right = Math.abs(turn)
            } else if (turn < 0) 
            {
                 Left = Math.abs(turn)
                 Right = 0
            }
        });
    
        this.#Joystick.on('end', function (evt) 
        {
             Backward = 0;
             Forward = 0;
             Left = 0;
             Right = 0;
        });
    }

    /**
     * @param {Number} val
     */
    set right(val)
    {
        Right = val;
    }

    /**
     * @param {Number} val
     */
    set left(val)
    {
         Left = val;
    }

    /**
     * @param {Number} val
     */
    set backward(val)
    {
         Backward = val;
    }

    /**
     * @param {Number} val
     */
    set forward(val)
    {
        // console.log(val);
         Forward = val;
    }

    
}

/**
 * joystickTest1()
    {
        // let fwdValue = 0;
        // let bkdValue = 0;
        // let rgtValue = 0;
        // let lftValue = 0;
        // let tempVector = new THREE.Vector3();
        // let upVector = new THREE.Vector3(0, 1, 0);

        //FIXME: move is to speed
        let step = 0.3;
        let mesh = this.createSphere();
        mesh.position.setY(1);

        //TODO calling joystick class
        Joystick.addJoystick(mesh);
        this.addObject(mesh);

        // let joystick = nipplejs.create({
        //     zone: this.#container,
        //     color: 'blue'
        // });

        // joystick.on('move', function (evt, data) {
            
        //     const forward = data.vector.y
        //     const turn = data.vector.x
    
        //     if (forward > 0) {
        //       fwdValue = Math.abs(forward)
        //       bkdValue = 0
        //     } else if (forward < 0) {
        //       fwdValue = 0
        //       bkdValue = Math.abs(forward)
        //     }
    
        //     if (turn > 0) {
        //       lftValue = 0
        //       rgtValue = Math.abs(turn)
        //     } else if (turn < 0) {
        //       lftValue = Math.abs(turn)
        //       rgtValue = 0
        //     }
        //   })
    
        //  joystick.on('end', function (evt) {
        //     bkdValue = 0
        //     fwdValue = 0
        //     lftValue = 0
        //     rgtValue = 0
        //   })

        // mesh.nextFrame = (delta, ET) =>
        // {
        //     const angle = this.#controls.getAzimuthalAngle()
        //     if (fwdValue > 0) {
        //         tempVector
        //           .set(0, 0, -fwdValue)
        //           .applyAxisAngle(upVector, angle),
        //         mesh.position.addScaledVector(
        //           tempVector,
        //           step
        //         )
        //       }
          
        //       if (bkdValue > 0) {
        //         tempVector
        //           .set(0, 0, bkdValue)
        //           .applyAxisAngle(upVector, angle)
        //         mesh.position.addScaledVector(
        //           tempVector,
        //           step
        //         )
        //       }
        
        //       if (lftValue > 0) {
        //         tempVector
        //           .set(-lftValue, 0, 0)
        //           .applyAxisAngle(upVector, angle)
        //         mesh.position.addScaledVector(
        //           tempVector,
        //           step
        //         )
        //       }
        
        //       if (rgtValue > 0) {
        //         tempVector
        //           .set(rgtValue, 0, 0)
        //           .applyAxisAngle(upVector, angle)
        //         mesh.position.addScaledVector(
        //           tempVector,
        //           step
        //         )
        //       }
          
        //   mesh.updateMatrixWorld()
          
        //   //controls.target.set( mesh.position.x, mesh.position.y, mesh.position.z );
        //   // reposition camera
        //   this.#camera.position.sub(this.#controls.target)
        //   this.#controls.target.copy(mesh.position)
        //   this.#camera.position.add(mesh.position)
        // }

        // this.addObject(mesh);
    }
 */