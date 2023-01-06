import { Color, 
  Scene,
  CubeTextureLoader
 } from 'three';

/**textures */
import starsTexture from '../../assets/img/stars.jpg';

/**
 * TODO convert to a class
 * @returns A virtual 3D math space.
 */
function createScene() 
{
  const scene = new Scene();

  // setting up texture background
  // method to change background 
  const cubeTextureLoader = new CubeTextureLoader();
  scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

  // simple color background
  // scene.background = new Color('skyblue');

  return scene;
}

export { createScene };
