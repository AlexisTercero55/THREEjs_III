import  III_SPACE  from './III_Space';

function main() 
{
  // Get a reference to the container element
  const container = document.querySelector('#sceneID_1');

  // create a new world
  const iii_space = new III_SPACE(container);

  // start the animation loop
  iii_space.start();
}

main();