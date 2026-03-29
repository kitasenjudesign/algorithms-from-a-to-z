      uniform sampler2D textureLifeGame;
      uniform sampler2D textureLifeGame2;
      uniform sampler2D colorTex;
      uniform sampler2D areaTex;
      uniform sampler2D dotTex;
      uniform sampler2D dotTex2;
      uniform sampler2D dotTex3;
      
      uniform float resolution;

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

        // 極座標変換
        float radius = length(uv - vec2(0.5, 0.5));
        float theta = atan(uv.y - 0.5, uv.x - 0.5);
    
        // 新しいUV座標に変換
        vec2 polarUV;
        polarUV.y = 1.0-radius*2.0;
        polarUV.x = theta / (2.0 * 3.14159265359) + 0.5; // 正規化
        
        vec4 rgb = texture2D(textureLifeGame, uv);
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

        vec4 op = rgb;
        
        /*
        if(rgb.x>0.5 && rgbB.x<0.5) op = texture2D(colorTex, vec2(0.0,0.0)).rgb;
        else if(rgb.x<0.5 && rgbB.x>0.5) op = texture2D(colorTex, vec2(0.2,0.0)).rgb;
        else if(rgb.x>0.0) op=texture2D(colorTex, vec2(0.4,0.0)).rgb;

        op.xyz += 0.1*rgb2.rrr;
        op.xyz -= 0.2*random(vUv.xy);
        
        
        op.xyz += rgb2.rrr*0.2;
        */
        

        

        //if(henka.x>0.5) op.xyz = vec3(1.0,1.0,1.0);
        //if(henka.y>0.5) op.xyz = vec3(1.0,1.0,1.0);
        //if(henka.z>0.5) op.xyz = vec3(1.0,1.0,1.0);
        
        if(op.x+op.y+op.z>=2.0){
          //op.xyz = vec3(1.0,1.0,1.0);
        }

        if(op.x+op.y+op.z==0.0){
          if(op.a>0.5){
            //op.xyz = vec3(0.5,0.5,0.5);
          }
        }


        float res = resolution;//64.0;
        vec2 dotUV1 = vUv;
        dotUV1 = fract(dotUV1*res);

        if(mod(floor(vUv.y*res),2.0)==0.0){
          dotUV1.y = 1.0 - dotUV1.y;
        }

        vec2 dotUV2 = vUv;
        dotUV2 = fract(dotUV2*res);
        if(mod(floor(vUv.y*res),2.0)==0.0){
          dotUV2.y = 1.0 - dotUV2.y;
        }        


        vec2 dotUV3 = vUv;
        dotUV3 = fract(dotUV3*res);
        if(mod(floor(vUv.y*res),2.0)==0.0){
          dotUV3.y = 1.0 - dotUV3.y;
        }       

        vec4 dotColA = texture2D(dotTex, dotUV1);
        vec4 dotColB = texture2D(dotTex2, dotUV2);
        vec4 dotColC = texture2D(dotTex3, dotUV3);
        
        vec3 colOut = vec3(
          dot( op.xyz, vec3(dotColA.x,dotColB.x,dotColC.x) ),
          dot( op.xyz, vec3(dotColA.y,dotColB.y,dotColC.y) ),
          dot( op.xyz, vec3(dotColA.z,dotColB.z,dotColC.z) )
        );


        if(colOut.x==0.0 && colOut.y==0.0 && colOut.z==0.0){
          colOut.rgb = vec3(0.0,0.0,0.0);
        }

        gl_FragColor = vec4(colOut.xyz,1.0);
        //gl_FragColor = vec4(op.xyz,1.0);
        //vec4(v > 0.5 ? vec3(0.0, 0.0, 1.0) : vec3(0.8, 0.8, 0.8), 1.0);
      }