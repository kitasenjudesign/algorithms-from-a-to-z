import p5, { Graphics, Shader } from "p5";
import { p5Base } from "../00_base/p5Base";
import { YUVp5src } from "./YUVp5src";
import vertYUV from "./yuv.vert";
import fragYUV from "./yuv.frag";
import { Stage } from "../../data/Stage";
import { TitleView } from "../../html/TitleView";
import { Params } from "../../data/Params";


interface OneStrokeFont{
    unitsPerEm:number;
    canvasSize:number;
    glyphs:{[letter:string]:number[][][]};
}

export class YUVp5 extends p5Base{


    private _src:YUVp5src;
    private _shader: p5.Shader | null = null;
    private _blurAmount = 0;
    private _scale = 3.0;
    private _font!:OneStrokeFont;

    constructor(){
      super();
    }

    start(callback:()=>void){

        this._callback=callback;


        let sketch = (p: p5)=>{

            p.preload = ()=>{
                this._font = p.loadJSON("./data/onestroke-font.json") as unknown as OneStrokeFont;
            }

            /** 初期化処理 */
            p.setup = ()=>{
                this._p5 = p;
                TitleView.setBasePosition(100,Stage.height-TitleView.getSize().height-100);
                TitleView.setPosition();
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

          let letter = Params.alphabet;
          if(letter=="") letter = "Y";

          let lines = this.getStrokeLines(letter);


          this._shader.setUniform('u_lines', lines);
          this._shader.setUniform('u_lineCount', lines.length/4);
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

    //onestroke-font.jsonのグリフ(0〜1に正規化されたストロークの折れ線)を、
    //u_lines用のフラットな配列[x0,y0,x1,y1, ...](2点で1本の線分)に変換する。
    //0〜1が画面いっぱい(Stage.width x Stage.height)になるように引き伸ばす(複数文字の場合は先頭の1文字のみ使用)
    //シェーダ側は vec2 u_lines[200] (=最大100本) までしか読まないので、超えた分は切り捨てる
    private getStrokeLines(text:string):number[]{

        const lines:number[] = [];
        if(!this._font || text.length===0) return lines;

        const maxSegments = 100;
        const strokes = this._font.glyphs[text[0].toUpperCase()];
        if(!strokes) return lines;

        for(const stroke of strokes){
            for(let i=0; i<stroke.length-1; i++){

                if(lines.length/4 >= maxSegments) return lines;

                const [x0,y0] = stroke[i];
                const [x1,y1] = stroke[i+1];

                //フォントはy=0が下端・y=1が上端(数学的な向き)なので、
                //上が0になる画面のピクセル座標に合わせて上下反転する
                lines.push(
                    x0*Stage.width, (1-y0)*Stage.height,
                    x1*Stage.width, (1-y1)*Stage.height
                );

            }
        }

        return lines;

    }

}