    //<script id="fragment_shader1" type="x-shader/x-fragment">
    
    uniform vec2 resolution;
    uniform float time;
    uniform float colorId;
    varying vec3 vNormal;
    varying vec2 vUv;

    vec3 rgb2hsb(vec3 c){
      vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
      vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
      vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
  
      float d = q.x - min(q.w, q.y);
      float e = 1.0e-10;
      return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }
  
    vec3 hsb2rgb(vec3 c){
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }    

    float random (vec2 st) {
      return fract(sin(dot(st.xy,
                           vec2(12.9898,78.233)))*
          43758.5453123);
    }
  
    void main(void)
    {
      vec3 N = normalize(vNormal);
      vec3 L = normalize(vec3(0.1,0.8,1.0));
      float dotNL = dot(N,L);
      
      //float v = abs( random(vNormal.xy) );
      vec3 offset = vec3(0.9,0.9,0.9);
      vec3 col = vNormal.xyz * dotNL * 0.2 + offset;
      
      col = rgb2hsb(col);
      col.x += colorId;
      col.y += 0.01;
      col = hsb2rgb(col);

      gl_FragColor=vec4(col.rgb,1.0);
    }
  //</script>