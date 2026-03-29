
precision mediump float;

		uniform sampler2D tex1;
		//uniform sampler2D tex2;
		uniform sampler2D ruleTex;
		uniform vec2 size;
		uniform float count;
		
		uniform float dA;
		uniform float dB;
		uniform float f;
		uniform float k;
		
		uniform float offsetF;
		uniform float offsetK;
		
		uniform vec4 params[15];

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

			vec2 uvv = vUv;
			vec4 cp = tex(uvv);//center pixel
						
			vec4 delta = vec4(0.0); 
			vec2 offset = vec2(0.0,0.0);
			
			delta =
				0.05 * tex(uvv + pixel * (offset + vec2(-1.0,  -1.0))) +
				0.20 * tex(uvv + pixel * (offset + vec2(0, -1.0))) +
				0.05 * tex(uvv + pixel * (offset + vec2(1.0, -1.0))) +
				
				0.20 * tex(uvv + pixel * (offset + vec2(-1.0, 0))) +
				-1.0 * tex(uvv + pixel * (offset)) +
				0.20 * tex(uvv + pixel * (offset + vec2(1.0, 0))) +
				
				0.05 * tex(uvv + pixel * (offset + vec2(-1.0, 1.0))) +
				0.20 * tex(uvv + pixel * (offset + vec2(0, 1.0))) +
				0.05 * tex(uvv + pixel * (offset + vec2(1.0, 1.0)));
			

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

			vec4 rule = texture2D(ruleTex, vUv);
			
			float ff = f;
			float kk = k;
			float ddA = dA;
			float ddB = dB;

			int nn = int( rule.x * 15.0 );
			vec4 pp = params[nn]; 
			ff=pp.x;
			kk=pp.y;
			ddA=pp.z;
			ddB=pp.w;


			float feed = ff + offsetF;// * texture2D(tex2, vUv).r;
			float kill = kk + offsetK;// * texture2D(tex2, vUv).r;
			
			float spd = 1.0;
			vec4 col = vec4(0);
			
			float reaction = cp.x * cp.y * cp.y;



			col.x = cp.x + ( (ddA * delta.x) - reaction + (feed * (1.0 - cp.x)) ) * spd;
			col.y = cp.y + ( (ddB * delta.y) + reaction - ((kill + feed) * cp.y) ) * spd; 			
			
			//col.x += rule.y*0.0001;
			//col.y += rule.y*0.0001;

			gl_FragColor = encode(col.xy);// col.y * 2.4, 1.0);
			
		}	
	