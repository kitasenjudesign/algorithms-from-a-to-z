  //#pragma glslify: random = require(glsl-random)


  precision highp float;

  uniform sampler2D baseTex;//元画像
  uniform sampler2D inputTex;//毎回入力される画像
  uniform sampler2D velTex;
  uniform vec2 center;
  uniform float time;
  varying vec2 uv;

      float div(in float a, in float b) {
        return floor(a / b);
      }

      float modulo(in float a, in float b) {
        return a - floor(a / b) * b;
      }

/*
      vec2 convertFromTexCoordToPosCoord(in vec2 texCoord) {
        float idx = texCoord.x + texCoord.y * textureSize.x;
        return vec2(modulo(idx, planeSize.x), div(idx, planeSize.x));
      }*/

      vec2 convertFromPosCoordToTexCoord(in vec2 posCoord) {
        float idx = posCoord.x + posCoord.y * 2.0;//planeSize.x;
        return vec2(modulo(idx, 1024.0), div(idx, 1024.0));
      }


  void main() {
    

    vec2 uvv = uv;//floor(uv*10.0)/10.0;

    vec2 offset = texture2D(velTex, uvv).xy;// - vec2(0.5,0.5);
    
    float amp = length(offset.xy);
    float rad = atan(offset.y,offset.x);
    
     //amp = 1.0/1024.0;
    offset.x = 0.1*amp*cos(rad);
    offset.y = 0.1*amp*sin(rad);
    //newUV = convertFromPosCoordToTexCoord(newUV);
    //newUV = floor(newUV*256.0)/256.0;


    vec4 inputCol = vec4(0.0,0.0,0.0,0.0);

    uvv = uv - offset * 0.1;
    //uvv = modulo(uvv, 1.0);

    inputCol.x = texture2D(inputTex,( uvv )).x;
    inputCol.y = texture2D(inputTex,( uvv )).y;
    inputCol.z = texture2D(inputTex,( uvv )).z;

    //if(uv.y<0.5+0.5*sin(time)){
    if(time<=0.01){
        /*
        if(inputCol.x>0.5){
          inputCol.xyz -= step(0.5,texture2D(baseTex, uv).xyz);    
        }else{
          inputCol.xyz += step(0.5,texture2D(baseTex, uv).xyz);    
        }*/

    }

    if( texture2D(baseTex, uv).x >= 0.49 ){
        float xx1 = (texture2D(baseTex, uv).x);
        inputCol.xyz = vec3(xx1,xx1,xx1);//texture2D(baseTex, uv).xyz;
    }

        //if(length((center.xy+vec2(1.0,1.0))/2.0-uv.xy)<0.02){
        //    float vv = 0.7 + 0.3 * sin(time);
            //inputCol.xyz=vec3(vv,vv,vv);
        //}
    //if(texture2D(baseTex, uv).x>0.7 ){
      //inputCol = texture2D(baseTex, uv);    
    //}else{
      //inputCol
    //}

    //inputCol.rgb=step(0.5,inputCol.rgb);



    gl_FragColor = vec4(inputCol.rgb,1.0);

  }