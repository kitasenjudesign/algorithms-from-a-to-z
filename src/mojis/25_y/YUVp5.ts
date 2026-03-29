import p5, { Graphics, Shader } from "p5";
import { p5Base } from "../00_base/p5Base";
import { YUVp5src } from "./YUVp5src";
import vertYUV from "./yuv.vert";
import fragYUV from "./yuv.frag";
import { Stage } from "../../data/Stage";
import { TitleView } from "../../html/TitleView";


export class YUVp5 extends p5Base{


    private _src:YUVp5src;
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
                TitleView.setPosition(100,Stage.height-TitleView.getSize().height-100);
                this._src=new YUVp5src();
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

        
        this._p5.frameRate(20);

        // --- simple vertex / fragment shader with 2D "Perlin-like" noise (fbm) ---
        const vert = vertYUV;
        const frag = fragYUV;

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
          this._shader.setUniform('u_time', t);
          this._shader.setUniform('u_resolution', [p.width, p.height]);
          this._shader.setUniform('u_scale', this._scale);
          this._shader.setUniform('u_frameCount', this._p5.frameCount);


          let lines=[];

            lines.push(
              0,0
            );   
            lines.push(
              Stage.width/2,Stage.height/2
            );   
            lines.push(
              Stage.width/2,Stage.height/2
            );              
            lines.push(
              Stage.width,0
            );   
            lines.push(
              Stage.width/2,Stage.height/2
            );  
            lines.push(
              Stage.width/2,Stage.height
            );
          


          this._shader.setUniform('u_lines', lines);
          this._shader.setUniform('u_lineCount', 3);//lines.length);
          this._shader.setUniform('u_image', this._src.getGraphics());


          //this._shader.setUniform('u_image', this._src.getGraphics());
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