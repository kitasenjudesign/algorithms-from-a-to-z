precision highp float;
uniform sampler2D pressure;
uniform sampler2D velocity;
uniform sampler2D map;

uniform vec2 px;
uniform float dt;
//uniform float time;

varying vec2 uv;

void main(){
    float step = 1.0;

    float p0 = texture2D(pressure, uv+vec2(px.x * step, 0)).r;
    float p1 = texture2D(pressure, uv-vec2(px.x * step, 0)).r;
    float p2 = texture2D(pressure, uv+vec2(0, px.y * step)).r;
    float p3 = texture2D(pressure, uv-vec2(0, px.y * step)).r;

    vec2 v = texture2D(velocity, uv).xy;
    vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
    v = v - gradP * dt;
    
    //if(uv.x<0.5){
    //   v *= 0.0;
    //}    

    v *= 1.0 - texture2D(map,uv).x;
    v.y += 0.004*sin(uv.x*10.0);

        //if(uv.x<.5){
            //v.y+= 0.001*sin(uv.x*10.0);
        //}
    //v*=0.9;
    

    gl_FragColor = vec4(v, 0.0, 1.0);
}
