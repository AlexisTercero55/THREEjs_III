// passed by threejs
/**
let uniforms = {
            colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
            colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)}
        }
*/
// uniform vec3 colorA; 
// uniform vec3 colorB; 

varying vec3 vUv;
varying vec3 v_Normal;

vec4 NormalColor();
vec4 mixlColor();

void main() 
{
    float r=1.0, g=0.1, b=0.3, alpha_ = 1.0;
    gl_FragColor = vec4(r, g, b, alpha_);
}

vec4 NormalColor()
{
    return vec4(v_Normal,1.0);
}

vec4 mixlColor()
{
    return vec4(mix(colorA, colorB, vUv.z), 1.0);
}