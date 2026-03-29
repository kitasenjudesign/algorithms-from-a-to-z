      uniform sampler2D tex;
      uniform sampler2D areaTex;
      uniform vec2 areaTexSize;
      uniform vec2 planeSize;
      uniform vec2 textureSize;
      uniform float zoom;
      varying vec2 vUv;

      float div(in float a, in float b) {
        return floor(a / b);
      }

      float modulo(in float a, in float b) {
        return a - floor(a / b) * b;
      }

      vec2 convertFromPosCoordToTexCoord(in vec2 posCoord) {
        float idx = posCoord.x + posCoord.y * planeSize.x;
        return vec2(modulo(idx, textureSize.x), div(idx, textureSize.x));
      }

      float random(vec2 co){
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }


      void main() {
        
        //vec2 posCoord = vUv * vec2(32.0,32.0);
        //vec2 texCoord = convertFromPosCoordToTexCoord(floor(posCoord));
        //vec4 big = texture2D(tex, texCoord / vec2(32.0,32.0));

        
        float s = 0.03+zoom*0.97;//zoom;
        vec2 center = vec2(0.5,0.5);
        vec2 vUvv = (vUv - center) * s + center;
        
        vec2 uvv = fract(vUvv*31.0);        
        vec4 small = texture2D(tex, uvv);
        vec4 big = texture2D(tex,vUvv);


        big = mix(vec4(1.0,1.0,1.0,1.0),big,smoothstep(0.0,0.9,s));

        vec4 sss = vec4( abs( small.rgb - big.rgb ),1.0);
        vec4 final = mix(sss,big,smoothstep(0.80,0.95,s));

        gl_FragColor = final;

      }