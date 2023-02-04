import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * By default, the controls orbit around the center of 
 * the scene, point (0,0,0). This is stored in the 
 * controls.target property, which is a Vector3. 
 * We can move this target to a new position
 * 
 *  controls.target.set([x,y,z]);
 *  controls.target.copy(cube.position);
 * 
 * Whenever you pan the controls 
 * (using the right mouse button), the target will pan too. 
 * If you need a fixed target, you can disable panning using 
 * 
 *  controls.enablePan = false.
 * 
 * As soon as the user stops interacting with the scene, 
 * the camera will come to an abrupt stop. 
 * Objects in the real world have inertia and never 
 * stop abruptly like this, so we can make the controls 
 * feel more realistic by enabling damping.
 * 
 *  controls.enableDamping = true;
 * 
 * You can adjust the .dampingFactor to control how 
 * fast the camera comes to a stop.
 * 
 * 
 */

/**
 * 
 * @param {THREE.PerspectiveCamera} camera 
 * @param {HTMLElement} canvas 
 * @returns 
 */
function createControls(camera, canvas) 
{
  const controls = new OrbitControls(camera, canvas);

  
  // damping and auto rotation require
  // the controls to be updated each frame
  // controls.autoRotate = true;
  controls.enableDamping = true;

  /**
   * For damping to work, we must call controls.update 
   * every frame in the animation loop. If we’re rendering 
   * frames on demand instead of using the loop, we cannot use damping. */
  controls.nextFrame = () => controls.update();

  return controls;
}

function removeControls(controls)
{
  controls.dispose();
}

export class III_CONTROLS_ extends OrbitControls
{
  constructor(camera, canvas)
  {
    super(camera, canvas);
    this.enableDamping = true;
  }

  nextFrame()
  {
    this.update();
    // console.log(this.getPolarAngle());
  }

  removeControls()
  {
    this.dispose();
  }
}

export { createControls };
