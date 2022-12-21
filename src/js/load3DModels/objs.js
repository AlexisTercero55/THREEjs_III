import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
export function glbLoad(scene, loop,n,v) 
{
    const monkeyUrl = new URL('./models/mech_drone.glb', import.meta.url);
        // log(monkeyUrl);
        const assetLoader = new GLTFLoader();
        var model;
        assetLoader.load(monkeyUrl.href, function(gltf) 
        {
            model = gltf.scene;
            model.position.set(v.x,0.8,v.z);
            model.scale.set(10,10,10);
            model.rotateY(-Math.PI)

            const clips = gltf.animations;
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
            loop.add(model);
            scene.add(model);

        }, undefined, function(error) {
            console.error(error);
        });
        return model;
}