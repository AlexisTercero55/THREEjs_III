import { III_DISPLACEMTMPAS } from '../../diplacementAlphaMaps/III_SPACE';
import { III_GLBMODEL } from '../../load3DModels/III_Space';
import { III_PHYSICS } from '../../physics/III_Space.js';
import { III_SOLARSYSTEM } from '../../solarSystem/III_Space';

// TODO : Ract component of SPACE
function createSpace(containerId, n=0) 
{
  // Get a reference to the container element
  const container = document.querySelector(containerId);

  switch (n) {
    case 0:
      const scene0 = new III_SOLARSYSTEM(container);
      scene0.start();
      break;

    case 1:
      const scene1 = new III_DISPLACEMTMPAS(container);
      scene1.start();
      break;

    case 2:
    const scene2 = new III_GLBMODEL(container);
    scene2.start();

    case 3:
    const scene3 = new III_PHYSICS(container);
    scene3.start();
  
    default:
      break;
  }

  // // create a new world
  // const Space = new III_SPACE(container);
  // // start the animation loop
  // Space.start();
}

function main() 
{
  let n = 0;
  createSpace('#sceneID_1',n);//solar syatem
  n +=1;
  createSpace('#sceneID_2',n);//diplacerment map
  n +=1;
  createSpace('#sceneID_3',n);//load objects
  n +=1;
  createSpace('#sceneID_4',n);//phisics
  n +=1;

}

main();