// "uniform vec2 resolution" is automatically added by GPUComputationRenderer as texture size
      uniform vec2 planeSize;
      uniform sampler2D ruleTex;
      uniform sampler2D areaTex;
      uniform vec2 ruleTexSize;
      uniform float counter;
      vec2 textureSize = resolution;

      float random(vec2 co){
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      bool isInPosCoordRange(in vec2 texCoord) {
        float v = texCoord.x + texCoord.y * textureSize.x;
        return v <= (planeSize.x * planeSize.y);
      }

      float div(in float a, in float b) {
        return floor(a / b);
      }

      float modulo(in float a, in float b) {
        return a - floor(a / b) * b;
      }

      vec2 convertFromTexCoordToPosCoord(in vec2 texCoord) {
        float idx = texCoord.x + texCoord.y * textureSize.x;
        return vec2(modulo(idx, planeSize.x), div(idx, planeSize.x));
      }

      vec2 convertFromPosCoordToTexCoord(in vec2 posCoord) {
        float idx = posCoord.x + posCoord.y * planeSize.x;
        return vec2(modulo(idx, textureSize.x), div(idx, textureSize.x));
      }

      //0.0,0.1,0.2を0,1,2
      int status(in vec2 offset) {
        vec2 posCoord = convertFromTexCoordToPosCoord(floor(gl_FragCoord.xy)) + offset;

        // boundary condition
        posCoord.x = posCoord.x < 0.0 ? planeSize.x - 1.0 : posCoord.x;
        posCoord.x = posCoord.x > planeSize.x ? 0.0 : posCoord.x;
        posCoord.y = posCoord.y < 0.0 ? planeSize.y - 1.0 : posCoord.y;
        posCoord.y = posCoord.y > planeSize.y ? 0.0 : posCoord.y;

        vec2 texCoord = convertFromPosCoordToTexCoord(posCoord) + fract(gl_FragCoord.xy);
        
        //0.1,0.2,0.3を1.0,2.0,3.0にする
        return int(texture2D(textureLifeGame, texCoord / textureSize.xy).x*10.0);//0,1,2
      }

      int getLive(in vec2 offset, int nn){
        return int( status(offset) == nn );
      }


      float texA(float ruleIndex, float neighbor, vec3 ch){     
        vec3 value = step(
          0.5,
          texture2D( 
            ruleTex,
            vec2( neighbor/ruleTexSize.x, ruleIndex/ruleTexSize.y)
          ).rgb
        );
        return dot(value.rgb,ch);        
      }


      void main() {
        // checks whether current position is used or not
        if (!isInPosCoordRange(floor(gl_FragCoord.xy))) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          return;
        }

        vec2 ratio = gl_FragCoord.xy/planeSize.xy;

        float ox = 0.0;
        float oy = 0.0;

        int center = status(vec2(0.0, 0.0));
        int nextVal = center + 1;

        //http://www.mirekw.com/ca/rullex_cycl.html

        if(fract(ratio.y*4.0)<0.5){
          if(nextVal >= 1) nextVal = 0;//した
        }else{
          if(nextVal >= 3) nextVal = 0;//上
        }

        int neighbor = 0;
        for(float i=-1.0;i<=1.0;i++){
          for(float j=-1.0;j<=1.0;j++){
            neighbor += getLive(vec2(i+ox, j+oy),nextVal);
          }
        }

        vec4 oo = vec4(0.0,0.0,0.0,1.0);

        //閾値
        if(fract(ratio.y*4.0)<0.5){
          if(neighbor >= 2) center = nextVal;//した
        }else{
          if(neighbor >= 3) center = nextVal;//上。
        }

        float cc = float(center)/10.0;
        oo.xyz = vec3(cc,cc,cc);//ここ


        gl_FragColor = oo;
         

      }