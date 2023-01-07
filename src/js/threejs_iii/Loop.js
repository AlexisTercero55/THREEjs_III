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
{
  /**
   * 
   * @param {THREE.PerspectiveCamera} camera
   * @param {THREE.Scene} scene
   * @param {THREE.WebGLRenderer} renderer
   */
  constructor(camera, scene, renderer,world=null,cannonDebugger=null) 
  {
    this.world = world;
    this.cannonDebugger = cannonDebugger;
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.objs = []; // need a setter for metadata extraction
    this.flags = {};
  }

  add(obj)
  {
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