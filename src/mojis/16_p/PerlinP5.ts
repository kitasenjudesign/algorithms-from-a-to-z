import p5, { Graphics, Shader } from "p5";
import { p5Base } from "../00_base/p5Base";
import { Perlin } from "./Perlin";
import { PerlinP5src } from "./PerlinP5src";
import { Params } from "../../data/Params";
import { Stage } from "../../data/Stage";
import { TitleView } from "../../html/TitleView";

export class PerlinP5 extends p5Base{


    private _perlin: Perlin;
    private _src:PerlinP5src;
    private _shader: p5.Shader | null = null;
    private _blurAmount = 0;
    private _scale = 3.0;

    constructor(){
      super();
    }

    start(callback:()=>void){
        
        this._callback=callback;
         

        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                this._p5 = p;
                this._src=new PerlinP5src();
                this._src.start(()=>{
                    this.setUp();
                    this._callback();

                });
            }
            /** フレームごとの描画処理 */
            p.draw = ()=> {
                this.draw();
            }

            p.mouseClicked = ()=>{

            }
            
        };
        
        new p5(sketch, document.body);
    }


    setUp(){
        
        this._isInitialized=true;

        // create WEBGL canvas so we can use shaders easily
        let canvas = this._p5.createCanvas(
            Stage.width,
            Stage.height,
            this._p5.WEBGL
        );
        //this._p5.frameRate(30);
        this._p5.noSmooth();

        TitleView.setPosition(Stage.width-TitleView.getSize().width-100,Stage.height-TitleView.getSize().height-100);

        this._perlin = new Perlin(this._p5);

        this._p5.frameRate(20);

        // --- simple vertex / fragment shader with 2D "Perlin-like" noise (fbm) ---
        const vert = `
        #ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aPosition;
//aPosition is automatically passed from p5 (x,y,z)

void main() {
  // There is a bug with p5, which makes the aPosition aligned in the top-right corner. This is the scaling to fix that
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  // Send the vertex information on to the fragment shader. Need to return a vec4 (x,y,z,w)
  gl_Position = positionVec4;
}`;

        const frag = `
        precision highp float;
        // no varying; compute uv from fragment coord
         uniform vec2 u_resolution;
         uniform float u_time;
         uniform float u_scale;
         uniform sampler2D u_image;
         uniform float u_color;

        // hash / gradient for value-noise-like gradient noise
        vec2 hash2(vec2 p){
          p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
          return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
        }

        float noise2d(vec2 p, float line){
          vec2 i = floor(p);
          vec2 f = fract(p);

          
          if(line>0.5){
            if(length(i-p)<0.01)return 11.0;
          }

          vec2 u = f * f * (3.0 - 2.0 * f);
          float n00 = dot(hash2(i + vec2(0.0,0.0)), f - vec2(0.0,0.0));
          float n10 = dot(hash2(i + vec2(1.0,0.0)), f - vec2(1.0,0.0));
          float n01 = dot(hash2(i + vec2(0.0,1.0)), f - vec2(0.0,1.0));
          float n11 = dot(hash2(i + vec2(1.0,1.0)), f - vec2(1.0,1.0));
          return mix(mix(n00, n10, u.x), mix(n01, n11, u.x), u.y);
        }

        // fbm (fractal noise)
        float fbm(vec2 p){
          float v = 0.0;
          float a = 0.5;
          for(int i=0;i<6;i++){
            v += a * noise2d(p,0.0);
            p *= 2.0;
            a *= 0.5;
          }
          return v;
        }

        void main(){
          vec2 uv = gl_FragCoord.xy / u_resolution;
          uv.y = 1.0 - uv.y; // 必要なら上下反転を補正

          vec2 offset = vec2(
          noise2d(uv.xy*5.0+vec2(0.0,u_time),0.0)*0.02,
          noise2d(uv.xy*5.0+vec2(0.0,u_time),0.0)*0.02
          );
          vec4 src = texture2D(u_image, (uv/2.0 - vec2(0.0,-0.5) + offset));
          // src.rgb を加工して出力する
          float noise = noise2d(uv.xy*5.0+vec2(0.0,u_time),1.0);
          noise += 0.5;
          if(src.r>0.5){
            noise = 1.0 - noise;    
          };

          float rr = noise;
          float gg = noise;
          float bb = noise;

          if(u_color==1.0){
           rr *= 0.0;
           gg *= 0.5;
           bb *= 0.9;
          }

          gl_FragColor = vec4(rr, gg, bb, 1.0);
        }`;

        this._shader = this._p5.createShader(vert, frag);
        // set default uniforms
        if(this._shader){
          this._shader.setUniform('u_scale', this._scale);
        }
    }

    onLoad(){


    }

    click(){

    }

    reset(){
        
    }

    draw(){

        if(!this._isInitialized)return;

        const p = this._p5;
        if(!p) return;



        if(this._shader){
            
          p.shader(this._shader);
          const t = p.millis() / 1000;
          this._shader.setUniform('u_time', t*0.35);
          this._shader.setUniform('u_resolution', [p.width, p.height]);
          this._shader.setUniform('u_scale', this._scale);
          this._shader.setUniform('u_image', this._src.getGraphics());
          this._shader.setUniform('u_color',Params.color?1:0);

          // draw fullscreen quad (WEBGL coords centered)
          p.push();
          p.noStroke();
          p.translate(0,0,0);
          //p.rectMode(p.CENTER);
          p.rect(-this._p5.width/2,-this._p5.height/2,this._p5.width,this._p5.height);
          p.pop();
          

          // optional: apply blur using p5.filter if needed (may depend on renderer)
          if(this._blurAmount > 0){
            try {
              // p5.filter works only on p5's 2D canvas; with WEBGL fallback to shader-based blur is better.
              (p as any).filter((p as any).BLUR, this._blurAmount);
            } catch(e){
              // ignore if not supported in this renderer
            }
          }
        }
    }

    resize(){


    
        
    }
    
    public setBlur(px:number){
        this._blurAmount = Math.max(0, px);
    }

    public setScale(s:number){
        this._scale = s;
        if(this._shader) this._shader.setUniform('u_scale', this._scale);
    }
    
}

