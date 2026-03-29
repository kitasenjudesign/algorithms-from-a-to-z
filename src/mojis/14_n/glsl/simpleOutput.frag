precision highp float;
uniform sampler2D tex;
uniform sampler2D velTex;
uniform float time;
varying vec2 uv;

void main() {    
  
  vec4 tt = texture2D(tex, uv);
  vec4 vel = texture2D(velTex, uv);
  
  //tt.rgb += vel.rgb * 0.2;

  //tt.rgb = smoothstep(0.49,0.51,tt.rgb);

  gl_FragColor = vec4(tt.rgb,1.0);

}