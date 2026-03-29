precision highp float;
uniform sampler2D velocity;
varying vec2 uv;

void main(){
    vec2 vel = texture2D(velocity, uv).xy;
    float len = length(vel);
    vel = vel * 0.5 + 0.5;
    
    vec3 color = vec3(vel.x,vel.y,1.0);
    
    //if(uv.x<0.5) color = vec3(vel.y, vel.x, 0.0);

    //float amp = length(vel.xy);
    //float rad = atan(vel.y,vel.x);

    //color.x = amp*cos(rad*50.0+3.1415/2.0);
    //color.y = amp*sin(rad*50.0+3.1415/2.0);
    

    //scolor = mix(vec3(1.0), color, len);
    
    //color = step(0.5,fract(15.0*color));
    //color.xyz = color.xxx;
    //color.x = rad;//step(0.5,fract(25.0*(color.x) ));

    //color.x = step(0.5,fract(25.0*rad ));
    //color.y = step(0.5,fract(25.0*rad ));
    //color.z = step(0.5,fract(25.0*rad ));
    

    gl_FragColor = vec4(color,  1.0);
}
