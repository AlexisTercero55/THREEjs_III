import { WebGLRenderer } from 'three';

/**
 * createRenderer
 * Returns a renderer with anti-Jaggies and
 * physical correction light.
 * 
 * @returns {THREE.WebGLRenderer}
 */
// TODO: add custom params
function createRenderer()
{
  const renderer = new WebGLRenderer({ antialias: true });//anti-Jaggies

  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;

  return renderer;
}

export { createRenderer };


export class III_WebGL_Renderer extends WebGLRenderer
{
  constructor()
  {
    super({ antialias: true, alpha:true });
    this.physicallyCorrectLights = true;
    this.shadowMap.enabled = true;

    //transparent bg
    // this.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    // this.setSize(window.innerWidth, window.innerHeight);
    // this.autoClear = false;
    // this.setClearColor(0x0FF000, 0.0);

  }
}
