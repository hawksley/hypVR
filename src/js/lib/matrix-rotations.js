import { Matrix } from '../three-utils';

const RIGHT_ANGLE = Math.PI/2;
const rotx = new Matrix().makeRotationX( RIGHT_ANGLE );
const rotxi = new Matrix().makeRotationX( -RIGHT_ANGLE );
const roty = new Matrix().makeRotationY( RIGHT_ANGLE );
const rotyi = new Matrix().makeRotationY( -RIGHT_ANGLE );
const rotz = new Matrix().makeRotationZ( RIGHT_ANGLE );
const rotzi = new Matrix().makeRotationZ( -RIGHT_ANGLE );

export {
  rotx,
  rotxi,
  roty,
  rotyi,
  rotz,
  rotzi
};
