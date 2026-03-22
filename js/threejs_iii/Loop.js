/** 21/03/2026 - CDMX|México
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import { Clock } from 'three';
import {CCapture} from 'ccapture.js-npmfixed';

const clock = new Clock();

/**
 * Creates a new Loop instance to manage animation and rendering.
 *
 * @param {THREE.PerspectiveCamera} camera - The Three.js camera for rendering
 * @param {THREE.Scene} scene - The Three.js scene to render
 * @param {THREE.WebGLRenderer} renderer - The Three.js renderer
 * @param {HTMLElement} container - DOM element to attach UI elements to
 * @param {Object|boolean} [physics=false] - Physics configuration object with 'world' and 'debugger' properties, or false to disable physics
 * @param {boolean} [ui=true] - Whether to create UI buttons for recording controls
 * 
 * The Loop class manages the animation loop for a Three.js scene, including rendering,
 * physics simulation, and optional screen recording. It provides a clean interface for
 * starting/stopping animations and handling frame updates.
 *
 * Key features:
 * - Animation loop with delta time and elapsed time tracking
 * - Physics integration (Cannon.js support)
 * - Optional UI for screen recording controls
 * - Screen recording using MediaRecorder API
 * - Extensible object system for custom animations
 * 
 * Based on https://discoverthreejs.com/book/first-steps/animation-loop/
 *
 * @example
 * // Basic usage without physics or UI
 * const loop = new Loop(camera, scene, renderer, container);
 * loop.add(myAnimatedObject);
 * loop.start();
 *
 * @example
 * // With physics and recording UI
 * const loop = new Loop(camera, scene, renderer, container, physicsWorld, true);
 * loop.startRecording(); // Programmatic recording
 * // ... animate ...
 * loop.stopRecording();
 * @example
 * const loop = new Loop(camera, scene, renderer, document.body, {
 *   world: cannonWorld,
 *   debugger: cannonDebugger
 * }, true);
 * 
 */
class Loop 
{ 
  #capturer = null;
  #container = null;
  #isRecording = false;
  // constructor(camera, scene, renderer,world=null,cannonDebugger=null) 
  constructor(camera, scene, renderer,container,physics=false, ui=true) 
  {
    this.#container = container;
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

    if (ui) {
      this.#setupUI();
    }
  }

  add(obj)
  {
    if(!obj.nextFrame)
    {
      throw new Error(`${obj} must have nextFrame method to add them to the animation loop.`)
    }
    this.objs.push(obj);
  }

  #setupUI() {
    const $info = document.createElement('button');
    $info.textContent = '🎥';
    $info.className = 'button-85';
    $info.title = 'Toggle recording options';
    $info.style.position = 'absolute';
    $info.style.bottom = '90%';
    $info.style.right = '2%';
    $info.style.width = '40px';
    $info.style.height = '40px';
    $info.style.padding = '0';
    $info.style.fontSize = '20px';
    $info.style.borderRadius = '50%';
    $info.style.cursor = 'pointer';
    $info.style.zIndex = '1000';
    this.#container.appendChild($info);

    const $start = document.createElement('button');
    $start.textContent = 'Start recording to WebM';
    $start.className = 'button-85';
    $start.style.position = 'absolute';
    $start.style.bottom = '90%';
    $start.style.left = '50%';
    $start.style.transform = 'translateX(-50%)';
    $start.style.zIndex = '1000';
    $start.style.display = 'none';
    this.#container.appendChild($start);

    const $stop = document.createElement('button');
    $stop.textContent = 'Stop recording to WebM';
    $stop.className = 'button-85';
    $stop.style.position = 'absolute';
    $stop.style.bottom = '90%';
    $stop.style.left = '30%';
    $stop.style.transform = 'translateX(-50%)';
    $stop.style.zIndex = '1000';
    $stop.style.display = 'none';
    this.#container.appendChild($stop);

    $info.addEventListener('click', e => {
      e.preventDefault();
      if (this.#isRecording) {
        this.stopRecording();
        $stop.style.display = 'none';
        $start.style.display = 'inline';
      } else {
        const startHidden = $start.style.display === 'none';
        $start.style.display = startHidden ? 'inline' : 'none';
        $stop.style.display = 'none';
      }
    }, false);

    $start.addEventListener('click', e => {
      e.preventDefault();
      this.startRecording();
      $start.style.display = 'none';
      $stop.style.display = 'block';
    }, false);

    $stop.addEventListener('click', e => {
      e.preventDefault();
      this.stopRecording();
      $stop.style.display = 'none';
      $start.style.display = 'inline';
    }, false);
  }

  startRecording() {
    this.#capturer.start();
    this.#isRecording = true;
  }

  stopRecording() {
    this.#capturer.stop();
    this.#isRecording = false;
    this.#capturer.save();
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
      if (this.#isRecording) {
        this.#capturer.capture(this.renderer.domElement);
      }
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