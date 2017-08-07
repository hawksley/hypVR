window.THREE = require('three');
import WebVRPolyfill from 'webvr-polyfill';

// Dynamically turn the polyfill on if requested by the query args.
if (WGLUUrl.getBool('polyfill', false)) {
  InitializeWebVRPolyfill();
} else {
  // Shim for migration from older version of WebVR. Shouldn't be necessary for very long.
  InstallWebVRSpecShim();
}

//VRControlsHyperbolic.js acquires positional information from connected VR devices and applies the transformations to a three.js camera object. Also deals with hyperbolic and parabolic motions.
require('./three-extras/VRControlsHyperbolic.js');
//VREffect.js handles stereo camera setup and rendering.
require('./three-extras/VREffect.js');
require('./three-extras/OBJLoader.js');

//class PhoneVR to manage VR on phones.
require('./PhoneVR.js');
require('./hypMath.js');
require('./436.js');
// Main Code
require('./hypTiling.js');
