export const loadElement = ({
  loader,
  path,
  scene,
  minIterations=0,
  maxIterations,
  bigMatArray,
  extra
}) => {
  /// first, coloured cube
  loader.load(path, function (object) {
    for (var i = 0; i < maxIterations; i++) {
      var newObject = object.clone();
      newObject.children[0].material = bigMatArray[(i + extra)];
      // newObject.children[0].frustumCulled = false;
      scene.add(newObject);
    }
  });
};
