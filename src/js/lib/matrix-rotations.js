import { Matrix } from './matrix4';
//use translateByVector from VRControlsHyperbolic.js

// var tilingGens =
// [
// new THREE.Matrix4(),  //id matrix
// translateByVector(new THREE.Vector3(dist,0,0)),
// translateByVector(new THREE.Vector3(-dist,0,0)),
// translateByVector(new THREE.Vector3(0,dist,0)),
// translateByVector(new THREE.Vector3(0,-dist,0)),
// translateByVector(new THREE.Vector3(0,0,dist)),
// translateByVector(new THREE.Vector3(0,0,-dist))
// ];

const RIGHT_ANGLE = Math.PI/2;
const rotx = new Matrix().makeRotationX( RIGHT_ANGLE );
const rotxi = new Matrix().makeRotationX( -RIGHT_ANGLE );
const roty = new Matrix().makeRotationY( RIGHT_ANGLE );
const rotyi = new Matrix().makeRotationY( -RIGHT_ANGLE );
const rotz = new Matrix().makeRotationZ( RIGHT_ANGLE );
const rotzi = new Matrix().makeRotationZ( -RIGHT_ANGLE );

export {
  rotx,
  rotxi,
  roty,
  rotyi,
  rotz,
  rotzi
};
