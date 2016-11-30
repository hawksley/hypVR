//hyperbolic matrix functions

// THREE.Matrix3.prototype.add = function (m) {
//   this.set.apply(this, [].map.call(this.elements, function (c, i) { return c + m.elements[i] }));
// };

THREE.Matrix4.prototype.add = function (m) {
  this.set.apply(this, [].map.call(this.elements, function (c, i) { return c + m.elements[i] }));
};

function areSameTsfm(tsfm1, tsfm2) {
	var delta = 0.001;
    if (Math.abs(tsfm1[0] - tsfm2[0]) > delta) {
        return false;
    }
	for (var coord=3; coord<16; coord+=4) {  //look only at last column of the matrix: center of cell in H2
		if (Math.abs(tsfm1[1].elements[coord] - tsfm2[1].elements[coord]) > delta) {
			return false;
		}
	}
    // console.log('same tsfm');
    // console.log(tsfm1);
    // console.log(tsfm2);
	return true;
}

function isTsfmInArray(tsfm, tsfmArray) {
	for (var i=0; i<tsfmArray.length; i++) {
		if (areSameTsfm(tsfm, tsfmArray[i])) {
		// if (i > 3) {
			return true;
		}
	}
	return false;
}

// function hypDistFromOrigin(v) {
// // put the point onto Klein model
// // hyp dist is arctanh(euclidean dist)
// 	return Math.atanh(Math.sqrt((v.x*v.x + v.y*v.y + v.z*v.z) / (v.w*v.w)));
// }  //dont need this for calculating nearest point to origin - atanh is increasing function

function digitsDepth( digits ) {
	numZeros = 0;
	for (var i = 0; i < digits.length; i++) {
		if ( digits[i] == 0 ) {
			numZeros += 1;
		} 
	}
	return digits.length - numZeros;
}

function makeTsfmsList( tilingGens, tilingDepth ) {
	var numTsfmsEachDepth = [];
	var cumulativeNumTsfms = [];
	for (var l = 0; l < tilingDepth + 1; l++) {  //initialise array to zeros
		numTsfmsEachDepth[numTsfmsEachDepth.length] = 0;
		cumulativeNumTsfms[cumulativeNumTsfms.length] = 0;
	}
	var numGens = tilingGens.length;
	var tsfms = [];
    var words = [];
	for (var j = 0; j < Math.pow(numGens, tilingDepth); j++) {
	    var digits = [];
	    var jcopy = j;
	    for (var k = 0; k < tilingDepth; k++) {
	      digits[digits.length] = jcopy % numGens;
	      jcopy = (jcopy/numGens)|0;
	    }
	    // console.log(digits);
	    var newTsfmH2 = new THREE.Matrix4();
        var newTsfmR = 0.0;
        var newTsfm;

	    for (var l = 0; l < tilingDepth; l++) {
          newTsfmR = newTsfmR + tilingGens[digits[l]][0];
	      newTsfmH2 = newTsfmH2.multiply(tilingGens[digits[l]][1]);
          newTsfm = [newTsfmR, newTsfmH2];
          // console.log('newTsfmH2');
          // console.log(newTsfmH2);
	    }

	    if ( !isTsfmInArray(newTsfm, tsfms) ) {
	      tsfms[tsfms.length] = newTsfm;
          words[words.length] = digits;
	      numTsfmsEachDepth[digitsDepth(digits)] += 1;
	    }
	}
	
	for (var i = 0; i < tilingDepth; i++){
		cumulativeNumTsfms[i] = numTsfmsEachDepth[i];
		if (i>0){
			cumulativeNumTsfms[i] += cumulativeNumTsfms[i-1];
		}
	}
    console.log('tsfms');
    console.log(tsfms);
	return [tsfms, words, cumulativeNumTsfms];
}

// function translateByVector(v) { // trickery stolen from Jeff Weeks' Curved Spaces app
//   var dx = v.x;
//   var dy = v.y;
//   var dz = v.z;
//   var len = Math.sqrt(dx*dx + dy*dy + dz*dz);
//   dx /= len;
//   dy /= len;
//   dz /= len;
//   var m = new THREE.Matrix4().set(
//     0, 0, 0, dx,
//     0, 0, 0, dy,
//     0, 0, 0, dz,
//     dx,dy,dz, 0);
//   var m2 = new THREE.Matrix4().copy(m).multiply(m);
//   var c1 = Math.sinh(len);
//   var c2 = Math.cosh(len) - 1;
//   m.multiplyScalar(c1);
//   m2.multiplyScalar(c2);
//   var result = new THREE.Matrix4().identity();
//   result.add(m);
//   result.add(m2);
//   return result;
// }

function translateByVectorH2xR(v) {  // return only H2 part for now
  var dx = v.x;
  var dy = v.y;
  var dz = v.z;
  var len = Math.sqrt(dx*dx + dy*dy);
  if (len == 0)
  { // dx = dy = 0, just return the result already
    var resultH2 = new THREE.Matrix4().set(   //THREE.js doesn't have proper support for matrix3s, so just ignore the 4th coord
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1);
    return [dz, resultH2];
  }
  else
  {
    dx /= len;
    dy /= len;
    var mH2 = new THREE.Matrix4().set(
     0, 0, 0,dx,
     0, 0, 0,dy,
     0, 0, 0, 0,
    dx,dy, 0, 0);
    var mH2squared = new THREE.Matrix4().copy(mH2).multiply(mH2);
    var c1H2 = Math.sinh(len);
    var c2H2 = Math.cosh(len) - 1;
    mH2.multiplyScalar(c1H2);
    mH2squared.multiplyScalar(c2H2);
    var resultH2 = new THREE.Matrix4().identity();
    resultH2.add(mH2);
    resultH2.add(mH2squared);

    return [dz, resultH2];  //float for R direction, 4x4 of which only first 3x3 is used for H2 direction
  }
}

// function parabolicBy2DVector(v) {  ///  something is wrong here we think...
//   var dx = v.x; /// first make parabolic fixing point at infinity in pos z direction
//   var dy = v.y;
//   var m = new THREE.Matrix4().set(
//     0, 0, -dx, dx,
//     0, 0, -dy, dy,
//     dx, dy, 0, 0,
//     dx, dy, 0, 0);
//   var m2 = new THREE.Matrix4().copy(m).multiply(m);
//   m2.multiplyScalar(0.5);
//   var result = new THREE.Matrix4().identity();
//   result.add(m);
//   result.add(m2);
//   //now conjugate to get based on camera orientation  
//   var cameraM = new THREE.Matrix4();
//   cameraM.makeRotationFromQuaternion(camera.quaternion);
//   var cameraMinv = new THREE.Matrix4().getInverse(cameraM);

//   return cameraM.multiply(result).multiply(cameraMinv);
// }

function getFwdVector() {
  return new THREE.Vector3(0,0,1).applyQuaternion(camera.quaternion);
}
function getRightVector() {
  return new THREE.Vector3(-1,0,0).applyQuaternion(camera.quaternion);
}
function getUpVector() {
  return new THREE.Vector3(0,-1,0).applyQuaternion(camera.quaternion);
}

// fastGramSchmidt from Jeff Week's CurvedSpaces. Causes some wobble when far from the origin...

function fastGramSchmidt( m )
{
	//	Numerical errors can accumulate and force aMatrix "out of round",
	//	in the sense that its rows are no longer orthonormal.
	//	This effect is small in spherical and flat spaces,
	//	but can be significant in hyperbolic spaces, especially
	//	if the camera travels far from the origin.

	//	The Gram-Schmidt process consists of rescaling each row to restore
	//	unit length, and subtracting small multiples of one row from another
	//	to restore orthogonality.  Here we carry out a first-order approximation
	//	to the Gram-Schmidt process.  That is, we normalize each row
	//	to unit length, but then assume that the subsequent orthogonalization step
	//	doesn't spoil the unit length.  This assumption will be well satisfied
	//	because small first order changes orthogonal to a given vector affect
	//	its length only to second order.

	// var m = mat.elements;
	var spaceLike = new Float32Array([1,1,1,-1]);
	var timeLike = new Float32Array([-1,-1,-1,1]);

	//	Normalize each row to unit length.
	for (var i = 0; i < 4; i++)
	{
		var metric; 
		if (i==3){
			metric = timeLike;
		}
		else {
			metric = spaceLike;
		}

		var innerProduct = 0.0;
		for (var j = 0; j < 4; j++)
			innerProduct += metric[j] * m[4*i + j] * m[4*i + j];

		var factor = 1.0 / Math.sqrt(innerProduct);
		for (var j = 0; j < 4; j++)
			m[4*i + j] *= factor;
	}

	//	Make the rows orthogonal.
	for (var i = 4; i-- > 0; )	//	leaves the last row untouched
	{
		var metric; 
		if (i==3){
			metric = timeLike;
		}
		else {
			metric = spaceLike;
		}

		for (var j = i; j-- > 0; )
		{
			var innerProduct = 0.0;
			for (var k = 0; k < 4; k++)
				innerProduct += metric[k] * m[4*i + k] * m[4*j + k];

			for (var k = 0; k < 4; k++)
				m[4*j + k] -= innerProduct * m[4*i + k];
		}
	}
	return m;
}

///// better GramSchmidt...seem more stable out near infinity

///should really fix for H2xR, but have to decompose m, gram schmidt hyperbolic part, and recompose

function lorentzDot( u, v ){
	return u[0]*v[0] + u[1]*v[1] + u[2]*v[2] - u[3]*v[3];
}

function norm( v ){
	return Math.sqrt(Math.abs(lorentzDot(v,v)));
}

function gramSchmidt( m ){
	// var m = mat.elements; 
	for (var i = 0; i<4; i++) {  ///normalise row
		var invRowNorm = 1.0 / norm( m.subarray(4*i, 4*i+4) );
		for (var l = 0; l<4; l++) {
			m[4*i + l] = m[4*i + l] * invRowNorm;
		}
		for (var j = i+1; j<4; j++) { // subtract component of ith vector from later vectors
			var component = lorentzDot( m.subarray(4*i, 4*i+4), m.subarray(4*j, 4*j+4) );
			for (var l = 0; l<4; l++) {
				m[4*j + l] -= component * m[4*i + l];
			}
		}
	}
	return m;
}


////////check if we are still inside the central fund dom...

// function fakeDist( v ){  //good enough for comparison of distances on the hyperboloid
// 	return v.x*v.x + v.y*v.y + v.z*v.z;
// }

// function fixOutsideCentralCell( mat, gens ) {
// 	//assume first in Gens is identity, should probably fix when we get a proper list of matrices
// 	var cPos = new THREE.Vector4(0,0,0,1).applyMatrix4( mat ); //central
// 	var bestDist = fakeDist(cPos);
// 	var bestIndex = 0;
// 	for (var i=1; i < gens.length; i++){  
// 		pos = new THREE.Vector4(0,0,1,0).applyMatrix4( gens[i] ).applyMatrix4( mat );
// 		if (fakeDist(pos) < bestDist) {
// 			bestDist = fakeDist(pos);
// 			bestIndex = i;
// 		}
// 	}
// 	if (bestIndex != 0){
// 		mat = mat.multiply(gens[bestIndex]);
//         return true;
// 	}			
//     else {
//         return false;
//     }
// }

function fakeDistH2xR( vH2, vR ){  //good enough for comparison of distances on the hyperboloid
    return vH2.x*vH2.x + vH2.y*vH2.y + vR*vR;
}

function fixOutsideCentralCellH2xR( tsfmR, tsfmH2, gens ) {
    //assume first in Gens is identity, should probably fix when we get a proper list of matrices
    var cPosR = tsfmR;
    var cPosH2 = new THREE.Vector4(0,0,0,1).applyMatrix4( tsfmH2 ); //central
    var bestDist = fakeDistH2xR(cPosH2, cPosR);
    var bestIndex = 0;
    for (var i=1; i < gens.length; i++){  
        posR = gens[i][0] + cPosR;
        posH2 = new THREE.Vector4(0,0,0,1).applyMatrix4( gens[i][1] ).applyMatrix4( tsfmH2 );
        if (fakeDistH2xR(posH2, posR) < bestDist) {
            bestDist = fakeDistH2xR(posH2, posR);
            bestIndex = i;
        }
    }
    if (bestIndex != 0){
        tsfmR = tsfmR + gens[bestIndex][0];
        tsfmH2.multiply(gens[bestIndex][1]);

        // console.log(tsfm[1].multiply(gens[bestIndex][1]));
        // tsfm = [ tsfm[0] + gens[bestIndex][0], tsfm[1].multiply(gens[bestIndex][1]) ];
        // console.log(tsfm[1]);
        return [true, tsfmR, tsfmH2];
    }           
    else {
        return [false, tsfmR, tsfmH2];
    }
}


