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
new THREE.Matrix4().identity(),  //id matrix
rotxi.multiply( translateByVector(new THREE.Vector3(dist,0,0)) ),
rotx.multiply( translateByVector(new THREE.Vector3(-dist,0,0)) ),
rotyi.multiply( translateByVector(new THREE.Vector3(0,dist,0)) ),
roty.multiply( translateByVector(new THREE.Vector3(0,-dist,0)) ),
rotzi.multiply( translateByVector(new THREE.Vector3(0,0,dist)) ),
rotz.multiply( translateByVector(new THREE.Vector3(0,0,-dist)) )
];  ///these multiplies are consistent with left hand screw monkeys

var genQuatsColourSchemes = 
[
  [ //// 8 colours twisted
  new THREE.Quaternion(0,0,0,1),
  new THREE.Quaternion(1,0,0,0),
  new THREE.Quaternion(-1,0,0,0),
  new THREE.Quaternion(0,1,0,0),
  new THREE.Quaternion(0,-1,0,0),
  new THREE.Quaternion(0,0,1,0),
  new THREE.Quaternion(0,0,-1,0)
  ], 
  [ //// 8 colours untwisted
  new THREE.Quaternion(0,0,0,1),
  new THREE.Quaternion(-1,0,0,0),
  new THREE.Quaternion(1,0,0,0),
  new THREE.Quaternion(0,-1,0,0),
  new THREE.Quaternion(0,1,0,0),
  new THREE.Quaternion(0,0,-1,0),
  new THREE.Quaternion(0,0,1,0)
  ],
  [ //// 2 colours
  new THREE.Quaternion(0,0,0,1),
  new THREE.Quaternion(0,0,0,-1),
  new THREE.Quaternion(0,0,0,-1),
  new THREE.Quaternion(0,0,0,-1),
  new THREE.Quaternion(0,0,0,-1),
  new THREE.Quaternion(0,0,0,-1),
  new THREE.Quaternion(0,0,0,-1)
  ]
];

function word2colorQuat(word) {
    // word is a list of indexes into tilingGens
    var quat = new THREE.Quaternion(0,0,0,1);
    for (var j = 0; j < word.length; j++){  
        quat.multiply( genQuatsColourSchemes[colourMode][word[j]] ) 
    }
    return quat;
}



