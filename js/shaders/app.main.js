import  III_SHADERS_2  from './III_SHADERS_2.js';

function main() 
{
  // Get a reference to the container element
  const container = document.querySelector('#sceneID_1');

  // create a new world
  const world = new III_SHADERS_2(container);

  // start the animation loop
  world.start();
}

main();