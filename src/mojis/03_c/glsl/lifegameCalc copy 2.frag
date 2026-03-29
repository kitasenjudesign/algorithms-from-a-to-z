// "uniform vec2 resolution" is automatically added by GPUComputationRenderer as texture size
      uniform vec2 planeSize;
      uniform sampler2D ruleTex;
      uniform sampler2D areaTex;
      uniform vec2 ruleTexSize;
      uniform float counter;
      uniform float rule;
      vec2 textureSize = resolution;


      int getRuleValue(float ruleIndex, float keta){     
        vec3 value = step(
          0.5,
          texture2D( 
            ruleTex,
            vec2( 
              keta/ruleTexSize.x,
              ruleIndex/ruleTexSize.y//1/256
            )
          ).rgb
        );
        return int(value.x);      
      }

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
        int nn = int(step(0.5,texture2D(textureLifeGame, texCoord / textureSize.xy).x));//0,1,2

        //nn = int( mod( float(nn),float(maxStatus) ) );
        return nn; 
      }

      //int getLive(in vec2 offset, int nn, int maxStatus){
      //  return int( status(offset,maxStatus) == nn );
      //}




      void main() {
        // checks whether current position is used or not
        if (!isInPosCoordRange(floor(gl_FragCoord.xy))) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          return;
        }




        vec2 ratio = gl_FragCoord.xy/planeSize.xy;
        

        int neighbor = 0;
        vec4 areaColor = texture2D( areaTex, ratio );
        
        float dirX = areaColor.y>0.5 ? -1.0 : 1.0;//mix(1.0,-1.0,step(0.5,fract(counter*0.05 + ratio.x)));
        float dirY = areaColor.z>0.5 ? -1.0 : 1.0;
        
        int aa = status(vec2(-1.0,dirX*1.0));
        int bb = status(vec2(0.0, dirX*1.0));
        int cc = status(vec2(1.0, dirX*1.0));

/*
        if(dirY>0.5){
          aa = status(vec2(dirX*1.0,-1.0));
          bb = status(vec2(dirX*1.0,0.0));
          cc = status(vec2(dirX*1.0,1.0));
        }*/


        int center = status(vec2(0.0,0.0));

        
        float blink = 0.0;//areaColor.x;
        float rule1 =  floor( areaColor.x * 256.0 );
        //184.0;//floor( texture2D( ruleTex, ratio ).y * 256.0-0.0001 );

        //184.0 - floor(ratio.y*10.0);

        if(ratio.y<1.0-1.0/textureSize.y){
            //float rule = 54.0;

            if(aa==1 && bb==1 && cc==1) center = getRuleValue(rule1,0.0);
            if(aa==1 && bb==1 && cc==0) center = getRuleValue(rule1,1.0);
            if(aa==1 && bb==0 && cc==1) center = getRuleValue(rule1,2.0);
            if(aa==1 && bb==0 && cc==0) center = getRuleValue(rule1,3.0);
            if(aa==0 && bb==1 && cc==1) center = getRuleValue(rule1,4.0);
            if(aa==0 && bb==1 && cc==0) center = getRuleValue(rule1,5.0);
            if(aa==0 && bb==0 && cc==1) center = getRuleValue(rule1,6.0);
            if(aa==0 && bb==0 && cc==0) center = getRuleValue(rule1,7.0);

       }
         

        vec4 oo = vec4(1.0,0.0,1.0,1.0);
        float brightness = float(center);


        //debug
        //brightness = float(
        //  getRuleValue(rule,floor(ratio.x*7.99))
        //);
        //brightness = texture2D( ruleTex,ratio ).x;

        //if(ratio.y>1.0-1.0/textureSize.y && ratio.x<0.01){
        //  brightness = random(ratio+vec2(0.0,counter));
        //}


        oo.xyz = vec3(brightness,brightness,brightness);//ここ
        //oo.x += blink;

        gl_FragColor = oo;
         
      }