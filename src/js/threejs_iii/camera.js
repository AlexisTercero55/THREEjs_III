import { PerspectiveCamera, Vector3 } from 'three';


/**
 * ref: https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.zoom
 * @returns A camera representing human view
 */
function createCamera({x=0,y=0,z=0, lookat=new Vector3(), near = 0.1, far = 1000}) 
{
  const camera = new PerspectiveCamera(
    75, // fov = Field Of View
    window.innerWidth / window.innerHeight,//1, // aspect ratio (dummy value)
    near, // near clipping plane
    far, // far clipping plane
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
