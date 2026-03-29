#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aPosition;
//aPosition is automatically passed from p5 (x,y,z)

void main() {

  // There is a bug with p5, which makes the aPosition aligned in the top-right corner. This is the scaling to fix that
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0; 

  
  // Send the vertex information on to the fragment shader. Need to return a vec4 (x,y,z,w)
  gl_Position = positionVec4;
}