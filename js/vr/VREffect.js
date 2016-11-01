/**
 * @author dmarcos / https://github.com/dmarcos
 * @author hawksley / https://github.com/hawksley (added phone VR support, and fixed full screen for all devices)
 *
 * It handles stereo rendering
 * If mozGetVRDevices and getVRDevices APIs are not available it gracefuly falls back to a
 * regular renderer
 *
 * The HMD supported is the Oculus DK1 and The Web API doesn't currently allow
 * to query for the display resolution (only the chrome API allows it).
 * The dimensions of the screen are temporarly hardcoded (1280 x 800).
 *
 * For VR mode to work it has to be used with the Oculus enabled builds of Firefox or Chrome:
 *
 * Firefox:
 *
 * OSX: http://people.mozilla.com/~vladimir/vr/firefox-33.0a1.en-US.mac.dmg
 * WIN: http://people.mozilla.com/~vladimir/vr/firefox-33.0a1.en-US.win64-x86_64.zip
 *
 * Chrome builds:
 *
 * https://drive.google.com/folderview?id=0BzudLt22BqGRbW9WTHMtOWMzNjQ&usp=sharing#list
 *
 */
THREE.VREffect = function ( renderer, done ) {

	var cameraLeft = new THREE.PerspectiveCamera();
	cameraLeft.layers.enable( 1 );

	var cameraRight = new THREE.PerspectiveCamera();
	cameraRight.layers.enable( 2 );

	var eyeTranslationL = new THREE.Vector3();
	var eyeTranslationR = new THREE.Vector3();
	var renderRectL, renderRectR;
	var eyeFOVL, eyeFOVR;

	this._renderer = renderer;

	this._init = function() {
		var self = this;

		// default some stuff for mobile VR
		self.phoneVR = new PhoneVR();
		self.leftEyeTranslation = { x: -0.03200000151991844, y: -0, z: -0, w: 0 };
		self.rightEyeTranslation = { x: 0.03200000151991844, y: -0, z: -0, w: 0 };
		self.leftEyeFOV = { upDegrees: 53.04646464878503, rightDegrees: 47.52769258067174, downDegrees: 53.04646464878503, leftDegrees: 46.63209579904155 };
		self.rightEyeFOV = { upDegrees: 53.04646464878503, rightDegrees: 46.63209579904155, downDegrees: 53.04646464878503, leftDegrees: 47.52769258067174 };


		if (!navigator.getVRDisplays && !navigator.mozGetVRDevices && !navigator.getVRDevices) {
			if ( done ) {
				done("Your browser is not VR Ready");
			}
			return;
		}
		if (navigator.getVRDisplays) {
			navigator.getVRDisplays().then( gotVRDisplay );
		}else if ( navigator.getVRDevices ) {
			navigator.getVRDevices().then( gotVRDevices );
		} else {
			navigator.mozGetVRDevices( gotVRDevices );
		}

		function gotVRDisplay( devices ) {
			var vrHMD;
			var error;
			for ( var i = 0; i < devices.length; ++i ) {
				if ( devices[i] instanceof VRDisplay ) {
					vrHMD = devices[i];
					self._vrHMD = vrHMD;
					var parametersLeft = vrHMD.getEyeParameters( "left" );
					var parametersRight = vrHMD.getEyeParameters( "right" );
					self.leftEyeTranslation = parametersLeft.offset;
					self.rightEyeTranslation = parametersRight.offset;
					self.leftEyeFOV = parametersLeft.fieldOfView;
					self.rightEyeFOV = parametersRight.fieldOfView;
					break; // We keep the first we encounter
				}
			}

			if ( done ) {
				if ( !vrHMD ) {
				 error = 'HMD not available';
				}
				done( error );
			}
		}

		function gotVRDevices( devices ) {
			var vrHMD;
			var error;
			for ( var i = 0; i < devices.length; ++i ) {
				if ( devices[i] instanceof HMDVRDevice ) {
					vrHMD = devices[i];
					self._vrHMD = vrHMD;
					var parametersLeft = vrHMD.getEyeParameters( "left" );
					var parametersRight = vrHMD.getEyeParameters( "right" );
					self.leftEyeTranslation = parametersLeft.eyeTranslation;
					self.rightEyeTranslation = parametersRight.eyeTranslation;
					self.leftEyeFOV = parametersLeft.recommendedFieldOfView;
					self.rightEyeFOV = parametersRight.recommendedFieldOfView;
					break; // We keep the first we encounter
				}
			}

			if ( done ) {
				if ( !vrHMD ) {
				 error = 'HMD not available';
				}
				done( error );
			}
		}
	};

	this._init();

	this.render = function ( scene, camera ) {
		var renderer = this._renderer;
		var vrHMD = this._vrHMD;
		renderer.setScissorTest( false );
		// VR render mode if HMD is available
		if ( vrHMD ) {
			this.renderStereo.apply( this, arguments );
			if (vrHMD.submitFrame !== undefined) {
				vrHMD.submitFrame();
			}
			return;
		}

		if (this.phoneVR.deviceAlpha !== null) { //default to stereo render for devices with orientation sensor, like mobile
			this.renderStereo.apply( this, arguments );
			return;
		}

		// Regular render mode if not HMD
		renderer.render.apply( this._renderer, arguments );
	};

	this.renderStereo = function( scene, camera, renderTarget, forceClear ) {
		var renderer = this._renderer;
		var vrHMD = this._vrHMD;
			var autoUpdate = scene.autoUpdate;

			if ( autoUpdate ) {
				scene.updateMatrixWorld();
				scene.autoUpdate = false;
			}

			var eyeParamsL = vrHMD.getEyeParameters( 'left' );
			var eyeParamsR = vrHMD.getEyeParameters( 'right' );

			eyeTranslationL.fromArray( eyeParamsL.offset );
			eyeTranslationR.fromArray( eyeParamsR.offset );
			eyeFOVL = eyeParamsL.fieldOfView;
			eyeFOVR = eyeParamsR.fieldOfView;

			// When rendering we don't care what the recommended size is, only what the actual size
			// of the backbuffer is.
			var size = renderer.getSize();
			renderRectL = { x: 0, y: 0, width: size.width / 2, height: size.height };
			renderRectR = { x: size.width / 2, y: 0, width: size.width / 2, height: size.height };

			renderer.setScissorTest( true );
			renderer.clear();

			if ( camera.parent === null ) camera.updateMatrixWorld();

			cameraLeft.projectionMatrix = this.FovToProjection( eyeFOVL, true, camera.near, camera.far );
			cameraRight.projectionMatrix = this.FovToProjection( eyeFOVR, true, camera.near, camera.far );

			camera.matrixWorld.decompose( cameraLeft.position, cameraLeft.quaternion, cameraLeft.scale );
			camera.matrixWorld.decompose( cameraRight.position, cameraRight.quaternion, cameraRight.scale );

			var scale = this.scale;
			cameraLeft.translateOnAxis( eyeTranslationL, scale );
			cameraRight.translateOnAxis( eyeTranslationR, scale );

			// render left eye
			renderer.setViewport( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );
			renderer.setScissor( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );
			renderer.render( scene, cameraLeft );

			// render right eye
			renderer.setViewport( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );
			renderer.setScissor( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );
			renderer.render( scene, cameraRight );

			renderer.setScissorTest( false );

			if ( autoUpdate ) {
				scene.autoUpdate = true;
			}
	};

	this.setSize = function( width, height ) {
		renderer.setSize( width, height );
	};

	this.setVRMode = function (enable) {
		var vrHMD = this._vrHMD;
		var canvas = renderer.domElement;

		if (enable) {
			vrHMD.requestPresent([{source: canvas, leftBounds: [0.0, 0.0, 0.5, 1.0], rightBounds: [0.5, 0.0, 0.5, 1.0]}]);
		} else {
			vrHMD.exitPresent();
		}
	}

	this.setFullScreen = function( enable ) {
		var renderer = this._renderer;
		var vrHMD = this._vrHMD;

		var canvasOriginalSize = this._canvasOriginalSize;

		// If state doesn't change we do nothing
		if ( enable === this._fullScreen ) {
			return;
		}
		this._fullScreen = !!enable;

		if (!vrHMD) {
			var canvas = renderer.domElement;
			if (canvas.mozRequestFullScreen) {
				canvas.mozRequestFullScreen(); // Firefox
			} else if (canvas.webkitRequestFullscreen) {
				canvas.webkitRequestFullscreen(); // Chrome and Safari
			} else if (canvas.requestFullScreen){
				canvas.requestFullscreen();
			}
			return;
		}

		// VR Mode disabled
		if ( !enable ) {
			// Restores canvas original size
			renderer.setSize( canvasOriginalSize.width, canvasOriginalSize.height );
			return;
		}
		// VR Mode enabled
		this._canvasOriginalSize = {
			width: renderer.domElement.width,
			height: renderer.domElement.height
		};

		// Hardcoded Rift display size
		renderer.setSize( 1280, 800, false );
		this.startFullscreen();
	};

	this.startFullscreen = function() {
		var self = this;
		var renderer = this._renderer;
		var vrHMD = this._vrHMD;
		var canvas = renderer.domElement;
		var fullScreenChange =
			canvas.mozRequestFullScreen? 'mozfullscreenchange' : 'webkitfullscreenchange';

		document.addEventListener( fullScreenChange, onFullScreenChanged, false );
		function onFullScreenChanged() {
			if ( !document.mozFullScreenElement && !document.webkitFullScreenElement ) {
				self.setFullScreen( false );
			}
		}
		if ( canvas.mozRequestFullScreen ) {
			canvas.mozRequestFullScreen( { vrDisplay: vrHMD } );
		} else {
			canvas.webkitRequestFullscreen( { vrDisplay: vrHMD } );
		}
	};

	this.FovToNDCScaleOffset = function( fov ) {
		var pxscale = 2.0 / (fov.leftTan + fov.rightTan);
		var pxoffset = (fov.leftTan - fov.rightTan) * pxscale * 0.5;
		var pyscale = 2.0 / (fov.upTan + fov.downTan);
		var pyoffset = (fov.upTan - fov.downTan) * pyscale * 0.5;
		return { scale: [pxscale, pyscale], offset: [pxoffset, pyoffset] };
	};

	this.FovPortToProjection = function( fov, rightHanded /* = true */, zNear /* = 0.01 */, zFar /* = 10000.0 */ )
	{
		rightHanded = rightHanded === undefined ? true : rightHanded;
		zNear = zNear === undefined ? 0.01 : zNear;
		zFar = zFar === undefined ? 10000.0 : zFar;

		var handednessScale = rightHanded ? -1.0 : 1.0;

		// start with an identity matrix
		var mobj = new THREE.Matrix4();
		var m = mobj.elements;

		// and with scale/offset info for normalized device coords
		var scaleAndOffset = this.FovToNDCScaleOffset(fov);

		// X result, map clip edges to [-w,+w]
		m[0*4+0] = scaleAndOffset.scale[0];
		m[0*4+1] = 0.0;
		m[0*4+2] = scaleAndOffset.offset[0] * handednessScale;
		m[0*4+3] = 0.0;

		// Y result, map clip edges to [-w,+w]
		// Y offset is negated because this proj matrix transforms from world coords with Y=up,
		// but the NDC scaling has Y=down (thanks D3D?)
		m[1*4+0] = 0.0;
		m[1*4+1] = scaleAndOffset.scale[1];
		m[1*4+2] = -scaleAndOffset.offset[1] * handednessScale;
		m[1*4+3] = 0.0;

		// Z result (up to the app)
		m[2*4+0] = 0.0;
		m[2*4+1] = 0.0;
		m[2*4+2] = zFar / (zNear - zFar) * -handednessScale;
		m[2*4+3] = (zFar * zNear) / (zNear - zFar);

		// W result (= Z in)
		m[3*4+0] = 0.0;
		m[3*4+1] = 0.0;
		m[3*4+2] = handednessScale;
		m[3*4+3] = 0.0;

		mobj.transpose();

		return mobj;
	};

	this.FovToProjection = function( fov, rightHanded /* = true */, zNear /* = 0.01 */, zFar /* = 10000.0 */ )
	{
		var fovPort = {
			upTan: Math.tan(fov.upDegrees * Math.PI / 180.0),
			downTan: Math.tan(fov.downDegrees * Math.PI / 180.0),
			leftTan: Math.tan(fov.leftDegrees * Math.PI / 180.0),
			rightTan: Math.tan(fov.rightDegrees * Math.PI / 180.0)
		};
		return this.FovPortToProjection(fovPort, rightHanded, zNear, zFar);
	};

};
