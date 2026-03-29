      uniform sampler2D textureLifeGame;
      uniform sampler2D textureLifeGame2;
      uniform sampler2D colorTex;
      uniform sampler2D areaTex;
      uniform sampler2D ruleTex;
      uniform sampler2D dotTex;

      uniform vec2 areaTexSize;
      uniform vec2 planeSize;
      uniform vec2 textureSize;
      varying vec2 vUv;
      uniform float flag;

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


        // 極座標変換
        float radius = length(uv - vec2(0.5, 0.5));
        float theta = atan(uv.y - 0.5, uv.x - 0.5);
    
        // 新しいUV座標に変換
        vec2 polarUV;
        polarUV.x = theta / (2.0 * 3.14159265359) + 0.5; // 正規化
        polarUV.y = radius;
    
        // テクスチャをサンプリング
        //color = texture(myTexture, polarUV);


        vec2 uvvv = uv;
        if(flag==1.0) uvvv = polarUV;

        
        vec3 rgb = texture2D(
          textureLifeGame,
          uvvv
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

       float res = 256.0;
        vec2 dotUV1 = vUv;
        dotUV1 = fract(dotUV1*res);

        if(mod(floor(vUv.y*res),2.0)==0.0){
          dotUV1.y = 1.0 - dotUV1.y;
        }

        vec4 dotColA = texture2D(dotTex, dotUV1);
        
        vec3 op = rgb.xxx;//yz;

        op.x = dot(op.xyz,dotColA.xyz);
        op.y = dot(op.xyz,dotColA.xyz);
        op.z = dot(op.xyz,dotColA.xyz);


        //vec3 col = texture2D(areaTex, vUv.xy).rgb;
        
        //op.xyz = mix(op.xyz,vec3(0.0,0.0,1.0),col.x);


        gl_FragColor = vec4(op.xyz,1.0);
        //vec4(v > 0.5 ? vec3(0.0, 0.0, 1.0) : vec3(0.8, 0.8, 0.8), 1.0);
      }