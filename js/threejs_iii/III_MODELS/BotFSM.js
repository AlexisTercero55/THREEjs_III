import * as THREE from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';

/**Templete for especific states (animations) */
class State {//Enter() Exit() Update()
    constructor({
        parent=null,
        stateName='Generic State'
    }={}) {
        this._parent = parent;
        this._Name = stateName;
    }

    get Name()
    {
        return this._Name;
    }
  
    Enter() {}
    Exit() {}
    Update() {}
};

class FSM{
    constructor() {
        this._states = {};//{name:type}
        this._currentState = null;
    }

    _AddState(name, StateType) {
        if (!(StateType.prototype instanceof State)) {
            throw new Error('Error: StateType does not extend State class');
        }
        this._states[name] = StateType;
    }

     /**Change the state of this FSM */
    SetState(name) {
        const prevState = this._currentState;
        
        if (prevState) {
            //if new state is the same state, do nothing.
            if (prevState.Name == name) return;

            // removes the prevState from current state
            prevState.Exit();
        }

        // I'm parent of the new state here
        //instance of specific state
        const state = new this._states[name](this,name);

        // subscribe as current state or action doing
        this._currentState = state;
        // starts the state
        state.Enter(prevState);
    }
    /**Update the animation loop */
    Update(timeElapsed, input) {
        //Updte the current state
        this._currentState?.Update(timeElapsed, input);
    }
}

class AnimationsProxy{
    /**
    `
    animations = {
        name : {
            clip: AnimationAction,
            action: AnimationClip,
        },
    }`
   * @param {Object} animations 
   */
  constructor(animations) {
    this._animations = animations;
  }

  get animations() {
    return this._animations;
  }
}

class CharacterFSM extends FSM{
    constructor(proxy) {// proxy.animations

        if (!(proxy instanceof AnimationsProxy)) {
            throw new Error('Invalid data type for parameter "proxy". Expected instance of AnimationsProxy.');
        }
        super();//_states & _currentState
        this._proxy = proxy;
        this._Init();
    }
    /**
     * Override with calls to add state types like:
     * 
     * this._AddState('idle', IdleState);
     * this._AddState('walk', WalkState);
     * this._AddState('run', RunState);
     * this._AddState('dance', DanceState);
     * 
     * where WalsState extends State class.
     */
    _Init(){
        this._AddState('idle', IdleState); 
        this._AddState('walk', WalkState);
        this._AddState('run', RunState);
        this._AddState('dance', DanceState);
    }
}

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

export class CController{
    constructor(params) { //{model,scene, camera}
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
            new AnimationsProxy(this._animations));
    
        this._LoadModels();
    }

    _LoadModels() {
        const loader = new FBXLoader();
        loader.setPath('./models/');
        loader.load(this._params.model, (fbx) => {
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
          loader.setPath('./models/botAnimations/');
          loader.load('Dwarf Idle.fbx', (FBX) => { _OnLoadAnimation('idle', FBX); });
          loader.load('Macarena Dance.fbx', (FBX) => { _OnLoadAnimation('dance', FBX); });
          loader.load('Standard Run.fbx', (FBX) => { _OnLoadAnimation('run', FBX); });
          loader.load('Walking.fbx', (FBX) => { _OnLoadAnimation('walk', FBX); });
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
}


class DanceState extends State {
    constructor(parent,stateName) {//_FinishedCallback
      super({parent,stateName});

      this._FinishedCallback = () => {
          this._Finished();
      }

      // binding for walk, pose and run
      this.runBTN = document.getElementById('run-btn');
      this.runClickHandler = ()=>{
        this._parent.SetState('run');
      };
      this.runBTN.addEventListener('click', this.runClickHandler);

      this.walkBTN = document.getElementById('walk-btn');
      this.walkClickHandler = ()=>{
        this._parent.SetState('walk');
      };
      this.walkBTN.addEventListener('click', this.walkClickHandler);

      this.poseBTN = document.getElementById('pose-btn');
      this.poseClickHandler = ()=>{
        this._parent.SetState('idle');
      };
      this.poseBTN.addEventListener('click', this.poseClickHandler);

        
    }
  
    Enter(prevState) {
        const curAction = this._parent._proxy._animations[this._Name].action;
        const mixer = curAction.getMixer();
        mixer.addEventListener('finished', this._FinishedCallback);
  
        if (prevState) {
          const prevAction = this._parent._proxy._animations[prevState.Name].action;
  
          curAction.reset();  
          curAction.setLoop(THREE.LoopOnce, 1);
          curAction.clampWhenFinished = true;
          curAction.crossFadeFrom(prevAction, 0.2, true);
        } 
        
        curAction.play();
    }
  
    _Finished() {
        this._Cleanup();
        this._parent.SetState('idle');
    }
  
    _Cleanup() {
        const action = this._parent._proxy._animations['dance'].action;
        
        action.getMixer().removeEventListener('finished');
    }
  
    Exit() {
      this._Cleanup();
      this.runBTN.removeEventListener('click',this.runClickHandler);
      this.walkBTN.removeEventListener('click',this.walkClickHandler);
      this.poseBTN.removeEventListener('click',this.poseClickHandler);
    }
  
    Update(_) {
    }
  };
  
  
class WalkState extends State {
    constructor(parent,stateName) {
      super({parent,stateName});
      //may be eventListener requiered for run state.
      this.danceBTN = document.getElementById('dance-btn');
      this.dandeClickHandler = ()=>{
        this._parent.SetState('dance');
      };
      this.danceBTN.addEventListener('click', this.dandeClickHandler);

      this.poseBTN = document.getElementById('pose-btn');
      this.poseClickHandler = ()=>{
        this._parent.SetState('idle');
      };
      this.poseBTN.addEventListener('click', this.poseClickHandler);

      this.runBTN = document.getElementById('run-btn');
      this.runClickHandler = ()=>{
        this._parent.SetState('run');
      };
      this.runBTN.addEventListener('click', this.runClickHandler);


    }
  
    Enter(prevState) {
      const curAction = this._parent._proxy._animations[this._Name].action;
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
      } 
      curAction.play();
    }
  
    Exit() {
      this.danceBTN.removeEventListener('click',this.dandeClickHandler);
      this.poseBTN.removeEventListener('click',this.poseClickHandler);
      this.runBTN.removeEventListener('click',this.runClickHandler);
    }
  
    Update(timeElapsed, input) {
      // if (input._keys.forward || input._keys.backward) {
      //   if (input._keys.shift) {
      //       this._parent.SetState('run');
      //   }
        return;
      // }
  
      // this._parent.SetState('idle');

    }
};
  
  
class RunState extends State {
    constructor(parent,stateName) {
        super({parent,stateName});

      this.walkBTN = document.getElementById('walk-btn');
      this.walkClickHandler = ()=>{
        this._parent.SetState('walk');
      };
      this.walkBTN.addEventListener('click', this.walkClickHandler);

      this.poseBTN = document.getElementById('pose-btn');
      this.poseClickHandler = ()=>{
        this._parent.SetState('idle');
      };
      this.poseBTN.addEventListener('click', this.poseClickHandler);

      this.danceBTN = document.getElementById('dance-btn');
      this.dandeClickHandler = ()=>{
        this._parent.SetState('dance');
      };
      this.danceBTN.addEventListener('click', this.dandeClickHandler);


    }

    Enter(prevState) {
      const curAction = this._parent._proxy._animations[this._Name].action;
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
        
      } 
      curAction.play();
    }
  
    Exit() {
      this.walkBTN.removeEventListener('click',this.walkClickHandler);
      this.poseBTN.removeEventListener('click',this.poseClickHandler);
      this.danceBTN.removeEventListener('click',this.dandeClickHandler);
    }
  
    Update(timeElapsed, input) {
      // if (input._keys.forward || input._keys.backward) {
      //   if (!input._keys.shift) {
      //       this._parent.SetState('walk');
      //   }
        return;
      // }
  
      // this._parent.SetState('idle');
    }
};
  
  
class IdleState extends State {
    constructor(parent,stateName) {
      super({parent,stateName});

      this.danceBTN = document.getElementById('dance-btn');
      this.dandeClickHandler = ()=>{
        this._parent.SetState('dance');
      };
      this.danceBTN.addEventListener('click', this.dandeClickHandler);

      this.walkBTN = document.getElementById('walk-btn');
      this.walkClickHandler = ()=>{
        this._parent.SetState('walk');
      };
      this.walkBTN.addEventListener('click', this.walkClickHandler);

      this.runBTN = document.getElementById('run-btn');
      this.runClickHandler = ()=>{
        this._parent.SetState('run');
      };
      this.runBTN.addEventListener('click', this.runClickHandler);



    }
  
    Enter(prevState) {
      const currentAction = this._parent._proxy._animations[this._Name].action;
      if (prevState) {
        const prevAction = this._parent._proxy._animations[prevState.Name].action;
        currentAction.time = 0.0;
        currentAction.enabled = true;
        currentAction.setEffectiveTimeScale(1.0);
        currentAction.setEffectiveWeight(1.0);
        currentAction.crossFadeFrom(prevAction, 0.5, true);
      } 
      currentAction.play();
    }
  
    Exit() {
      this.danceBTN.removeEventListener('click',this.dandeClickHandler);
      this.walkBTN.removeEventListener('click',this.walkClickHandler);
      this.runBTN.removeEventListener('click',this.runClickHandler);
    }
  
    /**Checks for set state */
    Update(_, input) {
      if (input._keys.forward || input._keys.backward) {
        this._parent.SetState('walk');
      } else if (input._keys.space) {
        this._parent.SetState('dance');
      }
    }
};