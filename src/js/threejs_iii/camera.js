import { PerspectiveCamera } from 'three';


/**
 * @returns A camera representing human view
 */
function createCamera(x=5,y=5,z=5) 
{
  const camera = new PerspectiveCamera(
    45, // fov = Field Of View
    window.innerWidth / window.innerHeight,//1, // aspect ratio (dummy value)
    0.1, // near clipping plane
    1000, // far clipping plane
  );

  // move the camera back so we can view the scene
  camera.position.set(x,y,z);


  return camera;
}

// createCamera.prototype.camView = function ()
// {

// }

export { createCamera };
