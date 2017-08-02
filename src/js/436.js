import { acosh } from './lib/hypMath';
import {
  rotx,
  rotxi,
  roty,
  rotyi,
  rotz,
  rotzi
} from './lib/matrix-rotations';

﻿// 	Schlafli symbol {4,3,6} is cubes with 6 around each edge

const dist = 2 * acosh( Math.sqrt(1.5) );

window.tilingGens =
[
new THREE.Matrix4().identity(),  //id matrix
rotxi.multiply( translateByVector(new THREE.Vector3(dist,0,0)) ),
rotx.multiply( translateByVector(new THREE.Vector3(-dist,0,0)) ),
rotyi.multiply( translateByVector(new THREE.Vector3(0,dist,0)) ),
roty.multiply( translateByVector(new THREE.Vector3(0,-dist,0)) ),
rotzi.multiply( translateByVector(new THREE.Vector3(0,0,dist)) ),
rotz.multiply( translateByVector(new THREE.Vector3(0,0,-dist)) )
];  ///these multiplies are consistent with left hand screw monkeys

window.genQuatsColourSchemes =
[
  [ //// 8 colours untwisted
  new THREE.Quaternion(0,0,0,1),
  new THREE.Quaternion(-1,0,0,0),
  new THREE.Quaternion(1,0,0,0),
  new THREE.Quaternion(0,-1,0,0),
  new THREE.Quaternion(0,1,0,0),
  new THREE.Quaternion(0,0,-1,0),
  new THREE.Quaternion(0,0,1,0)
  ],
  [ //// 8 colours twisted
  new THREE.Quaternion(0,0,0,1),
  new THREE.Quaternion(1,0,0,0),
  new THREE.Quaternion(-1,0,0,0),
  new THREE.Quaternion(0,1,0,0),
  new THREE.Quaternion(0,-1,0,0),
  new THREE.Quaternion(0,0,1,0),
  new THREE.Quaternion(0,0,-1,0)
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

window.word2colorQuat = function word2colorQuat(word) {
    // word is a list of indexes into tilingGens
    var quat = new THREE.Quaternion(0,0,0,1);
    for (var j = 0; j < word.length; j++){
        quat.multiply( genQuatsColourSchemes[colourMode][word[j]] )
    }
    return quat;
}
