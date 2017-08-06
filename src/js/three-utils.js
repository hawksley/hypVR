import 'three';

export const MESH = new THREE.Mesh();
export const MATRIX4 = new THREE.Matrix4();
export const Matrix = THREE.Matrix4;
export const DoubleSide = THREE.DoubleSide;
export const SCENE = new THREE.Scene();
export const RENDERER = (props) => (new THREE.WebGLRenderer(props));
export const CONTROLS = (camera) => (new THREE.VRControls(camera));
export const VREFFECT = (renderer) => (new THREE.VREffect(renderer));
export const LOADING_MANAGER = new THREE.LoadingManager();
export const OBJLOADER = (manager) => (new THREE.OBJLoader(manager));
export const QUATERNION = new THREE.Quaternion();
export const SHADER_MATERIAL = (props) => (new THREE.ShaderMaterial(props));
export const Vector3 = THREE.Vector3;
export const Quaternion = THREE.Quaternion;
export const PerspectiveCamera = THREE.PerspectiveCamera;
