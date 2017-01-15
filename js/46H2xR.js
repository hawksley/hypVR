// 	Schlafli symbol {4,6} is squares with 6 around each vertex

function acosh(arg) {
  //  discuss at: http://phpjs.org/functions/acosh/
  // original by: Onno Marsman
  //   example 1: acosh(8723321.4);
  //   returns 1: 16.674657798418625

  return Math.log(arg + Math.sqrt(arg * arg - 1));
}

var dist = 2*acosh( Math.sqrt(1.5) )  // 436 or 46 in H^2
// var globalZScaling = 0.3; //height of cubes relative to x,y dimensions

var globalZScaling = 0.57735;
// var globalZScaling = 1.0;

var globalCoordChange = new THREE.Matrix4().set(   
    0, 1, 0, 0,
    0, 0, 1, 0, //rotate so that R is in vertical dir on screen
    1, 0, 0, 0,
    0, 0, 0, 1);

// var globalCoordChange = new THREE.Matrix4().set(   
//     1, 0, 0, 0,
//     0, 1, 0, 0, //rotate so that R is in vertical dir on screen
//     0, 0, 1, 0,
//     0, 0, 0, 1);

var globalCoordChangeInv = new THREE.Matrix4().identity();
globalCoordChangeInv.getInverse(globalCoordChange);

var rotx = new THREE.Matrix4().makeRotationX( Math.PI/2 );
var rotxi = new THREE.Matrix4().makeRotationX( -Math.PI/2 );
var roty = new THREE.Matrix4().makeRotationY( Math.PI/2 );
var rotyi = new THREE.Matrix4().makeRotationY( -Math.PI/2 );
var rotz = new THREE.Matrix4().makeRotationZ( Math.PI/2 );
var rotzi = new THREE.Matrix4().makeRotationZ( -Math.PI/2 );

var tilingGens =
[
[0, new THREE.Matrix4()],  //[0, id matrix]
[translateByVectorH2xR(new THREE.Vector3(dist,0,0))[0], translateByVectorH2xR(new THREE.Vector3(dist,0,0))[1].multiply(rotzi)] ,
[translateByVectorH2xR(new THREE.Vector3(-dist,0,0))[0] , translateByVectorH2xR(new THREE.Vector3(-dist,0,0))[1].multiply(rotzi)],
[translateByVectorH2xR(new THREE.Vector3(0,dist,0))[0] , translateByVectorH2xR(new THREE.Vector3(0,dist,0))[1].multiply(rotz)],
[translateByVectorH2xR(new THREE.Vector3(0,-dist,0))[0] ,translateByVectorH2xR(new THREE.Vector3(0,-dist,0))[1].multiply(rotz)],
// [translateByVectorH2xR(new THREE.Vector3(dist,0,0))[0], translateByVectorH2xR(new THREE.Vector3(dist,0,0))[1] ],
// [translateByVectorH2xR(new THREE.Vector3(-dist,0,0))[0] , translateByVectorH2xR(new THREE.Vector3(-dist,0,0))[1] ],
// [translateByVectorH2xR(new THREE.Vector3(0,dist,0))[0] , translateByVectorH2xR(new THREE.Vector3(0,dist,0))[1] ],
// [translateByVectorH2xR(new THREE.Vector3(0,-dist,0))[0] ,translateByVectorH2xR(new THREE.Vector3(0,-dist,0))[1] ],
translateByVectorH2xR(new THREE.Vector3(0,0,2*globalZScaling)) ,    
translateByVectorH2xR(new THREE.Vector3(0,0,-2*globalZScaling))     // related to scaling of cube in indexH2xR
];

var genQuatsColourSchemes = 
[
  [ //// 8 colours untwisted
  ////yellow-blue colouring
  new THREE.Quaternion(0,0,0,1),
  new THREE.Quaternion(0.86602,0,0,-0.5),
  new THREE.Quaternion(-0.86602,0,0,-0.5),
  new THREE.Quaternion(0.86602,0,0,-0.5),
  new THREE.Quaternion(-0.86602,0,0,-0.5),
  new THREE.Quaternion(0,0,0,-1),
  new THREE.Quaternion(0,0,0,-1) 
  ],
  [ //// 8 colours untwisted
  ////cyan-red colouring
  new THREE.Quaternion(0,0,0,1),
  new THREE.Quaternion(0,0.86602,0,-0.5),
  new THREE.Quaternion(0,-0.86602,0,-0.5),
  new THREE.Quaternion(0,0.86602,0,-0.5),
  new THREE.Quaternion(0,-0.86602,0,-0.5),
  new THREE.Quaternion(0,0,0,-1),
  new THREE.Quaternion(0,0,0,-1)
  ],
  [ //// 8 colours untwisted
 ////green-mauve colouring
  new THREE.Quaternion(0,0,0,1),
  new THREE.Quaternion(0,0,0.86602,-0.5),
  new THREE.Quaternion(0,0,-0.86602,-0.5),
  new THREE.Quaternion(0,0,0.86602,-0.5),
  new THREE.Quaternion(0,0,-0.86602,-0.5),
  new THREE.Quaternion(0,0,0,-1),
  new THREE.Quaternion(0,0,0,-1) 
  ],
  [ //// 8 colours twisted
    ////yellow-blue colouring
  new THREE.Quaternion(0,0,0,1),
  new THREE.Quaternion(0.86602,0,0,0.5),
  new THREE.Quaternion(-0.86602,0,0,0.5),
  new THREE.Quaternion(0.86602,0,0,0.5),
  new THREE.Quaternion(-0.86602,0,0,0.5),
  new THREE.Quaternion(0,0,0,-1),
  new THREE.Quaternion(0,0,0,-1)
  ],
  [ //// 8 colours twisted
  ////cyan-red colouring
  new THREE.Quaternion(0,0,0,1),
  new THREE.Quaternion(0,0.86602,0,0.5),
  new THREE.Quaternion(0,-0.86602,0,0.5),
  new THREE.Quaternion(0,0.86602,0,0.5),
  new THREE.Quaternion(0,-0.86602,0,0.5),
  new THREE.Quaternion(0,0,0,-1),
  new THREE.Quaternion(0,0,0,-1)
  ],
  [ //// 8 colours twisted
  //green-mauve colouring
  new THREE.Quaternion(0,0,0,1),
  new THREE.Quaternion(0,0,0.86602,0.5),
  new THREE.Quaternion(0,0,-0.86602,0.5),
  new THREE.Quaternion(0,0,0.86602,0.5),
  new THREE.Quaternion(0,0,-0.86602,0.5),
  new THREE.Quaternion(0,0,0,-1),
  new THREE.Quaternion(0,0,0,-1)
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


