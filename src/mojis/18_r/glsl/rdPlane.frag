
    //uniform 変数としてテクスチャのデータを受け取る
    uniform sampler2D tex1;
    uniform sampler2D tex2;
    
    uniform vec2 size;
    uniform float counter;
    uniform vec3 color1;
    uniform vec3 color2;
    // vertexShaderで処理されて渡されるテクスチャ座標
    varying vec2 vUv;                                             

    vec4 tex(vec2 uv){
        
        vec4 col =  texture2D( tex1, vUv + uv / size*2.0 );
        vec2 nn = decode(col).xy;

        return vec4(nn.y,nn.y,nn.y,1.0);
        
    }
    
    void main()
    {
      // テクスチャの色情報をそのままピクセルに塗る
        vec4 colA = texture2D(tex1, vUv);
        vec4 colB = texture2D(tex1, vUv - 1.0/size.x);
      
        float yyA = smoothstep( 0.1, 0.2, colA.r - colA.g );
        //float yyA = step(0.1, (colA.r - colA.g));
        
        vec4 col = 
            0.1*tex(vec2( -1.0, -1.0)) + 
            0.1*tex(vec2( 0.0, -1.0)) + 
            0.1*tex(vec2( 1.0, -1.0)) + 
            0.1*tex(vec2( -1.0, 0)) + 
            -0.8*tex(vec2( 0.0, 0)) + 
            0.1*tex(vec2( 1.0, 0)) + 
            0.1*tex(vec2( -1.0, 1.0)) + 
            0.1*tex(vec2( 0.0, 1.0)) + 
            0.1*tex(vec2( 1.0, 1.0));
        
        //1, 2, 1,
        //2, 4, 2,
        //1, 2, 1	
        
        //vec4 col2 = texture2D( texture2, fract(vUv*30.0) + vec2( col.y-0.5, col.y-0.5 ) * 0.1 );
      
        //float xx = tex( vec2(0.0, 0.0) );
        //float yy = abs( xx - tex( vec2(0.0, -1.0) ) );
      
        
        //gl_FragColor = vec4( outputColor.rgb, 1.0);

        vec2 nn = decode(colA).xy;
        vec3 outputColor = mix(color1,color2,smoothstep(0.2,0.3,nn.y));
        outputColor.xyz += 9.0*col.xyz;

        gl_FragColor = vec4( outputColor.rgb, 1.0);
      //gl_FragColor = col;
    }	