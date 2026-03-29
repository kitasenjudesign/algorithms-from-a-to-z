
precision mediump float;

		uniform sampler2D tex1;
		uniform sampler2D tex2;
		uniform vec2 size;
		uniform float count;
		
		uniform float dA;
		uniform float dB;
		uniform float f;
		uniform float k;
		
		uniform float offsetF;
		uniform float offsetK;
		
		uniform float noiseDetail;
		
		varying vec2 vUv;                      
		
		bool inCircle(vec2 position, vec2 offset, float size) {
			float len = length(position - offset);
			if (len < size) {
				return true;
			}
			return false;
		}

		vec4 tex(vec2 uvv)
		{
			return vec4(decode(texture2D(tex1, uvv)),0,0);// .xy;
		}		
		
		void main()
		{
			vec2 pixel = 1./size;

			vec2 polar = vUv - vec2(0.5,0.5);
			float amp = length(polar);
			float rad = atan(polar.y,polar.x);
			//amp -= 0.001;
			vec2 uvv = vec2(
				amp*cos(rad)+0.5,
				amp*sin(rad)+0.5
			);
			//uvv.x = polar.x + 0.5;
			//uvv.y = polar.y + 0.5;
			
			//uvv.x = polar.x*0.997+0.5;//amp*cos(rad)+0.5;
			//uvv.y = polar.y*0.997+0.5;//amp*sin(rad)+0.5;


			vec4 cp = tex(uvv);//center pixel
			
			//vUv.y=vUv.y+0.001;

			vec4 delta = vec4(0.0); 
			
			delta =
				0.05 * tex(uvv + pixel * vec2(-1.0,  -1.0)) +
				0.20 * tex(uvv + pixel * vec2(0, -1.0)) +
				0.05 * tex(uvv + pixel * vec2(1.0, -1.0)) +
				
				0.20 * tex(uvv + pixel * vec2(-1.0, 0)) +
				-1.0 * tex(uvv) +
				0.20 * tex(uvv + pixel * vec2(1.0, 0)) +
				
				0.05 * tex(uvv + pixel * vec2(-1.0, 1.0)) +
				0.20 * tex(uvv + pixel * vec2(0, 1.0)) +
				0.05 * tex(uvv + pixel * vec2(1.0, 1.0));
			

			/*
			delta =
				1.0/8.0 * tex(vUv + pixel * vec2(0, -1.0)) +
				1.0/8.0 * tex(vUv + pixel * vec2(-1.0, 0)) +
				-4.0/8.0 * tex(vUv) +
				1.0/8.0 * tex(vUv + pixel * vec2(1.0, 0)) +
				1.0/8.0 * tex(vUv + pixel * vec2(0, 1.0));		
			*/
			
			//float dist = length( vUv - vec2(0.5, 0.5));

			//float feed = f + f * fr * snoise(vec3(vUv.x * noiseDetail, vUv.y * noiseDetail, count));//+ f * fr * dist;
			//float kill = k + k * kr * snoise(vec3(vUv.x * noiseDetail, vUv.y * noiseDetail, count+99.9));//+ k * kr * dist;

			float feed = f + offsetF;// * texture2D(tex2, vUv).r;
			float kill = k + offsetK;// * texture2D(tex2, vUv).r;
			
			//if(vUv.y<0.5) feed = 0.1262;
			//if(vUv.y<0.5) kill = 0.0574;
			

			float spd = 1.0;
			vec4 col = vec4(0);
			
			float reaction = cp.x * cp.y * cp.y;

			col.x = cp.x + ( (dA * delta.x) - reaction + (feed * (1.0 - cp.x)) ) * spd;
			col.y = cp.y + ( (dB * delta.y) + reaction - ((kill + feed) * cp.y) ) * spd; 			
			
			//float feed2 = 0.0545;
			//float kill2 = 0.062;
			//col.z = cp.z + ( (dA * delta.z) - (cp.x * cp.y * cp.y) + (feed2 * (1.0 - cp.x)) ) * spd;
			//col.w = cp.w + ( (dB * delta.w) + (cp.x * cp.y * cp.y) - ((kill2 + feed2) * cp.y) ) * spd; 			
			
			//col.x = clamp(col.x, 0.0, 1.0);
			//col.y = clamp(col.y, 0.0, 1.0);
			
			//float zz = abs( col.x - col.y );
			//zz = clamp(zz, 0.0, 1.0);
			
			/*
			float d = length( vUv-vec2(0.5,0.5) );
			if(d>0.25+0.22*sin(count*0.01)){
				col.x*=0.99;
				col.y*=0.99;
			}*/



			gl_FragColor = encode(col.xy);// col.y * 2.4, 1.0);
			
		}	
	