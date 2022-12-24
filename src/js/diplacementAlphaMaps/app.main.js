import { III_SPACE } from './III_SPACE.js';

function main() 
{
  console.log('Starting: Diplacement & alpha maps project of THREEJS_III')
  // Get a reference to the container element
  const container = document.querySelector('#sceneID_1');

  // create a new world
  const world = new III_SPACE(container);

  // start the animation loop
  world.start();
}

main();