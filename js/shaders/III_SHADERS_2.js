/**
 * ...::: THREEjs_III :::...
 * 04/02/2026 - CDMX/México
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as THREE from 'three';
import III_SPACE from "../threejs_iii/BASE/III_Space";
import floor from "../threejs_iii/III_Primitives/FLOOR";
import sky from "../threejs_iii/III_BACKGROUNDS/III_SKY";
import fresnel_bubble from "../threejs_iii/III_SHAPES/fresnelBubble";

export default class III_SHADERS_2 extends III_SPACE
{
    constructor(container){
        super(container,
            {
                SceneRotation:true,
                POV:{x:6,y:6,z:6},
            });
    }

    createObjects()
    {
        let uniforms = {
			amplitude: {
				type: 'f', // a float
				value: 0
			}
		};
	
        let material =  new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: this.fragmentShader(),
            vertexShader: this.vertexShader(),
        });

        let geometry = new THREE.SphereGeometry(1, 30, 30);
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 2;
        this.addObject(mesh);

        this.addObject(sky());
        this.addObject(floor());
        this.axis();
    }

    vertexShader() 
    {
        return ["uniform float amplitude;",
		           "attribute float displacement;", 
		           "varying vec3 vNormal;",
		            "void main() {",
		            "vNormal = normal;",
		            "vec3 newPosition = position + normal * vec3(displacement * amplitude);",
				    "gl_Position = projectionMatrix *",
				                  "modelViewMatrix *",
				                  "vec4(newPosition,1.0);",
				   "}"].join("\n");
    }

    fragmentShader() {
        
        return ["varying vec3 vNormal;",
		             "void main() {",
		             "vec3 light = vec3(0.5,0.2,1.0);",
		             "light = normalize(light);",
		             "float dProd = max(0.0, dot(vNormal, light));",
		             "gl_FragColor = vec4(dProd, dProd, dProd, 1.0);",
				   "}"].join("\n");
    }
}

