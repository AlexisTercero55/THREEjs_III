import { III_SPACE } from './III_SPACE.js';

function main() 
{
  // Get a reference to the container element
  const container = document.querySelector('#scene-container');

  // create a new world
  const world = new III_SPACE(container);

  // start the animation loop
  world.start();
}

main();