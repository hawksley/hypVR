//import { makeTsfmsList } from './lib/hypMath';
import * as decorationArray from './decoration-array';
import getMaterialBase from './get-material-base';
import updateBigMatArray from './update-big-mat-array';
import getCamera from './get-camera';
import {
  CONTROLS,
  LOADING_MANAGER,
  MESH,
  MATRIX4,
  OBJLOADER,
  QUATERNION,
  SCENE,
  RENDERER,
  VREFFECT
} from './three-utils';

import {
  loadElement
} from './load-element';

let camera;
let scene;
let renderer;
let mesh;

let infoSprite = MESH;
let effect;
let controls;
// var music = document.querySelector('#music');
let clicky = 0;
let mouseX = 1;
let mouseY = 1;
window.currentBoost = MATRIX4.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);

let decoration = "truncatedCube";
window.colourMode = 0;

let doubleSided = false;

let numObjects = 1; //number of obj files to load
let numGens = tilingGens.length;
let tilingDepth = 4; //default 4

let unpackTriple = makeTsfmsList( tilingGens, tilingDepth );
let tsfms = unpackTriple[0];
let words = unpackTriple[1];
let cumulativeNumTsfms = unpackTriple[2];

var numTiles = tsfms.length;
var bigMatArray;

let movedTowardsCentralCubeThisFrameIndex = false;
var materialBase;

function init() {
  var start = Date.now();
  scene = SCENE;
  camera = getCamera(window);
  camera.position.x = 0;
  camera.position.z = 0;

  renderer = RENDERER({ antialias: true });
  document.body.appendChild(renderer.domElement);

  controls = CONTROLS(camera);

  effect = VREFFECT(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  materialBase = getMaterialBase(doubleSided);

  loadStuff();

  ////// create info overlay
  // var infoText = THREE.ImageUtils.loadTexture( "media/twelve-ui.png" );
  // var infoMaterial = new THREE.MeshBasicMaterial( {map: infoText, wireframe: false, color: 0x777777 });
  // var infoBox = new THREE.BoxGeometry(2,1,1);
  // infoSprite = new THREE.Mesh( infoBox, infoMaterial );
  // infoSprite.position.z = -2;
  // infoSprite.position.x = -.5;
  // infoSprite.position.y = -1;
  // infoSprite.rotation.x = -.3;
  // scene.add( infoSprite );

  effect.render(scene, camera, animate);
}

function loadStuff(){
  var cubeDecoration;
  var manager = LOADING_MANAGER;
  var loader = OBJLOADER(manager);

  const isDecorationAMonkey = ([
    "monkey",
    "monkey2",
    "monkey3"
  ].indexOf(decoration) > -1);

  if (isDecorationAMonkey) {
    numObjects = 2;
    bigMatArray = updateBigMatArray(bigMatArray, numObjects, numTiles, materialBase);

    switch( decoration) {
      case "monkey":
        cubeDecoration = 'cube';
        break;
      case "monkey2":
        cubeDecoration = 'truncatedCube';
        break;
      default:
        cubeDecoration = 'truncatedCubeTrisOnly';
    }

    loadElement({
      loader,
      path: 'media/'.concat(cubeDecoration, '.obj'),
      scene,
      maxIterations: numTiles,
      bigMatArray,
      extra: 0
    });

    loadElement({
      loader,
      path: 'media/euc_monkey_cut_7p5k.obj',
      scene,
      maxIterations: cumulativeNumTsfms[1],
      bigMatArray,
      extra: numTiles
    });

    loadElement({
      loader,
      path: 'media/euc_monkey_cut_3k.obj',
      scene,
      minIterations: cumulativeNumTsfms[1],
      maxIterations: cumulativeNumTsfms[2],
      bigMatArray,
      extra: numTiles
    });

    loadElement({
      loader,
      path: 'media/euc_monkey_cut_1p5k.obj',
      scene,
      minIterations: cumulativeNumTsfms[2],
      maxIterations: cumulativeNumTsfms[3],
      bigMatArray,
      extra: numTiles
    });

    loadElement({
      loader,
      path: 'media/euc_monkey_cut_750.obj',
      scene,
      minIterations: cumulativeNumTsfms[3],
      maxIterations: cumulativeNumTsfms[4],
      bigMatArray,
      extra: numTiles
    });
  }

  else {
      numObjects = 1;
      bigMatArray = updateBigMatArray(bigMatArray, numObjects, numTiles, materialBase);
      loadElement({
        loader,
        path: 'media/'.concat(decoration, '.obj'),
        scene,
        maxIterations: numTiles,
        bigMatArray,
        extra: 0
      });
  }
  for (var k = 0; k < numObjects; k++) {
    for (var j = 0; j < numTiles; j++) {
      var i = j + numTiles*k;
      bigMatArray[i].uniforms['translation'].value = tsfms[j];
      if (k == 0){
        bigMatArray[i].uniforms['cellColorQuat'].value = word2colorQuat( words[j] );
      }
      else {
        bigMatArray[i].uniforms['cellColorQuat'].value = new THREE.Quaternion(0,0,0,0);
        // all zeros quat is special cased to grey
      }
      // console.log(words[j]);
      // console.log(word2colorQuat( words[j] ));
      // console.log(bigMatArray[i].uniforms['userCellColorQuat'].value);


    // bigMatArray[i].visible = phraseOnOffMaps[currentPhrase][k];
    }
  }
}


function animate() {
  controls.update();  // need to get movedTowardsCentralCubeThisFrameIndex before updating stuff


  for (var k = 0; k < numObjects; k++) {
    for (var j = 0; j < numTiles; j++) {
      var i = j + numTiles*k;
      bigMatArray[i].uniforms['boost'].value = currentBoost;
      // console.log(bigMatArray[i].uniforms['userCellColorQuat'].value);
      if (movedTowardsCentralCubeThisFrameIndex != false) {

        var tempQuat = QUATERNION;
        tempQuat.copy(bigMatArray[i].uniforms['userCellColorQuat'].value);
        tempQuat.multiply(genQuatsColourSchemes[colourMode][movedTowardsCentralCubeThisFrameIndex]);

        bigMatArray[i].uniforms['userCellColorQuat'].value = tempQuat;
        /// always act on a uniform by setting it equal to something, other stuff breaks in incomprehensible ways...


        // console.log(movedTowardsCentralCubeThisFrameIndex);
        // console.log(genQuats[movedTowardsCentralCubeThisFrameIndex]);
        // console.log(bigMatArray[i].uniforms['userCellColorQuat'].value);
      }


    // bigMatArray[i].visible = phraseOnOffMaps[currentPhrase][k];
    }
  }

  effect.render(scene, camera, animate);
  // requestAnimationFrame(animate);
}

document.addEventListener('keydown', function(event) { selectShape(event); }, false);

function selectShape(event) {

  var keySelect = event.keyCode - 48; //1 is 49

  if (keySelect > 0 && keySelect < 10){
     if (scene) {
       while (scene.children.length > 0) {
           scene.remove(scene.children[scene.children.length - 1]);
       }
    decoration = decorationArray[(keySelect-1)];
    loadStuff();
    }
  }
}

document.addEventListener('keydown', function(event) { changeColourMode(event); }, false);

function changeColourMode(event) {

  var keySelect = event.keyCode;

  if (keySelect == 67){  //c
     if (scene) {
       while (scene.children.length > 0) {
           scene.remove(scene.children[scene.children.length - 1]);
       }
    colourMode = (colourMode + 1) % genQuatsColourSchemes.length;
    loadStuff();
    }
  }
}

init();
animate();

//Listen for double click event to enter full-screen VR mode
document.body.addEventListener( 'click', function() {
  effect.setFullScreen( true );
});
