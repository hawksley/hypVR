import {
  Quaternion
} from './three-utils';

// It seems to be impossible to synchronously detect whether we have an orientation sensor.
// Even Chromium on the desktop has a 'deviceorientation' event, and it will fire once with
// all nulls.

class PhoneVR {
    constructor () {
      this.deviceAlpha = null;
      this.deviceGamma = null;
      this.deviceBeta = null;

      window.addEventListener('deviceorientation', function(orientation) {
          this.deviceAlpha = orientation.alpha;
          this.deviceGamma = orientation.gamma;
          this.deviceBeta = orientation.beta;
      }.bind(this));
  }

  orientationIsAvailable () {
      return this.deviceAlpha !== null;
  }

  rotationQuat () {
      if (!this.orientationIsAvailable())
          return null;

      var degtorad = Math.PI / 180; // Degree-to-Radian conversion
      var z = this.deviceAlpha * degtorad / 2;
      var x = this.deviceBeta * degtorad / 2;
      var y = this.deviceGamma * degtorad / 2;
      var cX = Math.cos(x);
      var cY = Math.cos(y);
      var cZ = Math.cos(z);
      var sX = Math.sin(x);
      var sY = Math.sin(y);
      var sZ = Math.sin(z);

      // ZXY quaternion construction.
      var w = cX * cY * cZ - sX * sY * sZ;
      var x = sX * cY * cZ - cX * sY * sZ;
      var y = cX * sY * cZ + sX * cY * sZ;
      var z = cX * cY * sZ + sX * sY * cZ;

      var deviceQuaternion = new Quaternion(x, y, z, w);

      // Correct for the screen orientation.
      var screenOrientation = (this.getScreenOrientation() * degtorad)/2;
      var screenTransform = new Quaternion(0, 0, -Math.sin(screenOrientation), Math.cos(screenOrientation));

      var deviceRotation = new Quaternion();
      deviceRotation.multiplyQuaternions(deviceQuaternion, screenTransform);

      // deviceRotation is the quaternion encoding of the transformation
      // from camera coordinates to world coordinates.  The problem is that
      // our shader uses conventional OpenGL coordinates
      // (+x = right, +y = up, +z = backward), but the DeviceOrientation
      // spec uses different coordinates (+x = East, +y = North, +z = up).
      // To fix the mismatch, we need to fix this.  We'll arbitrarily choose
      // North to correspond to -z (the default camera direction).
      var r22 = Math.sqrt(0.5);
      deviceRotation.multiplyQuaternions(new Quaternion(-r22, 0, 0, r22), deviceRotation);

      return deviceRotation;
  }

  getScreenOrientation () {
    switch (window.screen.orientation || window.screen.mozOrientation) {
      case 'landscape-primary':
        return 90;
      case 'landscape-secondary':
        return -90;
      case 'portrait-secondary':
        return 180;
      case 'portrait-primary':
        return 0;
    }
    if (window.orientation !== undefined)
      return window.orientation;
  }
}

window.PhoneVR = PhoneVR;

export default PhoneVR;
