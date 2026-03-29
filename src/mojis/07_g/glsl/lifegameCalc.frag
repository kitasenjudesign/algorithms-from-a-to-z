#pragma glslify: random = require(glsl-random)
// "uniform vec2 resolution" is automatically added by GPUComputationRenderer as texture size
      
      uniform vec2 planeSize;
      uniform sampler2D ruleTex;
      uniform sampler2D areaTex;
      uniform vec2 ruleTexSize;
      uniform float counter;
      uniform float numRule;
      vec2 textureSize = resolution;

      //float random(vec2 co){
      //    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      //}

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

      vec4 status(in vec2 offset) {
        vec2 posCoord = convertFromTexCoordToPosCoord(floor(gl_FragCoord.xy)) + offset;

        // boundary condition
        /*
        posCoord.x = posCoord.x < 0.0 ? planeSize.x - 1.0 : posCoord.x;
        posCoord.x = posCoord.x > planeSize.x ? 0.0 : posCoord.x;
        posCoord.y = posCoord.y < 0.0 ? planeSize.y - 1.0 : posCoord.y;
        posCoord.y = posCoord.y > planeSize.y ? 0.0 : posCoord.y;
*/
        vec2 texCoord = convertFromPosCoordToTexCoord(posCoord) + fract(gl_FragCoord.xy);
        return texture2D(textureLifeGame, texCoord / textureSize.xy);
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
        

        float os = 1.0;
        vec4 center = status(vec2(0.0, 0.0));
        vec3 neighbor = vec3(0.0,0.0,0.0);

        neighbor += status(vec2(os*-1.0+ox, os*1.0+oy)).xyz;
        neighbor += status(vec2(os*0.0+ox, os*1.0+oy)).xyz;
        neighbor += status(vec2(os*1.0+ox, os*1.0+oy)).xyz;
        neighbor += status(vec2(os*-1.0+ox, os*0.0+oy)).xyz;
        neighbor += status(vec2(os*1.0+ox, os*0.0+oy)).xyz;
        neighbor += status(vec2(os*-1.0+ox, os*-1.0+oy)).xyz;
        neighbor += status(vec2(os*0.0+ox, os*-1.0+oy)).xyz;
        neighbor += status(vec2(os*1.0+ox, os*-1.0+oy)).xyz;


        vec4 oo = vec4(0.0,0.0,0.0,0.0);
        vec2 ruleUV = ratio.xy;
        //ruleUV.y = fract(ruleUV.y);

        //areaTexの問題
        vec3 rule = floor(
          texture2D( areaTex,ruleUV ) * numRule
        ).xyz;

        vec3 sum = vec3(0.0,0.0,0.0);
        if(center.x==1.0){//centerの状態
          sum.x = texA(rule.x, float(neighbor.x),vec3(1.0,0.0,0.0) );
        }
        if(center.y==1.0){//centerの状態
          sum.y = texA(rule.y, float(neighbor.y),vec3(1.0,0.0,0.0) );
        }
        if(center.z==1.0){//centerの状態
          sum.z = texA(rule.z, float(neighbor.z),vec3(1.0,0.0,0.0) );
        }

        if(center.x==0.0){
          sum.x = texA(rule.x,float(neighbor.x),vec3(0.0,1.0,0.0) );
        }
        if(center.y==0.0){
          sum.y = texA(rule.y,float(neighbor.y),vec3(0.0,1.0,0.0) );
        }
        if(center.z==0.0){
          sum.z = texA(rule.z,float(neighbor.z),vec3(0.0,1.0,0.0) );
        }

        //oo.xyz=sum.xyz;//ここ
        oo.xyz = sum.xyz;//ここ
        oo.a = max(oo.x,center.a);

        gl_FragColor = oo;
         

      }