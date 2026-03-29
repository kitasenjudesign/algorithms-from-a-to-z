#define PHONG
#define USE_MAP
#define USE_UV
#define USE_ENVMAP

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
uniform float counter;
uniform float offsetY;
uniform float noise;
uniform vec4 glitch;
uniform vec3 offsetCol;
uniform vec3 colDisplace;
uniform vec3 dLight;
uniform sampler2D tex1;
uniform sampler2D map2;
uniform float colorId;

uniform samplerCube envMap2;

varying vec3 vPos;
varying vec3 vvNormal;


#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

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

float random(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float decode16bit(vec2 v) {
    return dot(v, vec2(255.0 / 256.0, 1.0 / 256.0));
}

vec2 decode(vec4 encoded) {
    return vec2(decode16bit(encoded.rg), decode16bit(encoded.ba));
}




void main() {
	//https://github.com/mrdoob/three.js/tree/dev/src/renderers/shaders/ShaderChunk
	//https://gist.github.com/kitasenjudesign/331c0d4e133d10b5c61912c636e5ae6a


	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	
	vec3 totalEmissiveRadiance = emissive;// + 

	#include <logdepthbuf_fragment>

	//#include <map_fragment>
	
    //vec4 sampledDiffuseColor = texture2D( map, vUv );
	//vec2 d = decode(sampledDiffuseColor);
	//float yy = decode(sampledDiffuseColor).y;
	//yy=smoothstep(0.3,0.6,yy);

		vec3 N = normalize(vNormal);
    	vec3 L = normalize(vec3(0.1,0.1,0.1));
    	float dotNL = dot(N,L);
		float limLight = 0.2*pow(1.0-dot(N,vec3(0.0,0.0,1.0)),2.0);

    	//float v = abs( random(vNormal.xy) );
    	vec3 offset = vec3(0.9,0.9,0.9);
    	vec3 col = vNormal.xyz * dotNL * 1.0;// + offset;
      
		diffuseColor.rgb = texture2D(map,vUv).rgb;

	//env
	
	vec3 cameraToFrag1 = normalize( vWorldPosition - cameraPosition );
	vec3 reflectVec1 = reflect( cameraToFrag1, vNormal );
	vec3 dir1 = vec3(reflectVec1.x,reflectVec1.yz);
	//vec4 envColor1 = textureCube( envMap,dir1 );// flipEnvMap * reflectVec.x, reflectVec.yz ) );
	 
	

	//diffuseColor.xyz *= envColor1.xyz;
	
	vec3 col1 = texture2D(
		tex1,
		vec2(rgb2hsv(vNormal.xyz).x,0.5)
		//vec2(0.299*vNormal.x+0.587*vNormal.y+0.114*vNormal.z,0.5)
		//vec2(0.299*col.x+0.587*col.y+0.114*col.z,0.5)
	).rgb;

	float aaa = smoothstep(-0.4,0.4,vWorldPosition.z);
	float yy = 0.299*vNormal.x+0.587*vNormal.y+0.114*vNormal.z;

	diffuseColor.xyz = hueShiftYIQ(
		vNormal.xyz*(0.2+0.2*aaa)+vec3(0.5,0.5,0.5)+limLight,
		//col1,
		//vNormal.xyz,
		//vec3(yy,yy,yy),
		colorId*3.1415*2.0
	);
	
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	
	vec3 outgoingLight = 
	reflectedLight.directDiffuse +
	reflectedLight.indirectDiffuse +
	reflectedLight.directSpecular +
	reflectedLight.indirectSpecular +
	totalEmissiveRadiance;
		
	outgoingLight.xyz += (0.05*(random(vUv.xy)-0.5));

	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}