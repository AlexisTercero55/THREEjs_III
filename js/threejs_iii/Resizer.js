/**
 * Compute the resolution of the container
 * at resize event occurs and 
 * redefine renderer settings.
 * @param {DOMelement} container 
 * @param {THREE.PerspectiveCamera} camera 
 * @param {THREE.WebGLRenderer} renderer 
 */
const setSize = (container, camera, renderer) => 
{
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

/**
 * @Class Resizer
 * 
 * Compute the resolution of the container
 * at resize event occurs and 
 * redefine renderer settings.
 */
class Resizer 
{
  /**
   * @param {DOMElement} container
   * @param {THREE.PerspectiveCamera} camera
   * @param {THREE.WebGLRenderer} renderer 
   */
  constructor(container, camera, renderer) 
  {
    // set initial size
    setSize(container, camera, renderer);

    window.addEventListener('resize', () => 
    {
      // set the size again if a resize occurs
      setSize(container, camera, renderer);
    });
  }
}

export { Resizer };
  