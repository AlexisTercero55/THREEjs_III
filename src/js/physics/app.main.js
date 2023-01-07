import { III_PHYSICS } from './III_PHYSICS.js';

// TODO : Ract component of SPACE
function createSpace(containerId) 
{
  // Get a reference to the container element
  const container = document.querySelector(containerId);
  // create a new world
  const Space = new III_PHYSICS(container);
  // start the animation loop
  Space.start();
}

function main() 
{
  createSpace('#sceneID_1');
}

main();