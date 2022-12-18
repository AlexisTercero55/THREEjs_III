/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import { III_SPACE } from './III_Space';

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