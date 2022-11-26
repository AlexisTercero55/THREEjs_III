import { PerspectiveCamera } from 'three';

/**
 * @returns A camera representing human view
 */
function createCamera() 
{
  const camera = new PerspectiveCamera(
    35, // fov = Field Of View
    1, // aspect ratio (dummy value)
    0.1, // near clipping plane
    100, // far clipping plane
  );

  // move the camera back so we can view the scene
  camera.position.set(10, 0, 10);


  return camera;
}

// createCamera.prototype.camView = function ()
// {

// }

export { createCamera };
