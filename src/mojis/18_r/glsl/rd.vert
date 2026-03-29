
precision mediump float;
varying vec2 vUv;
void main()
{
    vUv = uv;
	//position.x = sin(position.y) * 0.1 + position.x;
	vec4 hoge = vec4(position, 1.0);//matrix keisan shinai
	hoge.z = 0.999;
	gl_Position = hoge;
}