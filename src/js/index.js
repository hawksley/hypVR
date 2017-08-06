window.THREE = require('three');

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
