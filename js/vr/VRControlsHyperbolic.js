/**
 * @author dmarcos / https://github.com/dmarcos
 with additions by https://github.com/hawksley and https://github.com/henryseg
 */

THREE.VRControls = function ( camera, done ) {
	this.phoneVR = new PhoneVR();

	this._camera = camera;

	this._init = function () {
		var self = this;
		if ( !navigator.mozGetVRDevices && !navigator.getVRDevices ) {
			if ( done ) {
				done("Your browser is not VR Ready");
			}
			return;
		}
		if ( navigator.getVRDevices ) {
			navigator.getVRDevices().then( gotVRDevices );
		} else {
			navigator.mozGetVRDevices( gotVRDevices );
		}
		function gotVRDevices( devices ) {
			var vrInput;
			var error;
			for ( var i = 0; i < devices.length; ++i ) {
				if ( devices[i] instanceof PositionSensorVRDevice ) {
					vrInput = devices[i]
					self._vrInput = vrInput;
					break; // We keep the first we encounter
				}
			}
			if ( done ) {
				if ( !vrInput ) {
				 error = 'HMD not available';
				}
				done( error );
			}
		}
	};

	this._init();

	this.manualRotation = new THREE.Quaternion();

	this.manualControls = {
      65 : {index: 1, sign: 1, active: 0},  // a
      68 : {index: 1, sign: -1, active: 0}, // d
      87 : {index: 0, sign: 1, active: 0},  // w
      83 : {index: 0, sign: -1, active: 0}, // s
      81 : {index: 2, sign: -1, active: 0}, // q
      69 : {index: 2, sign: 1, active: 0},  // e
      38 : {index: 3, sign: 1, active: 0},  // up
      40 : {index: 3, sign: -1, active: 0}, // down
      37 : {index: 4, sign: -1, active: 0}, // left
      39 : {index: 4, sign: 1, active: 0},   // right
      222 : {index: 5, sign: 1, active: 0}, // single quote
      191 : {index: 5, sign: -1, active: 0},   // fwd slash
      73 : {index: 7, sign: -1, active: 0},   // i
      75 : {index: 7, sign: 1, active: 0},   // k
      74 : {index: 6, sign: 1, active: 0},   // j
      76 : {index: 6, sign: -1, active: 0}   // l
    };

	this.manualRotateRate = new Float32Array([0.0, 0.0, 0.0]);
	this.manualMoveRate = new Float32Array([0.0, 0.0, 0.0]);
	this.manualParabolicRate = new Float32Array([0.0, 0.0]);
	this.updateTime = 0;

	this.update = function() {

		var camera = this._camera;
		var vrState = this.getVRState();
		var manualRotation = this.manualRotation;
		var oldTime = this.updateTime;
		var newTime = Date.now();
		this.updateTime = newTime;

		var interval = (newTime - oldTime) * 0.001;

		///do translation
		var m;
		var offset = new THREE.Vector3();
		if (this.manualMoveRate[0] != 0 || this.manualMoveRate[1] != 0 || this.manualMoveRate[2] != 0){
		    offset = getFwdVector().multiplyScalar(0.2 * interval * this.manualMoveRate[0]).add(
		      		   getRightVector().multiplyScalar(0.2 * interval * this.manualMoveRate[1])).add(
		      		   getUpVector().multiplyScalar(0.2 * interval * this.manualMoveRate[2]));
		    m = translateByVector(offset);
		    m.multiply(currentBoost);
		    currentBoost.copy(m);
		    }

		//do parabolic motion
		var m2, parabolicVector;
		if (this.manualParabolicRate[0] != 0 || this.manualParabolicRate[1] != 0){
			parabolicVector = new THREE.Vector2(0.2 * interval * this.manualParabolicRate[0],
												0.2 * interval * this.manualParabolicRate[1]);
		    m2 = parabolicBy2DVector(parabolicVector);
		    m2.multiply(currentBoost);
		    currentBoost.copy(m2);
		    }

		//if outside central cell, move back
		if (fixOutside){
			fixOutsideCentralCell( currentBoost, tilingGens );
		}

		//run to avoid error accumulation

		// currentBoost.elements = fastGramSchmidt( currentBoost.elements );
		currentBoost.elements = gramSchmidt( currentBoost.elements ); //seems more stable near infinity


	  var update = new THREE.Quaternion(this.manualRotateRate[0] * 0.2 * interval,
	                               this.manualRotateRate[1] * 0.2 * interval,
	                               this.manualRotateRate[2] * 0.2 * interval, 1.0);
	  update.normalize();
	  manualRotation.multiplyQuaternions(manualRotation, update);

		if ( camera ) {
			if ( !vrState ) {
				camera.quaternion.copy(manualRotation);
				// camera.position = camera.position.add(offset);
				return;
			}

			// Applies head rotation from sensors data.
			var totalRotation = new THREE.Quaternion();

      if (vrState !== null) {
					var vrStateRotation = new THREE.Quaternion(vrState.hmd.rotation[0], vrState.hmd.rotation[1], vrState.hmd.rotation[2], vrState.hmd.rotation[3]);
	        totalRotation.multiplyQuaternions(manualRotation, vrStateRotation);
      } else {
        	totalRotation = manualRotation;
      }

			camera.quaternion.copy(totalRotation);

			if (vrState.hmd.position !== null) {
				// camera.position.copy( {x: vrState.hmd.position[0], y: vrState.hmd.position[1], z: vrState.hmd.position[2]} ).multiplyScalar( this.scale );
			}
		}
	};

	this.zeroSensor = function() {
		var vrInput = this._vrInput;
		if ( !vrInput ) {
			return null;
		}
		vrInput.zeroSensor();
	};

	this.getVRState = function() {
		var vrInput = this._vrInput;
		var orientation;
		var position;
		var vrState;

		if ( vrInput ) {
			if (vrInput.getState !== undefined) {
				orientation	= vrInput.getState().orientation;
				orientation = [orientation.x, orientation.y, orientation.z, orientation.w];
				position = vrInput.getState().position;
				position = [position.x, position.y, position.z];
			} else {
				orientation	= vrInput.getPose().orientation;
				position = vrInput.getPose().position;
			}
		} else if (this.phoneVR.rotationQuat()) {
			orientation = this.phoneVR.rotationQuat();
			orientation = [orientation.x, orientation.y, orientation.z, orientation.w];
			position = this._defaultPosition;
		} else {
			return null;
		}

		if (orientation == null) {
			return null;
		}
		vrState = {
			hmd : {
				rotation : [
					orientation[0],
					orientation[1],
					orientation[2],
					orientation[3]
				],
				position : [
					position[0],
					position[1],
					position[2]
				]
			}
		};

		return vrState;
	};
};


/*
Listen for double click event to enter full-screen VR mode
*/
document.body.addEventListener( 'dblclick', function() {
  effect.setFullScreen( true );
});

function playPause() {
  if (music.paused) {
    music.play();
  } else{
    music.pause();
  }
}

/*
Listen for keyboard events
*/
function onkey(event) {
  event.preventDefault();

  if (event.keyCode == 90) { // z
    controls.zeroSensor(); //zero rotation
  } else if (event.keyCode == 70 || event.keyCode == 13) { //f or enter
    effect.setFullScreen(true); //fullscreen
  } else if (event.keyCode == 32 || event.keyCode == 80) {//space or p
    playPause();
  }
}

window.addEventListener("keydown", onkey, true);

//hold down keys to do rotations and stuff
function key(event, sign) {
  var control = controls.manualControls[event.keyCode];

  if (control == undefined || sign === 1 && control.active || sign === -1 && !control.active) {
    return;
  }

  control.active = (sign === 1);
  if (control.index <= 2){
    controls.manualRotateRate[control.index] += sign * control.sign;
  }
  else if (control.index <= 5) {
    controls.manualMoveRate[control.index - 3] += sign * control.sign;
  }
  else {
    controls.manualParabolicRate[control.index - 6] += sign * control.sign;
  }
}

document.addEventListener('keydown', function(event) { key(event, 1); }, false);
document.addEventListener('keyup', function(event) { key(event, -1); }, false);

/*
Handle window resizes
*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  effect.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );
