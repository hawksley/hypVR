import { Matrix } from '../three-utils';
import {
  isMatrixInArray,
  digitsDepth
} from '../hypMath';

//  discuss at: http://phpjs.org/functions/acosh/
//  original by: Onno Marsman
//  example 1: acosh(8723321.4);
//  returns 1: 16.674657798418625
const acosh = (arg) => ( Math.log(arg + Math.sqrt(arg * arg - 1)));

const makeTsfmsList = ( tilingGens, tilingDepth ) => {
	let numTsfmsEachDepth = [];
	let cumulativeNumTsfms = [];

	for (let l = 0; l < tilingDepth + 1; l++) {  //initialise array to zeros
		numTsfmsEachDepth[numTsfmsEachDepth.length] = 0;
		cumulativeNumTsfms[cumulativeNumTsfms.length] = 0;
	}

	let numGens = tilingGens.length;
	let tsfms = [];
  let words = [];
  let genPower = 1;
	for (let j = 0; j < genPower; j++) {
	    let digits = [];
	    let jcopy = j;
	    for (let k = 0; k < tilingDepth; k++) {
	      digits[digits.length] = jcopy % numGens;
	      jcopy = (jcopy/numGens)|0;
	    }
	    // console.log(digits);
	    var newTsfm = new Matrix();
	    for (let l = 0; l < tilingDepth; l++) {
	      newTsfm = newTsfm.multiply(tilingGens[digits[l]]);
	    }

	    if ( !isMatrixInArray(newTsfm, tsfms) ) {
	      tsfms[tsfms.length] = newTsfm;
          words[words.length] = digits;
	      numTsfmsEachDepth[digitsDepth(digits)] += 1;
	    }
      genPower = Math.pow(numGens, tilingDepth);
	}

	for (let i = 0; i < tilingDepth; i++){
		cumulativeNumTsfms[i] = numTsfmsEachDepth[i];
		if (i>0){
			cumulativeNumTsfms[i] += cumulativeNumTsfms[i-1];
		}
	}
	return [tsfms, words, cumulativeNumTsfms];
}

window.makeTsfmsList = makeTsfmsList;

export {
  acosh,
  makeTsfmsList
};
