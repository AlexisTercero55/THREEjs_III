import * as THREE from 'three';

/**
 * createLight() creates an ambient light by default
 * @param {str} lightType {'directional','ambient','point'}
 * @returns 
 */
export function createLight(lightType = 'ambient') 
{
  let light;
  switch (lightType) 
  {
    case 'directional':
      light = new THREE.DirectionalLight('white', 8);
      // move the light right, up, and towards us
      light.position.set(100, 100, 100);
      break;
    case 'ambient':
      light = new THREE.AmbientLight(0x333333,5);
      break;
    case 'point':
      light = new THREE.PointLight(0xFFFFFF, 200, 300);
      break;
  }

  return light;
}