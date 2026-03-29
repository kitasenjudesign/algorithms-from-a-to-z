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
uniform float colorId;
uniform vec3 offsetCol;
uniform vec3 colDisplace;
uniform sampler2D tex1;
uniform sampler2D tex2;
uniform sampler2D ruleTex;

uniform samplerCube envMap2;

varying vec3 vPos;

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

vec4 tex(vec2 uv){
    vec4 col =  texture2D( map, vUv + uv / vec2(512.0,512.0) );
    vec2 nn = decode(col).xy;
	nn.y = smoothstep(0.15,0.2,nn.y);
    return vec4(nn.y,nn.y,nn.y,1.0);
}

void main() {
	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	
	vec3 totalEmissiveRadiance = emissive;// + 

	#include <logdepthbuf_fragment>

	//#include <map_fragment>
	
    vec4 sampledDiffuseColor = texture2D( map, vUv );

	vec2 d = decode(sampledDiffuseColor);
	//d.x=1.0-d.x;
	//d.y=1.0-d.y;

	//float yy = decode(sampledDiffuseColor).y;
	//yy=smoothstep(0.3,0.6,yy);
	//diffuseColor.rgb = vec3(yy,yy,yy);


	float dx = tex( vec2( 0.0, 0.0) ).x - tex( vec2(-1.0,0.0) ).x;
	float dy = tex( vec2( 0.0, 0.0) ).x - tex( vec2(0.0,-1.0) ).x;
	//float ddx = tex( vec2( 1.0, 0.0) ).x - tex( vec2(-1.0,0.0) ).x;
	//float ddy = tex( vec2( 0.0, 1.0) ).x - tex( vec2(0.0,-1.0) ).x;
	

	float amp = 0.2;//length(vec2(dx,dy));
	float rad = atan(dy,dx);



	//color
	vec4 oCol = texture2D( tex1, vec2(smoothstep(0.1,0.3,fract(d.y*1.0) ),0.5));
	oCol.r = smoothstep(0.20,0.24,fract(d.y*1.0) );
	oCol.g = smoothstep(0.20,0.23,fract(d.y*1.0) );
	oCol.b = smoothstep(0.20,0.22,fract(d.y*1.0) );

	//vec2(0.5+0.5*sin(rad+1.5),0.5) );
	vec3 bgColor = mix(
		vec3(0.9,0.95,1.0),
		vec3(0.8,0.9,0.95),
		2.0*length(vUv-vec2(0.5,0.5))
	);

	/*
	diffuseColor.rgb = mix(
		 mix(bgColor,vec3(0.8, 0.6, 1.0),smoothstep(0.1,0.2,d.y)),
		 //mix(vec3(1.0,1.0,1.0),vec3(1.0, 1.0, 0.75),smoothstep(0.2,0.3,d.y)),
		 hueShiftYIQ(oCol.rgb,vUv.x+vUv.y*3.14/2.0),
		 //oCol.rgb,
		 max(dx,dy)*2.0
	);*/

	diffuseColor.r=oCol.r+dy*0.5;//-dx*0.5;
	diffuseColor.g=oCol.g+dy*0.5;//-dy*5.0-dx*5.0;
	diffuseColor.b=oCol.b+dy*0.5;//-dy*5.5-dx*5.5;


	//diffuseColor.rgb *= texture2D(ruleTex,vUv).rgb + vec3(0.5,0.5,0.5);

	//diffuseColor.rgb 
	//= diffuseColor.rgb * smoothstep(0.1,0.4,tex(vec2(0.0,0.0)).rgb);


	//diffuseColor.rgb = bgColor;
	/*
	diffuseColor.rgb = hueShiftYIQ(
		diffuseColor.rgb + dx + dy,
		colorId*3.1415*6.0
	);*/

	//vec4 hoge = diffuseColor;

	/*
	*/

	//normal.rgb += vec3(col.r,col.g,col.b);
	//normal = normalize(normal);

//https://github.com/mrdoob/three.js/tree/dev/src/renderers/shaders/ShaderChunk


	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>



	//diffuseColor.x = fract(dx*5.0);
	//diffuseColor.y = fract(dy*5.0);

	//normal.y = fract(dy*5.0);
	//normal.z = 1.0;
	//normal = normalize(normal);
	//normal.z = 1.0;
	//normal = normalize( diffuseColor.rgb );
	

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
		
		//outgoingLight = diffuseColor.rgb;
		//outgoingLight.x = 0.0;
	//outgoingLight.xyz += (0.02*(random(vUv.xy)-0.5));

	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}