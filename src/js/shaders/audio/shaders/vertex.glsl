varying vec3 v_Normal;
varying vec3 vUv; 

void main() 
{
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
    
    v_Normal = normal;
    vUv = position;
}