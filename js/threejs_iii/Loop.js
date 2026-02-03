import { Clock } from 'three';
import {CCapture} from 'ccapture.js-npmfixed';

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
  #capturer = null;
  // constructor(camera, scene, renderer,world=null,cannonDebugger=null) 
  constructor(camera, scene, renderer,physics=false) 
  {
    if(physics)
    {
      // this.world = world;
      this.world = physics.world;

      // this.cannonDebugger = cannonDebugger;
      this.cannonDebugger = physics.debugger;
    }
    

    //! ISSUE | make private fields
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.objs = []; // need a setter for metadata extraction
    //under review
    this.flags = {};

    this.#capturer = new CCapture( { format: 'webm',
                                     framerate: 30,
	                                   verbose: true,
                                     name : 'alexisuwu'} );

    const $start = document.getElementById('start');
    const $stop = document.getElementById('stop');
    $start.addEventListener('click', e => {
      e.preventDefault();
      this.#capturer.start();
      $start.style.display = 'none';
      $stop.style.display = 'block';
    }, false);

    $stop.addEventListener('click', e => {
      e.preventDefault();
      this.#capturer.stop();
      $stop.style.display = 'none';
      this.#capturer.save();
    }, false);
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
    //this.#capturer.start();
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
      this.#capturer.capture(this.renderer.domElement);
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