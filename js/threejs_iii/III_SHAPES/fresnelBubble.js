import * as THREE from 'three';
import FresnelShader from '../shaders/fresnel';

function fresnel_bubble(renderer, scene, type = 'transparent')
{
    /*
        Based on https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Bubble.html
        By: Lee Stemkoski
        Date: July 2013 (three.js v59dev)


        this.refractSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
        scene.add( refractSphereCamera );
    */
    
    var fShader = FresnelShader ;

    // Create cube render target
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);//( 128, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
    cubeRenderTarget.texture.type = THREE.HalfFloatType;


    // Create cube camera
    const refractSphereCamera = new THREE.CubeCamera( 1, 100000, cubeRenderTarget );
    // scene.add( refractSphereCamera );

    // const refractSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
    // scene.add( refractSphereCamera );

    var fresnelUniforms = 
    {
        "mRefractionRatio": { type: "f", value: 1.02 },
        "mFresnelBias": 	{ type: "f", value: 0.1 },
        "mFresnelPower": 	{ type: "f", value: 2.0 },
        "mFresnelScale": 	{ type: "f", value: 1.0 },
        "tCube": 			{ type: "t", value: cubeRenderTarget.texture } //  textureCube }
    };

    // create custom material for the shader
    let customMaterial;
    switch (type) {
        case 'transparent':
            customMaterial = new THREE.ShaderMaterial( 
                {
                    uniforms: 		fresnelUniforms,
                    vertexShader:   fShader.vertexShader,
                    fragmentShader: fShader.fragmentShader,
                }   );
            
            break;
    
        case 'metalic':
            customMaterial = new THREE.MeshStandardMaterial( {
                envMap: cubeRenderTarget.texture,
                roughness: 0.05,
                metalness: 1
            } );
        break;
    }

    // var customMaterial = new THREE.ShaderMaterial( 
    // {
    //     uniforms: 		fresnelUniforms,
    //     vertexShader:   fShader.vertexShader,
    //     fragmentShader: fShader.fragmentShader,
    // }   );

    // const material = new THREE.MeshStandardMaterial( {
    //     // envMap: cubeRenderTarget.texture,
    //     roughness: 0.05,
    //     metalness: 1
    // } );

    // var sphereGeometry = new THREE.SphereGeometry( 2, 64, 32 );
    let sphere = new THREE.Mesh( new THREE.IcosahedronGeometry( 2, 8 ), customMaterial );//new THREE.Mesh( sphereGeometry, customMaterial );
    sphere.position.set(0, 2,0);
    // scene.add(sphere);
    
    refractSphereCamera.position.set(sphere.position.x,
                                    sphere.position.y,
                                    sphere.position.z  );

    sphere.nextFrame = (_,__) =>
    {
        sphere.visible = false;
        refractSphereCamera.update( renderer, scene );
        sphere.visible = true;
    };
    // loop.add(sphere);

    return sphere;

}
export default fresnel_bubble;