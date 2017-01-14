var camera;
var scene;
var renderer;
var mesh;

var infoSprite = new THREE.Mesh();
var effect;
var controls;
// var music = document.querySelector('#music');
var clicky = 0;
var mouseX = 1;
var mouseY = 1;
var currentBoost = new THREE.Matrix4().set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);

var decorationArray = [
  'monkey', 
  'cubeDual', 
  'truncatedCube', 
  'truncatedCubeTrisOnly',
  'truncatedCubeBdry', 
  'truncatedCubeMinimal',
  'screen2Cube',
  'cube',
  'rhombicDodec'
  ];

var decoration = "truncatedCube";
var colourMode = 0;

var doubleSided = false;

var numObjects = 1; //number of obj files to load
var numGens = tilingGens.length;
var tilingDepth = 4; //default 4

var unpackTriple = makeTsfmsList( tilingGens, tilingDepth );
var tsfms = unpackTriple[0];
var words = unpackTriple[1];
var cumulativeNumTsfms = unpackTriple[2];

var numTiles = tsfms.length;
var bigMatArray = new Array(numObjects * numTiles);

var movedTowardsCentralCubeThisFrameIndex = false;

function loadStuff(){ 
  
  var manager = new THREE.LoadingManager();
  var loader = new THREE.OBJLoader(manager);
  
  if (decoration == "monkey"){

    loader.load('media/monkey_7.5k_tris.obj', function (object) {
      for (var i = 0; i < cumulativeNumTsfms[1]; i++) {
        var newObject = object.clone();
        newObject.children[0].material = bigMatArray[(i)];
        // newObject.children[0].frustumCulled = false;
        scene.add(newObject);
      }
    });

      loader.load('media/monkey_3k_tris.obj', function (object) {
      for (var i = cumulativeNumTsfms[1]; i < cumulativeNumTsfms[2]; i++) {
        var newObject = object.clone();
        newObject.children[0].material = bigMatArray[(i)];
        // newObject.children[0].frustumCulled = false;
        scene.add(newObject);
      }
    });

      loader.load('media/monkey_250_tris.obj', function (object) {
      for (var i = cumulativeNumTsfms[2]; i < cumulativeNumTsfms[3]; i++) {
        var newObject = object.clone();
        newObject.children[0].material = bigMatArray[(i)];
        // newObject.children[0].frustumCulled = false;
        scene.add(newObject);
      }
    });

      loader.load('media/monkey_150_tris.obj', function (object) {
      for (var i = cumulativeNumTsfms[3]; i < numTiles; i++) {
        var newObject = object.clone();
        newObject.children[0].material = bigMatArray[(i)];
        // newObject.children[0].frustumCulled = false;
        scene.add(newObject);
      }
    });
  }

  else {

      loader.load('media/'.concat(decoration, '.obj'), function (object) {
      for (var i = 0; i < numTiles; i++) {
        var newObject = object.clone();
        newObject.children[0].material = bigMatArray[(i)];
        // newObject.children[0].frustumCulled = false;
        scene.add(newObject);
      }
    });
  }
  for (var k = 0; k < numObjects; k++) {
    for (var j = 0; j < numTiles; j++) {
      var i = j + numTiles*k;
      bigMatArray[i].uniforms['translation'].value = tsfms[j];
      bigMatArray[i].uniforms['cellColorQuat'].value = word2colorQuat( words[j] );
      // console.log(words[j]);
      // console.log(word2colorQuat( words[j] ));
      // console.log(bigMatArray[i].uniforms['userCellColorQuat'].value);


    // bigMatArray[i].visible = phraseOnOffMaps[currentPhrase][k];
    }
  }
} 



function init() {
  start = Date.now();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.x = 0;
  camera.position.z = 0;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  document.body.appendChild(renderer.domElement);

  controls = new THREE.VRControls(camera);

  effect = new THREE.VREffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  materialBase = new THREE.ShaderMaterial({
    uniforms: { // these are the parameters for the shader
      time: { // global time
        type: "f",
        value: 0.0
      },
      translation: { // quaternion that moves shifts the object, set once per object
        type: "m4",
        value: new THREE.Matrix4().set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
      },
      boost: {
        type: "m4",
        value: new THREE.Matrix4().set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
      },
      cellColorQuat: {
        type: "v4",
        value: new THREE.Quaternion( 0,0,0,1 )
      },
      userCellColorQuat: {  // which index colour the user is in
        type: "v4",
        value: new THREE.Quaternion( 0,0,0,1 )
      }
    },
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
  });
  
  if (doubleSided) {
    materialBase.side = THREE.DoubleSide;
  }

  // one material per object, since they have a different positions
  for (var i = 0; i < bigMatArray.length; i++) {
    bigMatArray[i] = materialBase.clone();
  }

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

  effect.render(scene, camera);
}


function animate() {
  controls.update();  // need to get movedTowardsCentralCubeThisFrameIndex before updating stuff


  for (var k = 0; k < numObjects; k++) {
    for (var j = 0; j < numTiles; j++) {
      var i = j + numTiles*k;
      bigMatArray[i].uniforms['boost'].value = currentBoost;
      // console.log(bigMatArray[i].uniforms['userCellColorQuat'].value);
      if (movedTowardsCentralCubeThisFrameIndex != false) {
        
        var tempQuat = new THREE.Quaternion();
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
  
  effect.render(scene, camera);
  requestAnimationFrame(animate);
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
