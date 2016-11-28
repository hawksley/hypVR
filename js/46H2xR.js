// 	Schlafli symbol {4,6} is squares with 6 around each vertex

function acosh(arg) {
  //  discuss at: http://phpjs.org/functions/acosh/
  // original by: Onno Marsman
  //   example 1: acosh(8723321.4);
  //   returns 1: 16.674657798418625

  return Math.log(arg + Math.sqrt(arg * arg - 1));
}

var dist = 2*acosh( Math.sqrt(1.5) )  // 436 or 46 in H^2
var globalZScaling = 0.3; //height of cubes relative to x,y dimensions

var tilingGens =
[
[0, new THREE.Matrix4()],  //[0, id matrix]
translateByVectorH2xR(new THREE.Vector3(dist,0,0)) ,
translateByVectorH2xR(new THREE.Vector3(-dist,0,0)) ,
translateByVectorH2xR(new THREE.Vector3(0,dist,0)) ,
translateByVectorH2xR(new THREE.Vector3(0,-dist,0)) ,
translateByVectorH2xR(new THREE.Vector3(0,0,2*globalZScaling)) ,    
translateByVectorH2xR(new THREE.Vector3(0,0,-2*globalZScaling))     // related to scaling of cube in indexH2xR
];

console.log('tilingGens')
console.log(tilingGens)

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

