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

const rotx = new THREE.Matrix4().makeRotationX( Math.PI/2 );
const rotxi = new THREE.Matrix4().makeRotationX( -Math.PI/2 );
const roty = new THREE.Matrix4().makeRotationY( Math.PI/2 );
const rotyi = new THREE.Matrix4().makeRotationY( -Math.PI/2 );
const rotz = new THREE.Matrix4().makeRotationZ( Math.PI/2 );
const rotzi = new THREE.Matrix4().makeRotationZ( -Math.PI/2 );

export {
  rotx,
  rotxi,
  roty,
  rotyi,
  rotz,
  rotzi
};
