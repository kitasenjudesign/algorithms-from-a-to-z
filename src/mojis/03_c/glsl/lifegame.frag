      uniform sampler2D textureLifeGame;
      uniform sampler2D textureLifeGame2;
      uniform sampler2D colorTex;
      uniform sampler2D areaTex;
      uniform sampler2D ruleTex;
      
      uniform sampler2D dotTex;
      uniform sampler2D dotTex2;
      uniform sampler2D dotTex3;
      uniform sampler2D dotTex4;

      uniform vec2 areaTexSize;
      uniform vec2 planeSize;
      uniform vec2 textureSize;
      uniform float time;
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
        vec2 posCoord = vUv * planeSize;//planeSize=512とか
        vec2 texCoord1 = convertFromPosCoordToTexCoord(floor(posCoord+vec2(-1.0,0.0)));
        vec2 texCoord2 = convertFromPosCoordToTexCoord(floor(posCoord));
        vec2 texCoord3 = convertFromPosCoordToTexCoord(floor(posCoord+vec2(1.0,0.0)));

        vec3 rgb1 = texture2D(textureLifeGame, texCoord1 / textureSize).rgb;
        vec3 rgb2 = texture2D(textureLifeGame, texCoord2 / textureSize).rgb;
        vec3 rgb3 = texture2D(textureLifeGame, texCoord3 / textureSize).rgb;

        vec3 rgb1_old = texture2D(textureLifeGame2, texCoord1 / textureSize).rgb;


        vec3 op = vec3(0.1,0.1,0.1);//rgb.xyz;

        vec3 col = texture2D(areaTex, vUv.xy).rgb;
        
        //op.xyz = mix(op.xyz,vec3(0.0,0.0,1.0),col.x);
        
        //dot----------------------------------------
        
        vec2 dotUV = vUv;
        float rez = 256.0;//64.0;//128.0;
        dotUV = fract(dotUV*rez);

        float t = floor(time);
        op.xyz=rgb2.rgb;

          vec4 dotCol1 = texture2D(dotTex, dotUV);
          vec4 dotCol2 = texture2D(dotTex2, dotUV);
          vec4 dotCol3 = texture2D(dotTex3, dotUV);
          vec4 dotCol4 = texture2D(dotTex4, dotUV);

        if(rgb2.x>0.5){
          if(rgb1.x>0.5 && rgb3.x<0.5){
            op.x = dotCol3.x;// 110
          }else if(rgb1.x<0.5 && rgb3.x>0.5){
            op.x = dotCol1.x;// 011
          }else if(rgb1.x>0.5 && rgb3.x>0.5){
            op.x = dotCol2.x;// 111    
          }else{
            op.x = dotCol4.x;//010
          }
        }
        
        if(rgb2.y>0.5){
          if(rgb1.y>0.5 && rgb3.y<0.5){
            op.y = dotCol3.y;// 110
          }else if(rgb1.y<0.5 && rgb3.y>0.5){
            op.y = dotCol1.y;// 011
          }else if(rgb1.y>0.5 && rgb3.y>0.5){
            op.y = dotCol2.y;// 111    
          }else{
            op.y = dotCol4.y;//010
          }
        }        
        if(rgb2.z>0.5){
          if(rgb1.z>0.5 && rgb3.z<0.5){
            op.z = dotCol3.z;// 110
          }else if(rgb1.z<0.5 && rgb3.z>0.5){
            op.z = dotCol1.z;// 011
          }else if(rgb1.z>0.5 && rgb3.z>0.5){
            op.z = dotCol2.z;// 111    
          }else{
            op.z = dotCol4.z;
          }
        }

        float avv = (op.x+op.y+op.z)/3.0;
        if(op.z>0.0) avv += 1.0;


        gl_FragColor = vec4(avv,avv,avv,1.0);
        //vec4(v > 0.5 ? vec3(0.0, 0.0, 1.0) : vec3(0.8, 0.8, 0.8), 1.0);
      }