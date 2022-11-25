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
  constructor(camera, scene, renderer) 
  {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.objs = [];
  }

  /**Start animation and resizing loops. */
  start() 
  {
    this.renderer.setAnimationLoop(() => 
    {
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

    // console.log(
    //   `The last frame rendered in ${delta * 1000} milliseconds`,
    // );

    for (const object of this.objs) 
    {
      object.nextFrame(delta);
    }
  }
  }
  
  export { Loop };
  