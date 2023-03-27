import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
async function glbLoad(modelURL,
                       position= new THREE.Vector3()) 
{

    const assetLoader = new GLTFLoader();
    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
    // assetLoader.setDRACOLoader( dracoLoader );

    var GLBfile;
    GLBfile = await assetLoader.loadAsync(modelURL,
        // called while loading is progressing
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        }
    );

    const model = GLBfile.scene;//THREE.Group
    model.position.copy(position);
    // model.rotateY(-Math.PI)
    const clips = GLBfile.animations;
    const mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(clips[0]);
    action.play();
    // named animations view on blender
    // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
    // const action = mixer.clipAction(clip);
    // action.play();

    // Play all animations at the same time
    // clips.forEach(function(clip) {
    //     const action = mixer.clipAction(clip);
    //     action.play();
    // });
    model.nextFrame = (delta) => 
    {
        mixer.update(delta);
    }
    // loop.add(model);
    // scene.add(model);


    return model;//THREE.Group
    // assetLoader.load(
    //     // resource URL
    //     modelURL, 
    //     // called when the resource is loaded
    // function(gltf) 
    // {
    //     model = gltf.scene;
    //     model.position.set(v.x,0.8,v.z);
    //     // model.scale.set(10,10,10);
    //     model.rotateY(-Math.PI)

        // const clips = gltf.animations;
        // const mixer = new THREE.AnimationMixer(model);
        // const action = mixer.clipAction(clips[0]);
        // action.play();

        // named animations view on blender
        // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
        // const action = mixer.clipAction(clip);
        // action.play();

        // Play all animations at the same time
        // clips.forEach(function(clip) {
        //     const action = mixer.clipAction(clip);
        //     action.play();
        // });

    //     model.nextFrame = (delta) => 
    //     {
    //         mixer.update(delta);
    //     }
    //     loop.add(model);
    //     scene.add(model);

    // }, 
    // // called while loading is progressing
    // function ( xhr ) {

    //     console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    // },
    // // called when loading has errors
    // function(error) {
    //     console.error('Error on load GLTF model: ',error);
    // });
    // return GLBfile;
}
export default glbLoad;