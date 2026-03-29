uniform sampler2D tex1;
//uniform sampler2D disTexture;
//uniform sampler2D colTexture;
uniform float strength;
uniform float counter;
uniform float isDisplace;
uniform float isColor;
uniform vec2 scale;
//uniform float stageWidth;
//uniform float stageHeight;
uniform float flag;
uniform float ink;
varying vec2 vUv;

					

// YUV to RGB matrix
mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983, 
                    1.0, -0.39465, -0.58060, 
                    1.0, 2.03211, 0.0);

// RGB to YUV matrix
mat3 rgb2yuv = mat3(0.2126, 0.7152, 0.0722,
                    -0.09991, -0.33609, 0.43600, 
                    0.615, -0.5586, -0.05639);

                    
void sort2(inout vec4 a0, inout vec4 a1) {
    vec4 b0 = min(a0, a1);
    vec4 b1 = max(a0, a1);
    a0 = b0;
    a1 = b1;
}

void sort(inout vec4 a0, inout vec4 a1, inout vec4 a2, inout vec4 a3, inout vec4 a4) {
    sort2(a0, a1);
    sort2(a3, a4);
    sort2(a0, a2);
    sort2(a1, a2);
    sort2(a0, a3);
    sort2(a2, a3);
    sort2(a1, a4);
    sort2(a1, a2);
    sort2(a3, a4);
}										
                                        
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}					


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}	

void main() {
    
    vec2 axis = vec2( vUv.x, vUv.y );
    
    float stageWidth = 512.0;
    float stageHeight = 512.0;

    vec2 axis1 = vec2( 1.0 / stageWidth,0 ) * scale;
    vec2 axis2 = vec2( -1.0 / stageWidth,0 )* scale;
    vec2 axis3 = vec2( 0,1.0 / stageHeight )* scale;
    vec2 axis4 = vec2( 0, -1.0 / stageHeight )* scale;
    
    vec2 axis5 = vec2( 2.0 / stageWidth,0 )* scale;
    vec2 axis6 = vec2( -2.0 / stageWidth,0 )* scale;
    vec2 axis7 = vec2( 0,2.0 / stageHeight )* scale;
    vec2 axis8 = vec2( 0,-2.0 / stageHeight )* scale;
    
    vec4 a0 = texture2D( tex1, axis );
    
    vec4 a1 = texture2D( tex1, axis + axis1 );
    vec4 a2 = texture2D( tex1, axis + axis2 );
    vec4 a3 = texture2D( tex1, axis + axis3 );
    vec4 a4 = texture2D( tex1, axis + axis4 );//keisuu wo
    
    vec4 a5 = texture2D( tex1, axis + axis5 );
    vec4 a6 = texture2D( tex1, axis + axis6 );
    vec4 a7 = texture2D( tex1, axis + axis7 );
    vec4 a8 = texture2D( tex1, axis + axis8 );//keisuu wo
    
    sort(a0, a1, a2, a3, a4);
    //if(flag==1.0){
        sort(a5, a6, a2, a7, a8);
    //}
    

    vec3 oo = a2.xyz;
    gl_FragColor = vec4( oo,  1.0);
}