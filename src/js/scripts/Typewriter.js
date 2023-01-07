import Typewriter from 'typewriter-effect/dist/core';

var instructions = document.getElementById('tw-intructions');

let setUP = {
    loop: true,
    delay: 75,
  };

var typewriter = new Typewriter(instructions, setUP);

let SS = {zoom : 'zoom: ',
          zoom1: 'Middle mouse',
          zoom2: 'Touchscreen',
          pan :  'Pan/Orbit: ',
          pan1: 'Left Click',
          pan2 : 'Touchscreen'
        };

let waitTime = 500;

(typewriter.typeString()
    .typeString(SS['zoom'] + SS['zoom1'])
    .pauseFor(waitTime)
    .deleteChars(SS['zoom1'].length)
    .typeString(SS['zoom2'])
    .pauseFor(waitTime)
    .deleteChars((SS['zoom']+SS['zoom2']).length)
    .pauseFor(100)
    .typeString(SS['pan']+SS['pan1'])
    .pauseFor(waitTime)
    .deleteChars(SS['pan1'].length)
    .typeString(SS['pan2'])
    .pauseFor(waitTime)
    .deleteChars((SS['pan']+SS['pan2']).length)
    .start()
);

// typewriter
//   .pauseFor(2500)
//   .typeString('A simple yet powerful native javascript')
//   .pauseFor(300)
//   .deleteChars(10)
//   .typeString('<strong>JS</strong> plugin for a cool typewriter effect and ')
//   .typeString('<strong>only <span style="color: #27ae60;">5kb</span> Gzipped!</strong>')
//   .pauseFor(1000)
//   .start();