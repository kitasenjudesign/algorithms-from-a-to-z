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

      vec3 status(in vec2 offset) {
        vec2 posCoord = convertFromTexCoordToPosCoord(floor(gl_FragCoord.xy)) + offset;

        // boundary condition
        posCoord.x = posCoord.x < 0.0 ? planeSize.x - 1.0 : posCoord.x;
        posCoord.x = posCoord.x > planeSize.x ? 0.0 : posCoord.x;
        posCoord.y = posCoord.y < 0.0 ? planeSize.y - 1.0 : posCoord.y;
        posCoord.y = posCoord.y > planeSize.y ? 0.0 : posCoord.y;

        vec2 texCoord = convertFromPosCoordToTexCoord(posCoord) + fract(gl_FragCoord.xy);
        return texture2D(textureLifeGame, texCoord / textureSize.xy).xyz;
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
        vec3 neighbor = 0;

        neighbor += status(vec2(-1.0+ox, 1.0+oy));
        neighbor += status(vec2(0.0+ox, 1.0+oy));
        neighbor += status(vec2(1.0+ox, 1.0+oy));
        neighbor += status(vec2(-1.0+ox, 0.0+oy));
        neighbor += status(vec2(1.0+ox, 0.0+oy));
        neighbor += status(vec2(-1.0+ox, -1.0+oy));
        neighbor += status(vec2(0.0+ox, -1.0+oy));
        neighbor += status(vec2(1.0+ox, -1.0+oy));

        //neighbor += status(vec2(-2.0+ox, 0.0+oy));
        //neighbor += status(vec2( 2.0+ox, 0.0+oy));
        //neighbor += status(vec2( 0.0+ox, 2.0+oy));
        //neighbor += status(vec2( 0.0+ox, -2.0+oy));
        // x == 1 means cell is alive and x == 0 means cell is dead

        vec4 oo = vec4(0.0,0.0,0.0,1.0);
        vec2 ruleUV = ratio.xy;
        //ruleUV.y = fract(ruleUV.y);

        float rule = floor(
          texture2D( areaTex,ruleUV ).y * numRule
        );
        //floor( (0.5+0.5*sin(ratio.y*2.0*3.1415+0.01*counter)) * 9.0 );

        //９つtex2Dする
        //
        float sum = 0.0;
        if(center==1){//centerの状態
          sum = texA(rule, float(neighbor),vec3(1.0,0.0,0.0) );
        }
        if(center==0){
          sum = texA(rule,float(neighbor),vec3(0.0,1.0,0.0) );
        }

        oo.xyz = vec3(sum,sum,sum);//ここ

        /*
        if( random(gl_FragCoord.xy+0.1*counter)>0.998){
          oo.xyz = mix(
            vec3(0.0,0.0,0.0),
            vec3(1.0,1.0,1.0),
            abs(random(gl_FragCoord.xy*12.0+0.99*counter))
          );
        }*/

        gl_FragColor = oo;
         

      }