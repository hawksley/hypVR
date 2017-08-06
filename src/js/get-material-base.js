import {
  DoubleSide,
  Matrix,
  Quaternion,
  SHADER_MATERIAL
} from './three-utils';

const getMaterialBase = (doubleSided) => {
  let materialBase = SHADER_MATERIAL({
    uniforms: { // these are the parameters for the shader
      time: { // global time
        type: "f",
        value: 0.0
      },
      translation: { // quaternion that moves shifts the object, set once per object
        type: "m4",
        value: new Matrix().set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
      },
      boost: {
        type: "m4",
        value: new Matrix().set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
      },
      cellColorQuat: {
        type: "v4",
        value: new Quaternion( 0,0,0,1 )
      },
      userCellColorQuat: {  // which index colour the user is in
        type: "v4",
        value: new Quaternion( 0,0,0,1 )
      }
    },
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
  });

  if (doubleSided) {
    materialBase.side = DoubleSide;
  }

  return materialBase;
};

export default getMaterialBase;
