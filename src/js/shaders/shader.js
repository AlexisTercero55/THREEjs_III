import * as THREE from 'three';

// fist shader
export function vertexShader()
{
    return `
    varying vec3 v_Normal;
    void main() 
    {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        v_Normal = normal;
    }
    `;
  }

export function fragmentShader()
{
    return `
    varying vec3 v_Normal;
    void main() 
    {
        gl_FragColor = vec4(v_Normal,1.0);
    }
    `;
}

export function RGBNormalMaterial()
{
    let uniforms = {
        colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
        colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)}
    }
    return material =  new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader(),
        vertexShader: vertexShader(),
    });
}