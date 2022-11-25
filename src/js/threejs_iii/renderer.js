import { WebGLRenderer } from 'three';

/**
 * createRenderer
 * Returns a renderer with anti-Jaggies and
 * physical correction light.
 * 
 * @returns {THREE.WebGLRenderer}
 */
function createRenderer()
{
  const renderer = new WebGLRenderer({ antialias: true });//anti-Jaggies

  renderer.physicallyCorrectLights = true;

  return renderer;
}

export { createRenderer };
