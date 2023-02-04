import { Clock } from 'three';

const clock = new Clock();

/**
 * @class Loop
 * 
 * It contains:
 *  - animation loop
 *  - resizer system
 */
class Loop 
{ //TODO: Update js docs for CANNON settings and new classes
  // TODO flas systemas for animations.
  /**
   * 
   * @param {THREE.PerspectiveCamera} camera
   * @param {THREE.Scene} scene
   * @param {THREE.WebGLRenderer} renderer
   */
  // constructor(camera, scene, renderer,world=null,cannonDebugger=null) 
  constructor(camera, scene, renderer,physics=null) 
  {
    // this.world = world;
    this.world = physics.world;

    // this.cannonDebugger = cannonDebugger;
    this.cannonDebugger = physics.debugger;


    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.objs = []; // need a setter for metadata extraction
    this.flags = {};
  }

  add(obj)
  {
    if(!obj.nextFrame)
    {
      throw new Error(`${obj} must have nextFrame method to add them to the animation loop.`)
    }
    this.objs.push(obj);
  }

  /**Start animation and resizing loops. */
  start() 
  {
    const timeStep = 1/60;
    this.renderer.setAnimationLoop(() => 
    {
      if(this.world)
      {
        this.world.step(timeStep);
        // this.world.fixedStep();
        this.cannonDebugger.update();
      }
      
      // tell every animated object to tick forward one frame
      this.#nextFrame();
      // render a frame
      this.renderer.render(this.scene, this.camera);
    });
  }

  /**Start animation and resizing loops. */
  stop() 
  {
    this.renderer.setAnimationLoop(null);
  }

  #nextFrame() 
  {
    // only call the getDelta function once per frame!
    // Get the seconds passed since the last call to this method.
    const delta = clock.getDelta();

    //Get the seconds passed since the clock started.
    const ElapsedTime = clock.getElapsedTime();

    // console.log(
    //   `The last frame rendered in ${delta * 1000} milliseconds`,
    // );

    /**
     * this process needs flags review and pass them
     * to .nextFrame({delta, flag}) object
     */
    let flag, obj;
    for (const object of this.objs) 
    {
      // flag = flags[object.name];
      object.nextFrame(delta,ElapsedTime);
    }
  }
}
  
export { Loop };