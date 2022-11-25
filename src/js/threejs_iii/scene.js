import { Color, Scene } from 'three';

/**
 * 
 * @returns A virtual 3D math space.
 */
function createScene() 
{
  const scene = new Scene();

  scene.background = new Color('skyblue');

  return scene;
}

export { createScene };
