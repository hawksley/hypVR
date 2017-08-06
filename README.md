# hypVR

Hyperbolic space with webVR support. WASD + Arrows to move, space or p to play/pause. Numbers 1-9 give different models.

A websperience by Vi Hart, Andrea Hawksley, and Henry Segerman, using the hyperbolic space prototype developed at a hyperbolic webVR "hackalot" with Vi Hart, Mike Stay, Henry Segerman, Andrea Hawksley, and Andrew Lutomirski, with help from Marc ten Bosch's 4d graphics shader, Jeff Week's Curved Spaces, Mozilla's webVR framework for THREEjs, etc.

Try it at: https://hawksley.github.io/hypVR/


## Installing Locally

The version 1.1.0 requires node.js version > 6 and should work with every os.

### Steps:
- git clone this project
- run "npm install" where you cloned this project
- run "npm start"

you should see the application run on http://localhost:8080
 Enjoy.

### Release Notes:
1.1.0: 
 - The application can be compiled with webpack to reduce dramatically the file size of the imported code
 - Less pollution of the global scope
 - using webVR polyfill, the application runs on browsers
 - the package host it own dev server to compile the code as each file save
 - the dev server can be run from an npm command

### Further Enhancements:
- finishing polishing the code to make it more granular and easy to modify
- introducing performance testing for big functions like gramShmidt
- introducing unit tests

## Links
- http://vihart.com
- http://andreahawksley.com
- http://segerman.org/
- http://reperiendi.wordpress.com/
- https://github.com/hawksley
- http://www.geometrygames.org/CurvedSpaces/
- http://www.marctenbosch.com
- https://github.com/MozVR/vr-web-examples/tree/master/threejs-vr-boilerplate
- https://github.com/AbdoulSy
