const updateBigMatArray = (bigMatArray= [], numObjects=1, numTiles=1, materialBase) => {
  bigMatArray = new Array(numObjects * numTiles);
  // one material per object, since they have a different positions
  for (var i = 0; i < bigMatArray.length; i++) {
    bigMatArray[i] = materialBase.clone();
  }

  return bigMatArray;
}

export default updateBigMatArray;
