import { Color, 
  Scene,
  CubeTextureLoader
 } from 'three';

import stars from '../../img/stars2.jpg';

/**
 * 
 * @returns A virtual 3D math space.
 */
function createScene() 
{
  const scene = new Scene();

  // setting up texture background
  const cubeTextureLoader = new CubeTextureLoader();
  scene.background = cubeTextureLoader.load([
    stars,
    stars,
    stars,
    stars,
    stars,
    stars
  ]);

  // simple color background
  // scene.background = new Color('skyblue');

  return scene;
}

export { createScene };
