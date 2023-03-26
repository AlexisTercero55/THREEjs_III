import  III_SHADERS  from './III_SHADERS.js';

function main() 
{
  // Get a reference to the container element
  const container = document.querySelector('#sceneID_1');

  // create a new world
  const world = new III_SHADERS(container);

  // start the animation loop
  world.start();
}

main();