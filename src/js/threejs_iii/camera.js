import { PerspectiveCamera, Vector3 } from 'three';


/**
 * @returns A camera representing human view
 */
function createCamera({x=0,y=0,z=0, lookat=new Vector3()}) 
{
  const camera = new PerspectiveCamera(
    45, // fov = Field Of View
    window.innerWidth / window.innerHeight,//1, // aspect ratio (dummy value)
    0.000001, // near clipping plane
    1000, // far clipping plane
  );

  // move the camera back so we can view the scene
  camera.position.set(x,y,z);
  camera.nextFrame = (delta) => console.log('camera:',camera.position);


  return camera;
}

// createCamera.prototype.camView = function ()
// {

// }

export { createCamera };
