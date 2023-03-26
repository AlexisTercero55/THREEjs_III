import  III_MODELS  from './III_MODELS';

function main() 
{
  // Get a reference to the container element
  const container = document.querySelector('#sceneID_1');

  // create a new world
  const iii_space = new III_MODELS(container);

  // start the animation loop
  iii_space.start();
}

main();