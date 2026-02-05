import * as THREE from 'three';
import FresnelShader from '../shaders/fresnel';

/**
 * Creates a Fresnel bubble effect using a cube camera and custom materials.
 * 
 * @param {THREE.WebGLRenderer} renderer - The WebGL renderer used to render the scene.
 * @param {THREE.Scene} scene - The scene to which the Fresnel bubble will be added.
 * @param {string} [type='transparent'] - The type of material to use for the bubble. 
 *                                         Options are 'transparent' (uses a ShaderMaterial) 
 *                                         or 'metalic' (uses a MeshStandardMaterial).
 * @returns {THREE.Mesh} - The Fresnel bubble mesh with an update function for rendering.
 */
function fresnel_bubble(renderer, scene, type = 'transparent', mainCamera = null)
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

    // --- Layer-based exclusion setup ---
    // Put the sphere on layer 1 so it won't appear in the environment capture
    sphere.layers.set(1);

    // Make the cube camera render both the environment (layer 0)
    // and bubble layer (layer 1). We'll temporarily hide the current
    // sphere during capture so it doesn't appear in its own cubemap,
    // but other spheres (also on layer 1) will be captured.
    refractSphereCamera.layers.enable(0);
    refractSphereCamera.layers.enable(1);

    // If the main camera is provided, enable layer 1 on it so the main render can see the sphere.
    // If you don't pass `mainCamera`, ensure you enable layer 1 on your main camera elsewhere:
    // `mainCamera.layers.enable(1);`
    if (mainCamera) {
        mainCamera.layers.enable(1);
    }

    // Keep the cube camera co-located with the sphere; update position each frame below.
    refractSphereCamera.position.copy(sphere.position);

    sphere.nextFrame = (_,__) =>
    {
        // Sync cube camera position with the sphere in case the sphere moves
        refractSphereCamera.position.copy(sphere.position);

        // Hide only this sphere while updating the cubemap so it doesn't
        // appear in its own reflection. Other spheres (also on layer 1)
        // remain visible and will be captured, preserving mutual reflections.
        const prevVisible = sphere.visible;
        sphere.visible = false;
        refractSphereCamera.update(renderer, scene);
        sphere.visible = prevVisible;
    };
    // loop.add(sphere);

    return sphere;

}
export default fresnel_bubble;