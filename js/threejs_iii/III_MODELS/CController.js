/**
 * Code by @simondevyoutube
 * https://github.com/simondevyoutube/ThreeJS_Tutorial_CharacterController
 * 
 */
import * as THREE from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

class BasicCharacterControllerProxy {
    
  /**
    //! TS interface

  `
  animations = {
    name : {
        clip: AnimationAction,
        action: AnimationClip,
      },
  }`
   * @param {Object} animations 
   * 
   */
  constructor(animations) {

    // console.log(animations);
    this._animations = animations;
  }

  get animations() {
    return this._animations;
  }
};

export class BasicCharacterController {
    constructor(params) { //{scene, camera}
      this._Init(params);
    }
  
    _Init(params) {
      this._params = params;
      this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
      this._acceleration = new THREE.Vector3(0.25, 0.25, 25.0);
      this._velocity = new THREE.Vector3(0, 0, 0);
  
      this._animations = {};
      this._input = new BasicCharacterControllerInput();
      this._stateMachine = new CharacterFSM(
          new BasicCharacterControllerProxy(this._animations));
  
      this._LoadModels();
    }
  
    _LoadModels() {
      const loader = new FBXLoader();
      loader.setPath('./models/');
      loader.load('mremireh_o_desbiens.fbx', (fbx) => {
        fbx.scale.setScalar(0.05);
        fbx.rotateY(-Math.PI);
        fbx.traverse(c => {
          c.castShadow = true;
        });
  
        this._target = fbx;
        this._params.scene.add(this._target);
  
        // this._target:Object3D - the object whose animations shall be played by this mixer.
        this._mixer = new THREE.AnimationMixer(this._target);
  
        // for each animation file (FBX)
        const _OnLoadAnimation = (animName, FBX ) => {

          // get an AnimationClip
          const clip = FBX.animations[0];
          // Schedule animation playback
          const action = this._mixer.clipAction(clip);//:AnimationAction
          //animations = {animName:{clip,action},...,{}}
          this._animations[animName] = {
            clip: clip,
            action: action,
          };
        };

        this._manager = new THREE.LoadingManager();
        this._manager.onLoad = () => {
          //setting the first state when preset state are available
          this._stateMachine.SetState('idle');
        };
  
        //Once character is loaded then load its animations from FBX files.
        const loader = new FBXLoader(this._manager);
        // loader.setPath('./models/');
        loader.load('./models/walk.fbx', (a) => { _OnLoadAnimation('walk', a); });
        loader.load('./models/run.fbx', (a) => { _OnLoadAnimation('run', a); });
        loader.load('./models/idle.fbx', (a) => { _OnLoadAnimation('idle', a); });
        loader.load('./models/dance.fbx', (a) => { _OnLoadAnimation('dance', a); });
      });
    }
  
    Update(timeInSeconds) {
      if (!this._target) {
        return;
      }
  
      // update the current state | keep walking and traslating.
      this._stateMachine.Update(timeInSeconds, this._input);
  
      //Velocity update  -----------------------------------------------
      // Calculate the frame deceleration based on the object's velocity
      // This is a measure of how much the object's velocity is slowing down due to friction or other forces.
      const velocity = this._velocity;//:THREE.Vector3
       // The deceleration is computed by multiplying the object's velocity with the deceleration vector.
      const frameDecceleration = new THREE.Vector3(
          velocity.x * this._decceleration.x,// (-0.0005, -0.0001, -5.0)
          velocity.y * this._decceleration.y,
          velocity.z * this._decceleration.z
      );
      // Multiply the frame deceleration by the time since the last frame to get a frame-specific deceleration value
      // {x,y,z}*dt = {x*dt,y*dt,z*dt}
      // Apply a damping effect to the deceleration in the z-axis direction to simulate ground friction
      frameDecceleration.multiplyScalar(timeInSeconds);
      frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
          Math.abs(frameDecceleration.z), Math.abs(velocity.z));
  
      // Update the object's velocity based on the frame deceleration
      velocity.add(frameDecceleration);
      //----------------------------------------------------------------

      // Calculate the acceleration based on user input
      const currentAcceleration = this._acceleration.clone()
      // If shift is pressed, double the acceleration;
      if (this._input._keys.shift) {
        currentAcceleration.multiplyScalar(2.0);
      }
      // If the object is in the "dance" state, set acceleration to zero
      if (this._stateMachine._currentState?.Name == 'dance') {
        currentAcceleration.multiplyScalar(0.0);
      }
      // Update the object's velocity based on user input
      if (this._input._keys.forward) {
        velocity.z += currentAcceleration.z * timeInSeconds;
      }
      if (this._input._keys.backward) {
        velocity.z -= currentAcceleration.z * timeInSeconds;
      }

      // Orientation Update _______________________________________________________
      // Get the target object and its current orientation
      const controlObject = this._target;//:THREE.Group
      const _Q = new THREE.Quaternion();
      const _A = new THREE.Vector3();

      // Quaternions are used in three.js to represent rotations.
      const _R = controlObject.quaternion.clone();

      // Rotate the object left around its vertical axis
      if (this._input._keys.left) {
        _A.set(0, 1, 0);//THREE.Vector3
        _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      // Rotate the object right around its vertical axis
      if (this._input._keys.right) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      // Update the object's orientation
      controlObject.quaternion.copy(_R);
      //_______________________________________________________________________________

      //Position update -----------------------------------------------------------------
      // Calculate the object's new position based on its velocity and orientation
      const oldPosition = new THREE.Vector3();
      oldPosition.copy(controlObject.position);
  
      const forward = new THREE.Vector3(0, 0, 1);
      forward.applyQuaternion(controlObject.quaternion);
      forward.normalize();
  
      const sideways = new THREE.Vector3(1, 0, 0);
      sideways.applyQuaternion(controlObject.quaternion);
      sideways.normalize();
  
      sideways.multiplyScalar(velocity.x * timeInSeconds);
      forward.multiplyScalar(velocity.z * timeInSeconds);
      // Update the object's position
      controlObject.position.add(forward);
      controlObject.position.add(sideways);
  
      //! review to delete for duplicate
      // oldPosition.copy(controlObject.position);
      //-------------------------------------------------------------------------------
      
      
      // Update the object's animation mixer (if one exists)
      if (this._mixer) {
        this._mixer.update(timeInSeconds);
      }
    }
};
  
class BasicCharacterControllerInput {
  constructor() {
    this._Init();    
  }

  _Init() {
    this._keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };
    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  }

  _onKeyDown(event) {
    switch (event.keyCode) {
      case 87: // w
        this._keys.forward = true;
        break;
      case 65: // a
        this._keys.left = true;
        break;
      case 83: // s
        this._keys.backward = true;
        break;
      case 68: // d
        this._keys.right = true;
        break;
      case 32: // SPACE
        this._keys.space = true;
        break;
      case 16: // SHIFT
        this._keys.shift = true;
        break;
    }
  }

  _onKeyUp(event) {
    switch(event.keyCode) {
      case 87: // w
        this._keys.forward = false;
        break;
      case 65: // a
        this._keys.left = false;
        break;
      case 83: // s
        this._keys.backward = false;
        break;
      case 68: // d
        this._keys.right = false;
        break;
      case 32: // SPACE
        this._keys.space = false;
        break;
      case 16: // SHIFT
        this._keys.shift = false;
        break;
    }
  }
};
  
  
/**
 * This is a Finite State Machine (FSM) class that allows for managing and changing states of an object in a game. The FSM is a design pattern commonly used in game development to represent the behavior of an object as a set of states and transitions between them.

The class has three main methods: _AddState(), SetState(), and Update(). _AddState() is a private method that adds a new state to the FSM. SetState() method changes the current state of the FSM to the state with the given name. Update() method is called every frame to update the current state.

The FSM class keeps track of its current state and a dictionary of all available states. When SetState() method is called, it checks if the new state is different from the current state, and if so, it exits the previous state, creates a new instance of the requested state, sets it as the current state, and calls its Enter() method.

The FSM also has an Update() method that updates the current state every frame by calling its Update() method. This allows for the execution of state-specific behavior every frame.
 */
class FiniteStateMachine {
  constructor() {
    this._states = {};//{name:type}
    this._currentState = null;
  }
  
  _AddState(name, type) {
    this._states[name] = type;
  }

  /**Change the state of this FSM */
  SetState(name) {
    const prevState = this._currentState;
    
    if (prevState) {
      if (prevState.Name == name) {
        return;//if new state is the same state, do nothing.
      }
      prevState.Exit();
    }

    // I'm parent of the new state here
    const state = new this._states[name](this);

    this._currentState = state;
    state.Enter(prevState);
  }

  /**Update the animation loop */
  Update(timeElapsed, input) {
    this._currentState?.Update(timeElapsed, input);
    //may be: this._currentState?.Update(timeElapsed, input);
    // if (this._currentState) {
    //   this._currentState.Update(timeElapsed, input);
    // }
  }
};
  
  
/**
 * Initialize the custom states for 
 * manipulate a 3D character model.
 * * IdleState
 * * WalkState
 * * RunState
 * * DanceState
 */
class CharacterFSM extends FiniteStateMachine {
  constructor(proxy) {// proxy.animations

    if (!(proxy instanceof BasicCharacterControllerProxy)) {
        throw new Error('Invalid data type for parameter "proxy". Expected instance of BasicCharacterControllerProxy.');
    }
    super();//_states & _currentState
    this._proxy = proxy;
    this._Init();
  }

  _Init() {
    this._AddState('idle', IdleState);
    this._AddState('walk', WalkState);
    this._AddState('run', RunState);
    this._AddState('dance', DanceState);
  }
};
  
  
/**Templete for especific animations */
class State {//Enter() Exit() Update()
  constructor(parent) {
      this._parent = parent;
  }

  Enter() {}
  Exit() {}
  Update() {}
};
  
  
class DanceState extends State {
  constructor(parent) {//_FinishedCallback
      super(parent);

      this._FinishedCallback = () => {
          this._Finished();
      }
  }

  get Name() {
      return 'dance';
  }

  Enter(prevState) {
      const curAction = this._parent._proxy._animations['dance'].action;
      const mixer = curAction.getMixer();
      mixer.addEventListener('finished', this._FinishedCallback);

      if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;

      curAction.reset();  
      curAction.setLoop(THREE.LoopOnce, 1);
      curAction.clampWhenFinished = true;
      curAction.crossFadeFrom(prevAction, 0.2, true);
      curAction.play();
      } else {
      curAction.play();
      }
  }

  _Finished() {
      this._Cleanup();
      this._parent.SetState('idle');
  }

  _Cleanup() {
      const action = this._parent._proxy._animations['dance'].action;
      
      action.getMixer().removeEventListener('finished', this._CleanupCallback);
  }

  Exit() {
      this._Cleanup();
  }

  Update(_) {
  }
};


class WalkState extends State {
  constructor(parent) {
      super(parent);
  }

  get Name() {
      return 'walk';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['walk'].action;
    if (prevState) {
    const prevAction = this._parent._proxy._animations[prevState.Name].action;

    curAction.enabled = true;

    if (prevState.Name == 'run') {
        const ratio = curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
    } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
    }

    curAction.crossFadeFrom(prevAction, 0.5, true);
    curAction.play();
    } else {
    curAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (input._keys.forward || input._keys.backward) {
    if (input._keys.shift) {
        this._parent.SetState('run');
    }
    return;
    }

    this._parent.SetState('idle');
  }
};


class RunState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'run';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['run'].action;
    if (prevState) {
    const prevAction = this._parent._proxy._animations[prevState.Name].action;

    curAction.enabled = true;

    if (prevState.Name == 'walk') {
        const ratio = curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
    } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
    }

    curAction.crossFadeFrom(prevAction, 0.5, true);
    curAction.play();
    } else {
    curAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (input._keys.forward || input._keys.backward) {
    if (!input._keys.shift) {
        this._parent.SetState('walk');
    }
    return;
    }

    this._parent.SetState('idle');
  }
};


class IdleState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'idle';
  }

  Enter(prevState) {
    const idleAction = this._parent._proxy._animations['idle'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;
      idleAction.time = 0.0;
      idleAction.enabled = true;
      idleAction.setEffectiveTimeScale(1.0);
      idleAction.setEffectiveWeight(1.0);
      idleAction.crossFadeFrom(prevAction, 0.5, true);
      idleAction.play();
    } else {
      idleAction.play();
    }
  }

  Exit() {}

  Update(_, input) {
    if (input._keys.forward || input._keys.backward) {
      this._parent.SetState('walk');
    } else if (input._keys.space) {
      this._parent.SetState('dance');
    }
  }
};

// class CharacterControllerDemo {
//     constructor() {
//       this._Initialize();
//     }
  
//     _Initialize() {
//       this._threejs = new THREE.WebGLRenderer({
//         antialias: true,
//       });
//       this._threejs.outputEncoding = THREE.sRGBEncoding;
//       this._threejs.shadowMap.enabled = true;
//       this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
//       this._threejs.setPixelRatio(window.devicePixelRatio);
//       this._threejs.setSize(window.innerWidth, window.innerHeight);
  
//       document.body.appendChild(this._threejs.domElement);
  
//       window.addEventListener('resize', () => {
//         this._OnWindowResize();
//       }, false);
  
//       const fov = 60;
//       const aspect = 1920 / 1080;
//       const near = 1.0;
//       const far = 1000.0;
//       this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//       this._camera.position.set(25, 10, 25);
  
//       this._scene = new THREE.Scene();
  
//       let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
//       light.position.set(-100, 100, 100);
//       light.target.position.set(0, 0, 0);
//       light.castShadow = true;
//       light.shadow.bias = -0.001;
//       light.shadow.mapSize.width = 4096;
//       light.shadow.mapSize.height = 4096;
//       light.shadow.camera.near = 0.1;
//       light.shadow.camera.far = 500.0;
//       light.shadow.camera.near = 0.5;
//       light.shadow.camera.far = 500.0;
//       light.shadow.camera.left = 50;
//       light.shadow.camera.right = -50;
//       light.shadow.camera.top = 50;
//       light.shadow.camera.bottom = -50;
//       this._scene.add(light);
  
//       light = new THREE.AmbientLight(0xFFFFFF, 0.25);
//       this._scene.add(light);
  
//       const controls = new OrbitControls(
//         this._camera, this._threejs.domElement);
//       controls.target.set(0, 10, 0);
//       controls.update();
  
//       const loader = new THREE.CubeTextureLoader();
//       const texture = loader.load([
//           './resources/posx.jpg',
//           './resources/negx.jpg',
//           './resources/posy.jpg',
//           './resources/negy.jpg',
//           './resources/posz.jpg',
//           './resources/negz.jpg',
//       ]);
//       texture.encoding = THREE.sRGBEncoding;
//       this._scene.background = texture;
  
//       const plane = new THREE.Mesh(
//           new THREE.PlaneGeometry(100, 100, 10, 10),
//           new THREE.MeshStandardMaterial({
//               color: 0x808080,
//             }));
//       plane.castShadow = false;
//       plane.receiveShadow = true;
//       plane.rotation.x = -Math.PI / 2;
//       this._scene.add(plane);
  
//       this._mixers = [];
//       this._previousRAF = null;
  
//       this._LoadAnimatedModel();
//       this._RAF();
//     }
  
//     _LoadAnimatedModel() {
//       const params = {
//         camera: this._camera,
//         scene: this._scene,
//       }
//       this._controls = new BasicCharacterController(params);
//     }
  
//     _LoadAnimatedModelAndPlay(path, modelFile, animFile, offset) {
//       const loader = new FBXLoader();
//       loader.setPath(path);
//       loader.load(modelFile, (fbx) => {
//         fbx.scale.setScalar(0.1);
//         fbx.traverse(c => {
//           c.castShadow = true;
//         });
//         fbx.position.copy(offset);
  
//         const anim = new FBXLoader();
//         anim.setPath(path);
//         anim.load(animFile, (anim) => {
//           const m = new THREE.AnimationMixer(fbx);
//           this._mixers.push(m);
//           const idle = m.clipAction(anim.animations[0]);
//           idle.play();
//         });
//         this._scene.add(fbx);
//       });
//     }
  
//     _LoadModel() {
//       const loader = new GLTFLoader();
//       loader.load('./resources/thing.glb', (gltf) => {
//         gltf.scene.traverse(c => {
//           c.castShadow = true;
//         });
//         this._scene.add(gltf.scene);
//       });
//     }
  
//     _OnWindowResize() {
//       this._camera.aspect = window.innerWidth / window.innerHeight;
//       this._camera.updateProjectionMatrix();
//       this._threejs.setSize(window.innerWidth, window.innerHeight);
//     }
  
//     _RAF() {
//       requestAnimationFrame((t) => {
//         if (this._previousRAF === null) {
//           this._previousRAF = t;
//         }
  
//         this._RAF();
  
//         this._threejs.render(this._scene, this._camera);
//         this._Step(t - this._previousRAF);
//         this._previousRAF = t;
//       });
//     }
  
//     _Step(timeElapsed) {
//       const timeElapsedS = timeElapsed * 0.001;
//       if (this._mixers) {
//         this._mixers.map(m => m.update(timeElapsedS));
//       }
  
//       if (this._controls) {
//         this._controls.Update(timeElapsedS);
//       }
//     }
//   }
  