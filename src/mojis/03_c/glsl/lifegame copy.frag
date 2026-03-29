      uniform sampler2D textureLifeGame;
      uniform sampler2D textureLifeGame2;
      uniform sampler2D colorTex;
      uniform sampler2D areaTex;
      uniform sampler2D ruleTex;

      uniform vec2 areaTexSize;
      uniform vec2 planeSize;
      uniform vec2 textureSize;
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
        vec2 posCoord = vUv * planeSize;
        vec2 texCoord = convertFromPosCoordToTexCoord(floor(posCoord));
        
        vec2 uv = texCoord / textureSize;
        vec3 rgb = texture2D(
          textureLifeGame, uv
        ).rgb;
        vec3 rgbB = texture2D(textureLifeGame2, texCoord / textureSize).rgb;

        vec3 rgb2 = texture2D(areaTex, vUv.xy).rgb;
        // alive cells are filled with green and dead ones with black
        vec3 henka = step(0.5,abs(rgb.xyz-rgbB.xyz));

        //rgbに色あり→rgbBあり・な
        //rgbに色なし→rgbBあり・なし

        //4パターンの状況がある

        //かわらない 0,0 1,1
        //新しく生まれた
        //死んだ



        vec3 op = rgb.xxx;//yz;

        //vec3 col = texture2D(areaTex, vUv.xy).rgb;
        
        //op.xyz = mix(op.xyz,vec3(0.0,0.0,1.0),col.x);


        gl_FragColor = vec4(op.xyz,1.0);
        //vec4(v > 0.5 ? vec3(0.0, 0.0, 1.0) : vec3(0.8, 0.8, 0.8), 1.0);
      }