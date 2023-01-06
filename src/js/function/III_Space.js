/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as THREE from 'three';

//stackoverflow.com/questions/15696963/three-js-set-and-read-camera-look-vector
// THREE.Utils = {
//     cameraLookDir: function(camera) {
//         var vector = new THREE.Vector3(0, 0, -1);
//         vector.applyEuler(camera.rotation, camera.eulerOrder);
//         return vector;
//     }
// };

import {Complex} from './Complex.class.js'
import { createCamera } from '../threejs_iii/camera.js';
import { createLight } from '../threejs_iii/lights.js';
import { createScene } from '../threejs_iii/scene.js';
import { createRenderer } from '../threejs_iii/renderer.js';
import { createControls } from '../threejs_iii/controls.js'

import { Resizer } from '../threejs_iii/Resizer.js';
import { Loop } from '../threejs_iii/Loop.js';

/** Global variabes */
export let camera;
export let renderer;
export let scene;
export let loop;
export let gui;
export let controls;

/**textures */

class III_DYNAMIC_GRAPHER
{
    /**
     * 
     * @param {DOMElement} container - where space will be render.
     */
    constructor(container) 
    {
        camera = createCamera({x: 0, y: 0, z: 3});
        renderer = createRenderer();
        scene = createScene();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);
        controls = createControls(camera, renderer.domElement);
        controls.enablePan = true;
        controls.enableZoom = true;
        controls.enableRotate = false;
        controls.autoRotate = false;
        controls.target.set( camera.position.x,camera.position.y,0);
        loop.add(controls);

        // THREE.Utils.cameraLookDir(camera);


        // loop.add(camera);        
        // this.lights();

        this.Mandelbrot_shader3_uwu();

        const resizer = new Resizer(container, camera, renderer);
    }

    lights()
    {
        const ambientLight = createLight();
        const pointLight = createLight('point');
        scene.add(ambientLight, pointLight);
    }

    createObjs()
    {
        // Set up the plane geometry
const geometry = new THREE.PlaneGeometry(2, 2, 256, 256);

// Set up the custom shader material
const material = new THREE.ShaderMaterial({
  uniforms: {
    // Set the size of the Mandelbrot set
    size: { value: 2.0 },
    // Set the number of iterations to use when calculating the Mandelbrot set
    iterations: { value: 256 },
    // Set the color of the points in the Mandelbrot set
    color: { value: new THREE.Color(0xffffff) }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform float size;
    uniform int iterations;
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      vec2 c = vUv * size - vec2(size / 2.0);
      vec2 z = vec2(0.0, 0.0);
      int i;
      for (i = 0; i < iterations; i++) {
        if (dot(z, z) > 4.0) {
          break;
        }
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
      }
      if (i == iterations) {
        gl_FragColor = vec4(color, 1.0);
      } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }
    }
  `
});

// Create the plane mesh using the geometry and material
const plane = new THREE.Mesh(geometry, material);

// Add the plane to the scene
scene.add(plane);
    }
    
    Mandelbrot_shader3_uwu()
    {
      // Create the plane geometry
      const geometry = new THREE.PlaneGeometry(2, 2, 256, 256);

      // Create the shader material
      const material = new THREE.ShaderMaterial({
      uniforms: {
          maxIterations: { value: 1000 },
          minReal: { value: -2 },
          maxReal: { value: 1 },
          minImag: { value: -1 },
          maxImag: { value: 1 },
      },
      vertexShader: `
          varying vec2 vUv;
          void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
      `,
      fragmentShader: `
      uniform int maxIterations;
      uniform float minReal;
      uniform float maxReal;
      uniform float minImag;
      uniform float maxImag;
      varying vec2 vUv;

      vec3 toRGB(vec3 hsl);
      
      void main() {
        // Map the UV coordinates to the complex plane
        float real = mix(minReal, maxReal, vUv.x);
        float imag = mix(minImag, maxImag, vUv.y);
        vec2 c = vec2(real, imag);
        vec2 z = c;
      
        // Iterate the Mandelbrot function
        for (int i = 0; i < maxIterations; i++) {
          if (length(z) > 2.0) {
            // Calculate the color based on the number of iterations it took to escape
            float intensity = float(i) / float(100);
            vec3 color = vec3(intensity, 1.0, 0.5);
            gl_FragColor = vec4(toRGB(color), 1.0);
            return;
          }
          z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        }
      
        // Color points that do not escape black
        gl_FragColor = vec4(0,0,0, 1);
      }

      vec3 toRGB(vec3 hsl) {
        // Calculate chroma
        float c = (1.0 - abs(2.0 * hsl.z - 1.0)) * hsl.y;
      
        // Calculate the intermediate value 'x'
        float x = c * (1.0 - abs(mod(hsl.x, 2.0) - 1.0));
      
        // Calculate the RGB values based on the hue
        vec3 rgb;
        if (hsl.x >= 0.0 && hsl.x < 1.0) {
          rgb = vec3(c, x, 0.0);
        } else if (hsl.x >= 1.0 && hsl.x < 2.0) {
          rgb = vec3(x, c, 0.0);
        } else if (hsl.x >= 2.0 && hsl.x < 3.0) {
          rgb = vec3(0.0, c, x);
        } else if (hsl.x >= 3.0 && hsl.x < 4.0) {
          rgb = vec3(0.0, x, c);
        } else if (hsl.x >= 4.0 && hsl.x < 5.0) {
          rgb = vec3(x, 0.0, c);
        } else if (hsl.x >= 5.0 && hsl.x < 6.0) {
          rgb = vec3(c, 0.0, x);
        }
      
        // Calculate the final RGB values by adding the luminance
        float m = hsl.z - c / 2.0;
        return rgb + vec3(m, m, m);
      }
      `,
      });

      // Create the plane mesh
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }

    Mandelbrot_shader2_uwu()
    {
        // Create the plane geometry
        const geometry = new THREE.PlaneGeometry(2, 2, 256, 256);

        // Create the shader material
        const material = new THREE.ShaderMaterial({
        uniforms: {
            maxIterations: { value: 256 },
            minReal: { value: -2 },
            maxReal: { value: 1 },
            minImag: { value: -1 },
            maxImag: { value: 1 },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform int maxIterations;
            uniform float minReal;
            uniform float maxReal;
            uniform float minImag;
            uniform float maxImag;
            varying vec2 vUv;
            void main() {
            // Map the UV coordinates to the complex plane
            float real = mix(minReal, maxReal, vUv.x);
            float imag = mix(minImag, maxImag, vUv.y);
            vec2 c = vec2(real, imag);
            vec2 z = c;

            // Iterate the Mandelbrot function
            for (int i = 0; i < maxIterations; i++) 
            {
                if (length(z) > 2.0) 
                {
                // Color the point based on the number of iterations it took to escape
                gl_FragColor = vec4(float(i) / float(maxIterations), 0, 0, 1);
                return;
                }
                z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
            }

            // Color points that do not escape black
            gl_FragColor = vec4(0, 0, 0, 1);
            }
        `,
        });

        // Create the plane mesh
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    }

    Mandelbrot_shader1()
    {
        // this.MandelbrotSet_v2();
        // create a plane to render the Mandelbrot set on
        const geometry = new THREE.PlaneGeometry(2, 2);


  
        const material = new THREE.ShaderMaterial({
          uniforms: {
            u_resolution: {value: new THREE.Vector2(1000, 1000)},
            u_offset: {value: new THREE.Vector2(0, 0)},
            u_zoom: {value: 1}
          },
          fragmentShader: `
            uniform vec2 u_resolution;
            uniform vec2 u_offset;
            uniform float u_zoom;

            void main() {
              vec2 c = (gl_FragCoord.xy / u_resolution - 0.5) * u_zoom + u_offset;
              vec2 z = vec2(0.0, 0.0);
              int maxIterations = 100;
              int i = 0;
              while (i < maxIterations && dot(z, z) < 4.0) {
                z = vec2(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
                i++;
              }
              gl_FragColor = vec4(vec3(float(i) / float(maxIterations)), 1.0);
            }
          `
        });

        // create a mesh using the plane geometry and the custom material
        const mesh = new THREE.Mesh(geometry, material);

        // add the mesh to the scene
        scene.add(mesh);
        // scene.add(new THREE.AxesHelper(1));
    }

    MandelbrotSet_v2()
    {
        const geometry = new THREE.BufferGeometry();

        // Generate the points for the desired area
        // const points_ = this.generateMandelbrotSet(-2, 2, -2, 2, 200, 200);
        const mandelbrotSet = this.getArea_v0(-1.5, 0.5, -1.2, 1.2);//this.generateMandelbrotSet();

        // Create a Float32Array to hold the positions of the points
        const positions = new Float32Array(mandelbrotSet.length * 3);

        // Create a Float32Array to hold the colors of the points
        const colors = new Float32Array(mandelbrotSet.length * 3);

        // Add points to the geometry
        for (let i = 0; i < mandelbrotSet.length; i++) 
        {
            positions[i * 3] = mandelbrotSet[i].complex.real;
            positions[i * 3 + 1] = mandelbrotSet[i].complex.imag;
            positions[i * 3 + 2] = 0;

            // Set the color of the point based on the number of iterations
            const color = new THREE.Color();
            color.setHSL(mandelbrotSet[i].iterations / 100, 1.0, 0.5);
            color.toArray(colors, i * 3);
        }

        // Set the attributes of the geometry
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        // let v = 1;
        // geometry.nextFrame = ()=>
        // {
        //     if (v<mandelbrotSet.length) {
        //         geometry.setDrawRange(0, v);
        //         v+=100;
        //     }
        //     else {v = 0}
        // }
        // loop.add(geometry);

        // Create a points object and add it to the scene
        const points = new THREE.Points(geometry, new THREE.PointsMaterial({ vertexColors: true , size : 0.001}));

        points.nextFrame = (delta,_) =>
        {
            points.rotateZ(0.01);
        }
        // loop.add(points);


        scene.add(points);
    }

    getArea(points, xMin, xMax, yMin, yMax) 
    {
        return points.filter(point => point.complex.real >= xMin && point.complex.real <= xMax && point.complex.imag >= yMin && point.complex.imag <= yMax);
    }

    generateMandelbrotSet(xMin, xMax, yMin, yMax, width, height) 
    {
        const mandelbrotSet = [];
      
        for (let x = xMin; x < xMax; x++) {
          for (let y = yMin; y < yMax; y++) {
            let c = new Complex(x / width * 4 - 2, y / height * 4 - 2);
            let z = new Complex(0, 0);
      
            let numIterations = 0;
      
            for (let i = 0; i < 100; i++) {
              z = z.multiply(z).add(c);
      
              if (z.abs() > 2) {
                numIterations = i;
                break;
              }
            }
      
            mandelbrotSet.push({ complex: c, iterations: numIterations });
          }
        }
      
        return mandelbrotSet;
      }

    

    // Generate the Mandelbrot set
    generateMandelbrotSet_2(width = 5300, height=5300) 
    {
        const mandelbrotSet = [];
    
        for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let c = new Complex(x / width * 4 - 2, y / height * 4 - 2);
            let z = new Complex(0, 0);
    
            let numIterations = 0;
    
            for (let i = 0; i < 100; i++) {
            z = z.multiply(z).add(c);
    
            if (z.abs() > 2) {
                numIterations = i;
                break;
            }
            }
    
            mandelbrotSet.push({ complex: c, iterations: numIterations });
        }
        }
    
        return mandelbrotSet;
    }

    getArea_v0(xMin, xMax, yMin, yMax) 
    {
        // let points = this.generateMandelbrotSet();
        return this.generateMandelbrotSet_2().filter(point => point.complex.real >= xMin && point.complex.real <= xMax && point.complex.imag >= yMin && point.complex.imag <= yMax);
    }

    generateMandelbrotSet_v1(size) 
    {
        const mandelbrotSet = [];
      
        for (let x = 0; x < size; x++) {
          for (let y = 0; y < size; y++) {
            let c = new Complex(x / size * 4 - 2, y / size * 4 - 2);
            let z = new Complex(0, 0);
      
            let isPartOfMandelbrotSet = true;
            let numIterations = 0;
      
            for (let i = 0; i < 100; i++) {
              z = z.multiply(z).add(c);
      
              if (z.abs() > 2) {
                isPartOfMandelbrotSet = false;
                numIterations = i;
                break;
              }
            }
      
            // if (isPartOfMandelbrotSet) {
              mandelbrotSet.push({ complex: c, iterations: numIterations });
            // }
          }
        }
      
        return mandelbrotSet;
    }

    MandelbrotSet_v1()
    {
        const geometry = new THREE.BufferGeometry();
        const mandelbrotSet = this.generateMandelbrotSet_v0();

        // Create a Float32Array to hold the positions of the points
        const positions = [];

        // Create a Float32Array to hold the colors of the points
        const colors = [];
        const color = new THREE.Color();

        // Add points to the geometry
        const lenn = mandelbrotSet.length;
        for (let i = 0; i < lenn; i++) 
        {
            positions.push(mandelbrotSet[i].real);
            positions.push(mandelbrotSet[i].imag);
            positions.push(0);

            // Set the color of the point based on the number of iterations
            color.setHSL(mandelbrotSet[i].iterations, 2.0, 0.5);
            console.log( color.toArray());
            // color.setRGB(i/lenn, 1.0, 0.5);
            // colors.push( color.r, color.g, color.b );
        }

        // Set the attribute of the geometry
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        // Scale the positions of the points
        // geometry.applyMatrix4(new THREE.Matrix4().makeScale(0.1, 0.1, 0.1));

        const material = new THREE.PointsMaterial({ vertexColors: true, size:0.001 });
        
        // Create a points object and add it to the scene
        const points = new THREE.Points(geometry, material);
        scene.add(points);

    }
    
    generateMandelbrotSet_v0() 
    {
        const mandelbrotSet = [];
      
        for (let real = -2; real <= 2; real += 0.01) {
          for (let imag = -2; imag <= 2; imag += 0.01) {
            let c = new Complex(real, imag);
            let z = new Complex(0, 0);
      
            let isPartOfMandelbrotSet = true;
      
            for (let i = 0; i < 100; i++) {
              z = z.multiply(z).add(c);
      
              if (z.abs() > 2) {
                isPartOfMandelbrotSet = false;
                break;
              }
            }
      
            if (isPartOfMandelbrotSet) {
              mandelbrotSet.push(c);
            }
          }
        }
      
        return mandelbrotSet;
    }

    MandelbrotSet_v0()
    {
        // Declara el tamaño del conjunto de Mandelbrot y el número máximo de iteraciones
        const WIDTH = 512;
        const HEIGHT = 512;
        const MAX_ITERATIONS = 100;

        // Crea una geometría de puntos utilizando un buffer de vertices
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(WIDTH * HEIGHT * 3);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Crea un material utilizando un fragment shader y un vertex shader para calcular el color de cada punto
        const material = new THREE.ShaderMaterial({
        uniforms: {
            width: { value: WIDTH },
            height: { value: HEIGHT },
            maxIterations: { value: MAX_ITERATIONS }
        },
        vertexShader: `
            // Declara las variables de entrada y salida del shader
            //attribute vec3 position;
            uniform float width;
            uniform float height;
            varying vec2 vUv;
            void main() {
            // Calcula la coordenada de textura a partir de la posición del punto
            vUv = vec2(position.x / width, position.y / height);
            gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            // Declara las variables de entrada y salida del shader
            uniform float width;
            uniform float height;
            uniform float maxIterations;
            varying vec2 vUv;
            void main() {
            // Calcula la coordenada compleja a partir de la coordenada de textura
            float x0 = -2.0 + 3.5 * vUv.x;
            float y0 = -1.0 + 2.0 * vUv.y;
            float x = 0.0;
            float y = 0.0;
            float iteration = 0.0;
            float real = 0.0;
            float imag = 0.0;

            // Itera hasta que la magnitud de (x, y) sea mayor que 2 o se alcance el límite de iteraciones
            while (x*x + y*y <= 4.0 && iteration < maxIterations) {
                real = x*x - y*y + x0;
                imag = 2.0*x*y + y0;
                x = real;
                y = imag;
                iteration++;
            }

            // Calcula el color de salida en función de la iteración final
            float color = iteration / maxIterations;
            gl_FragColor = vec4(color, color, 1.0 - color, 1.0);
            }
        `
        });


        // Crea una malla utilizando la geometría y el material y agrégala a la
        const mesh = new THREE.Mesh(geometry, material);

        // Actualiza la posición de cada punto en la geometría
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] = i % WIDTH;
            positions[i + 1] = Math.floor(i / WIDTH);
            positions[i + 2] = 0;
        }
        
        // Actualiza la geometría para que los cambios en las posiciones de los puntos surtan efecto
        geometry.attributes.position.needsUpdate = true;


        scene.add(mesh);
    }

    // TODO : complete the functions
    dynamicTube()
    {
        // Create the points that will make up the curve
        const numPoints = 100;
        const points = [];
        for (let i = 0; i <= numPoints; i++) 
        {
            const x = (i / numPoints) * 2 * Math.PI;
            const y = this.f(x);
            points.push(new THREE.Vector3(x, y, 0));
        }

        // Create the tube geometry and add it to the scene
        //SRC: https://threejs.org/docs/#api/en/extras/curves/CatmullRomCurve3
        const tubeGeometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points),  // the curve: Create a smooth 3d spline curve from a series of points using the Catmull-Rom algorithm
            numPoints, // segments
            0.2, // radius
            8, // radiusSegments
            false // closed
        );
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const tube = new THREE.Mesh(tubeGeometry, material);
        scene.add(tube);


        // Animate the drawing of the curve

        
        // Set up the animation loop
        let nv = 0;
        console.log(tubeGeometry.vertices); 
        let elapsedTime = 0;
        tubeGeometry.nextFrame = (delta,_)=>
        {
            nv += 7;// radius deffinition
            // const t = elapsedTime / n;
            if (nv > NumPoints) {
                nv = 0;
                //TODO: Make a loop remove(obj) method. Hashing would be work.
            }
            // const numVertices = Math.floor((t + 1 / numPoints) * numPoints);// const numVertices = Math.floor(t * numPoints);
            tubeGeometry.setDrawRange(0, nv);
        }
        loop.add(tubeGeometry);
        // const n = 0.1;
        // let elapsedTime = 0;
        // tubeGeometry.nextFrame = (delta,_)=>
        // {
        //     elapsedTime += delta;
        //     const t = elapsedTime / n;
        //     if (t > 12) {
        //         elapsedTime = 0;
        //         //TODO: Make a loop remove(obj) method. Hashing would be work.
        //     }
        //     const numVertices = Math.floor((t + 1 / numPoints) * numPoints);// const numVertices = Math.floor(t * numPoints);
        //     tubeGeometry.setDrawRange(0, numVertices);
        // }
        // loop.add(tubeGeometry);
        
  

        scene.add(new THREE.AxesHelper(5));
    }

    // FIXME: THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.
    // reference: https://stackoverflow.com/questions/62183371/threejs-three-buffergeometry-computeboundingsphere-gives-error-nan-position
    // hint: Using undefined will fail in the same way like using NaN. BufferGeometry.computeBoundingSphere() computes the radius based on Vector3.distanceToSquared(). If you call this method with a vector that contains no valid numerical data, NaN will be returned.
    dynamicPlot()
    {
        // Create the points that will make up the curve
        const numPoints = 50;
        const points = [numPoints];
        // x-range [0,]
        for (let i = 0; i <= numPoints; i++) 
        {
            const x = (i / numPoints) * 2 * Math.PI;
            const y = this.f(x);
            points.push(new THREE.Vector2(x, y));
        }

        // Create the line geometry and add it to the scene
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const line = new THREE.Line(lineGeometry, material);
        scene.add(line);

        // Animate the drawing of the curve
        const n = 3;
        let elapsedTime = 0;
        lineGeometry.nextFrame = (delta,_) =>
        {
            elapsedTime += delta;
            const t = elapsedTime / n;
            if (t > 1) {
                elapsedTime = 0;
                //TODO: Make a loop remove(obj) method. Hashing would be work.
            }
            const numVertices = Math.floor(t * numPoints);
            // console.log(numVertices);
            lineGeometry.setDrawRange(0, numVertices);
        }
        loop.add(lineGeometry);
        scene.add(new THREE.AxesHelper(5));
    }

    f(x)
    {
        return Math.sin(x);
    }
    
    addObject(obj)
    {
        loop.add(obj);
        scene.add(obj);
    }

    render() 
    {
        renderer.render(scene, camera);
    }
    
    start()
    {
        loop.start();
    }
    
    stop()
    {
        loop.stop();
    }
}
export {III_DYNAMIC_GRAPHER};