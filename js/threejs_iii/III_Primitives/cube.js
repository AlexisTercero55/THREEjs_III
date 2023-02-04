import 
{
  BoxGeometry,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  MeshBasicMaterial
} from 'three';

import imagen from '../../../assets/textures/carbon/Carbon_Normal.png';

function createMaterial() 
{
  // create a texture loader.
  // const textureLoader = new TextureLoader();
  // load a texture
  const texture = new TextureLoader().load(imagen);
  
  // create a "standard" material
  const material = new MeshBasicMaterial({ 
    map: texture
  });
  
  return material;
}
  
/**
 * @returns Returns a cube 3D object with geometry and material
 */
function createCube() 
{
  const geometry = new BoxGeometry(2, 2, 2);
  const material = createMaterial();
  const cube = new Mesh(geometry, material);

  // cube.rotation.set(-0.5, -0.1, 0.8);

  const radiansPerSecond = MathUtils.degToRad(30);

  // this method will be called once per frame
  cube.nextFrame = (delta) => 
  {
    // console.log(`${radiansPerSecond}*${delta} = ${radiansPerSecond * delta}`);
    // increase the cube's rotation each frame
    cube.rotation.z += radiansPerSecond * delta;
    // cube.rotation.x += radiansPerSecond * delta;
    // cube.rotation.y += radiansPerSecond * delta;
  };

  return cube;
}
export { createCube };
  