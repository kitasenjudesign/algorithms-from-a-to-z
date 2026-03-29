// "uniform vec2 resolution" is automatically added by GPUComputationRenderer as texture size
      uniform vec2 planeSize;
      uniform sampler2D ruleTex;
      uniform sampler2D areaTex;
      uniform vec2 ruleTexSize;
      uniform float counter;
      uniform float rule;
      vec2 textureSize = resolution;


      vec3 getRuleValue(vec3 ruleIndex, float keta){     
        float value1 = step(0.5,
          texture2D( ruleTex,vec2( keta/ruleTexSize.x,ruleIndex.x/ruleTexSize.y)).r
        );
        float value2 = step(0.5,
          texture2D( ruleTex,vec2( keta/ruleTexSize.x,ruleIndex.y/ruleTexSize.y)).r
        );
        float value3 = step(0.5,
          texture2D( ruleTex,vec2( keta/ruleTexSize.x,ruleIndex.z/ruleTexSize.y)).r
        );
        return vec3(value1,value2,value3);      
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
      vec3 status(in vec2 offset) {
        vec2 posCoord = convertFromTexCoordToPosCoord(floor(gl_FragCoord.xy)) + offset;

        // boundary condition
        /*
        posCoord.x = posCoord.x < 0.0 ? planeSize.x - 1.0 : posCoord.x;
        posCoord.x = posCoord.x > planeSize.x ? 0.0 : posCoord.x;
        posCoord.y = posCoord.y < 0.0 ? planeSize.y - 1.0 : posCoord.y;
        posCoord.y = posCoord.y > planeSize.y ? 0.0 : posCoord.y;
        */

        posCoord.x = posCoord.x < 1.0 ? 1.0 : posCoord.x;
        posCoord.y = posCoord.y < 1.0 ? 1.0 : posCoord.y;

        posCoord.x = posCoord.x > planeSize.x-1.0 ? planeSize.x-1.0 : posCoord.x;
        posCoord.y = posCoord.y > planeSize.y-1.0 ? planeSize.y-1.0 : posCoord.y;


        vec2 texCoord = convertFromPosCoordToTexCoord(posCoord) + fract(gl_FragCoord.xy);
        
        //0.1,0.2,0.3を1.0,2.0,3.0にする
        vec3 nn = step(
          vec3(0.5,0.5,0.5),
          texture2D(textureLifeGame, texCoord / textureSize.xy).xyz
        );
        
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

        float dir = 1.0;//mix(1.0,-1.0,step(0.5,fract(counter*0.05 + ratio.x)));

        //if(ratio.x<0.5) dir = 1.0;

        vec3 aa = status(vec2(-1.0,dir*1.0));
        vec3 bb = status(vec2(0.0, dir*1.0));
        vec3 cc = status(vec2(1.0, dir*1.0));


        vec3 center = status(vec2(0.0,0.0));

        vec4 areaColor = texture2D( areaTex, ratio );
        vec3 rule1 =  floor( areaColor.xyz * 256.0 );
        //184.0;//floor( texture2D( ruleTex, ratio ).y * 256.0-0.0001 );
        /*
        if(rule1.x>100.0){
          aa = status(vec2(dir*1.0, -1.0));
          bb = status(vec2(dir*1.0, 0.0));
          cc = status(vec2(dir*1.0, 1.0));   
        }*/

        //184.0 - floor(ratio.y*10.0);

        if(ratio.y<1.0-1.0/textureSize.y){
            
            vec3 ruleA = getRuleValue(rule1,0.0);
            vec3 ruleB = getRuleValue(rule1,1.0);
            vec3 ruleC = getRuleValue(rule1,2.0);
            vec3 ruleD = getRuleValue(rule1,2.0);
            vec3 ruleE = getRuleValue(rule1,3.0);
            vec3 ruleF = getRuleValue(rule1,4.0);
            vec3 ruleG = getRuleValue(rule1,5.0);
            vec3 ruleH = getRuleValue(rule1,6.0);
            
            if(aa.x==1.0 && bb.x==1.0 && cc.x==1.0) center.x = ruleA.x;
            if(aa.x==1.0 && bb.x==1.0 && cc.x==0.0) center.x = ruleB.x;
            if(aa.x==1.0 && bb.x==0.0 && cc.x==1.0) center.x = ruleC.x;
            if(aa.x==1.0 && bb.x==0.0 && cc.x==0.0) center.x = ruleD.x;
            if(aa.x==0.0 && bb.x==1.0 && cc.x==1.0) center.x = ruleE.x;
            if(aa.x==0.0 && bb.x==1.0 && cc.x==0.0) center.x = ruleF.x;
            if(aa.x==0.0 && bb.x==0.0 && cc.x==1.0) center.x = ruleG.x;
            if(aa.x==0.0 && bb.x==0.0 && cc.x==0.0) center.x = ruleH.x;

            if(aa.y==1.0 && bb.y==1.0 && cc.y==1.0) center.y = ruleA.y;
            if(aa.y==1.0 && bb.y==1.0 && cc.y==0.0) center.y = ruleB.y;
            if(aa.y==1.0 && bb.y==0.0 && cc.y==1.0) center.y = ruleC.y;
            if(aa.y==1.0 && bb.y==0.0 && cc.y==0.0) center.y = ruleD.y;
            if(aa.y==0.0 && bb.y==1.0 && cc.y==1.0) center.y = ruleE.y;
            if(aa.y==0.0 && bb.y==1.0 && cc.y==0.0) center.y = ruleF.y;
            if(aa.y==0.0 && bb.y==0.0 && cc.y==1.0) center.y = ruleG.y;
            if(aa.y==0.0 && bb.y==0.0 && cc.y==0.0) center.y = ruleH.y;

            if(aa.z==1.0 && bb.z==1.0 && cc.z==1.0) center.z = ruleA.z;
            if(aa.z==1.0 && bb.z==1.0 && cc.z==0.0) center.z = ruleB.z;
            if(aa.z==1.0 && bb.z==0.0 && cc.z==1.0) center.z = ruleC.z;
            if(aa.z==1.0 && bb.z==0.0 && cc.z==0.0) center.z = ruleD.z;
            if(aa.z==0.0 && bb.z==1.0 && cc.z==1.0) center.z = ruleE.z;
            if(aa.z==0.0 && bb.z==1.0 && cc.z==0.0) center.z = ruleF.z;
            if(aa.z==0.0 && bb.z==0.0 && cc.z==1.0) center.z = ruleG.z;
            if(aa.z==0.0 && bb.z==0.0 && cc.z==0.0) center.z = ruleH.z;
        }
         

        vec4 oo = vec4(1.0,0.0,1.0,1.0);
       

        oo.xyz = center.xyz;//ここ
        //oo.x += blink;

        gl_FragColor = oo;
         
      }