import {
  PerspectiveCamera
} from './three-utils';

const getCamera = (device) => (new PerspectiveCamera(80, device.innerWidth / device.innerHeight, 0.1, 100));

export default getCamera;
