import { Color, 
  Scene,
  CubeTextureLoader
 } from 'three';

/**textures */
import starsTexture from '../../assets/img/stars.jpg';

/**
 * TODO convert to a class
 * TODO manage resources loaders like REACT and PUBLIC_URL
 * @returns A virtual 3D math space.
 */
export class III_SCENE extends Scene
{
  constructor(BGType = 'html')
  {
    super();
    this.setBG(BGType);
  }

  /**
   * 
   * @param {str} BGType 
   * @param {THREE.Color} color 
   */
  setBG(BGType,color=0xff0ff4)
  {
    //TODO: add here the ico gradien bg
    switch (BGType) {

      case 'html':
      break;

      case 'BOX':
        this._BOX_()
        break;
    
      case 'COLOR':
        this.background = color;
        break;
    }
  }

  _BOX_()
  {
    const cubeTextureLoader = new CubeTextureLoader();
    this.background = cubeTextureLoader.load([
      starsTexture,
      starsTexture,
      starsTexture,
      starsTexture,
      starsTexture,
      starsTexture
    ]);
  }
}

function createScene(GBType = 'html') 
{
  const scene = new Scene();

  switch (GBType) {
    case 'html':
      return scene;
  }

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
