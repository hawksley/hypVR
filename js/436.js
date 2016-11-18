// 	Schlafli symbol {4,3,6} is cubes with 6 around each edge

function acosh(arg) {
  //  discuss at: http://phpjs.org/functions/acosh/
  // original by: Onno Marsman
  //   example 1: acosh(8723321.4);
  //   returns 1: 16.674657798418625

  return Math.log(arg + Math.sqrt(arg * arg - 1));
}

var dist = 2*acosh( Math.sqrt(1.5) )

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

var rotx = new THREE.Matrix4().makeRotationX( Math.PI/2 );
var rotxi = new THREE.Matrix4().makeRotationX( -Math.PI/2 );
var roty = new THREE.Matrix4().makeRotationY( Math.PI/2 );
var rotyi = new THREE.Matrix4().makeRotationY( -Math.PI/2 );
var rotz = new THREE.Matrix4().makeRotationZ( Math.PI/2 );
var rotzi = new THREE.Matrix4().makeRotationZ( -Math.PI/2 );


var tilingGens =
[
new THREE.Matrix4(),  //id matrix
rotxi.multiply( translateByVector(new THREE.Vector3(dist,0,0)) ),
rotx.multiply( translateByVector(new THREE.Vector3(-dist,0,0)) ),
rotyi.multiply( translateByVector(new THREE.Vector3(0,dist,0)) ),
roty.multiply( translateByVector(new THREE.Vector3(0,-dist,0)) ),
rotzi.multiply( translateByVector(new THREE.Vector3(0,0,dist)) ),
rotz.multiply( translateByVector(new THREE.Vector3(0,0,-dist)) )
];

function word2colorIndex(word) {
    // word is a list of indexes into tilingGens
    var count = 0;
    for (var j = 0; j < word.length; j++){
        if (word[j] != 0){
            count++;
          }
    }
    // var foo = 0.25 + 0.5*(count%2);  //light or dark gray
    // return new THREE.Vector3(foo, foo, foo);
    return count % 2;
}

