uniform vec2 resolution;
uniform float time;
uniform float colorId;
uniform vec3 dLight;
varying vec3 vNormal;
varying vec2 vUv;


vec3 hueShiftYIQ(vec3 color, float hueShift){
    const vec3  kRGBToYPrime = vec3 (0.299, 0.587, 0.114);
    const vec3  kRGBToI     = vec3 (0.596, -0.275, -0.321);
    const vec3  kRGBToQ     = vec3 (0.212, -0.523, 0.311);

    const vec3  kYIQToR   = vec3 (1.0, 0.956, 0.621);
    const vec3  kYIQToG   = vec3 (1.0, -0.272, -0.647);
    const vec3  kYIQToB   = vec3 (1.0, -1.107, 1.704);

    float   YPrime  = dot (color, kRGBToYPrime);
    float   I      = dot (color, kRGBToI);
    float   Q      = dot (color, kRGBToQ);

    // Calculate the hue and chroma
    float   hue     = atan (Q, I);
    float   chroma  = sqrt (I * I + Q * Q);

    hue += hueShift;

    // Convert back to YIQ
    Q = chroma * sin (hue);
    I = chroma * cos (hue);

    // Convert back to RGB
    vec3    yIQ   = vec3 (YPrime, I, Q);
    color.r = dot (yIQ, kYIQToR);
    color.g = dot (yIQ, kYIQToG);
    color.b = dot (yIQ, kYIQToB);

    return color;
}

vec3 rgb2hsb(vec3 c){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
    vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsb2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}    

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                        vec2(12.9898,78.233)))*
        43758.5453123);
}

void main(void)
{
    //ここも調整する

    vec3 color = mix(
        vec3(0.8,0.9,1.0),
        vec3(1.0,0.9,1.0),
        smoothstep(0.0,0.5,vUv.y)
    );
    color=mix(
        color,
        vec3(1.0,0.9,0.8),
        smoothstep(0.5,1.0,vUv.y)
    );

    vec3 N = normalize(vNormal);
    vec3 L = normalize(dLight);
    float dotNL = dot(N,L);

    float ratio = (1.0-0.01*dotNL);
    color = hueShiftYIQ(color,colorId * (1.0-0.1*dotNL));
    color.x *= ratio;
    color.y *= ratio;
    color.z *= ratio;
    
    //color.x += colorId;

    //color = hsb2rgb(color);

    gl_FragColor=vec4(color.rgb,1.0);
}