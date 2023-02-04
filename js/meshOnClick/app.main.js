import III_MeshOnClick from './III_MeshOnClick.js';

function main() 
{
  // Get a reference to the container element
  const container = document.querySelector('#sceneID_1');

  // create a new world
  const world = new III_MeshOnClick(container);

  // start the animation loop
  world.start();
}

main();