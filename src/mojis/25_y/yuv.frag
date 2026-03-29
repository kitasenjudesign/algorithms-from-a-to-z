// shader.frag
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_lines[200]; // 最大100本の線 (start, end)
uniform int u_lineCount;
uniform float u_frameCount;

float sdSegment(vec2 p, vec2 a, vec2 b, float rr) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  
  float dist = length(pa - ba * h);

  float dx = abs(pa.x - (ba * h).x );
  float dy = abs(pa.y - (ba * h).y );

  // マンハッタン距離でのSDF
  float manhattanDist = dx + dy;
  
  //ちぇび
  float chabi = max (abs(dx), abs(dy));
    dist = mix(dist,chabi,rr);//manhattanDist;
  
  /*
  if(rr<0.5){
    dist = mix(dist,chabi,rr*2.0);//manhattanDist;
  }else{
    dist = mix(chabi,manhattanDist,(rr-0.5)*2.0);//manhattanDist;    
  }*/
   
  return dist;

}


vec3 yuv2rgb(vec3 yuv) {

    bool limitedRange = false;

    float Y = yuv.x;
    float U = yuv.y;
    float V = yuv.z;

    if (limitedRange) {
        // 8-bit limited range normalization
        Y = (Y - 16.0/255.0) * (255.0/219.0);
        U = (U - 128.0/255.0) * (255.0/224.0);
        V = (V - 128.0/255.0) * (255.0/224.0);
    } else {
        // full range: Y in [0,1], U,V in [0,1] with 0.5 center
        U -= 0.5;
        V -= 0.5;
    }

    // BT.601
    float R = Y + 1.40200 * V;
    float G = Y - 0.344136 * U - 0.714136 * V;
    float B = Y + 1.77200 * U;

    return clamp(vec3(R, G, B), 0.0, 1.0);
}

vec3 hueShift( vec3 color, float hueAdjust ){

    const vec3  kRGBToYPrime = vec3 (0.299, 0.587, 0.114);
    const vec3  kRGBToI      = vec3 (0.596, -0.275, -0.321);
    const vec3  kRGBToQ      = vec3 (0.212, -0.523, 0.311);

    const vec3  kYIQToR     = vec3 (1.0, 0.956, 0.621);
    const vec3  kYIQToG     = vec3 (1.0, -0.272, -0.647);
    const vec3  kYIQToB     = vec3 (1.0, -1.107, 1.704);

    float   YPrime  = dot (color, kRGBToYPrime);
    float   I       = dot (color, kRGBToI);
    float   Q       = dot (color, kRGBToQ);
    float   hue     = atan (Q, I);
    float   chroma  = sqrt (I * I + Q * Q);

    hue += hueAdjust;

    Q = chroma * sin (hue);
    I = chroma * cos (hue);

    vec3    yIQ   = vec3 (YPrime, I, Q);

    return vec3( dot (yIQ, kYIQToR), dot (yIQ, kYIQToG), dot (yIQ, kYIQToB) );

}

void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution*0.5;
  float rr = 0.0;//0.5+0.5*sin(0.5*u_frameCount);
  
  float minDist = 1e10;
  float value = 0.0;
  for (int i = 0; i < 100; i++) {
    if (i >= u_lineCount) break;
    vec2 a = u_lines[i * 2] / u_resolution;
    vec2 b = u_lines[i * 2 + 1] / u_resolution;
    a.y=1.0-a.y;
    b.y=1.0-b.y;
    //uvという点と、対象との距離を測る　　
    minDist = min(minDist, sdSegment(uv, a, b, rr));
    //value += sdSegment(uv, a, b, rr);
  }

  vec2 dist = uv-vec2(0.5,0.5);
  float rad = value*1.0;//2.0*atan(dist.y,dist.x);
  
  float stripe1 = 0.5+0.5*sin(minDist * 12.0-0.0001*u_frameCount+rad);
  float stripe2 = 0.5+0.5*sin(minDist * 10.0-0.00015*u_frameCount+rad);
  float stripe3 = 0.5+0.5*sin(minDist * 20.0-0.0002*u_frameCount+rad);
  
           stripe1 = yuv2rgb(vec3(0.5,stripe1,stripe1)).r;
           stripe2 = yuv2rgb(vec3(0.5,stripe1,stripe1)).g;
           stripe3 = yuv2rgb(vec3(0.5,stripe1,stripe1)).b;

  vec2 col = uv.xy/u_resolution.xy*0.5;
  
  vec3 col3 = vec3(stripe1,stripe2,stripe3);
  
    //Tone mapping
    //col3 = 1.0 - exp(-col3);
    
    //Gamma
    //col3 = pow(col3, vec3(0.4545));

  //col3 = hueShift(col3,u_frameCount*0.25);
  float rrr = 1.0;// + 1.0 * sin(0.5 * u_frameCount);
  col3 = mix(
      hueShift( yuv2rgb(vec3(0.5,uv.x,uv.y)), u_frameCount*0.05 ),
      col3,
      clamp(minDist*rrr, 0.0, 1.0)
  );
  //col3 = step(0.5,col3);
  //if(stripe1<0.5) col3=vec3(0.0,0.0,0.0);
  
  //if(stripe1<0.33)col3=vec3(1.0,0.6,0.0);
  //else if(stripe1<0.66)col3=vec3(1.0,1.0,1.0);
  //col3 = 1.0 - exp(-col3);
  gl_FragColor = vec4(col3,1.0);
}
