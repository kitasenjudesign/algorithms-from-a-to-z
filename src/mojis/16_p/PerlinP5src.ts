import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { Path } from "opentype.js";
import { PathWrapper } from "../../font/PathWrapper";
import { p5Base } from "../00_base/p5Base";
import { Params } from "../../data/Params";

export class PerlinP5src extends p5Base{

    private _graphics:p5.Graphics;

    constructor(){
      super();
    }

    start(callback:()=>void){
        
        this._callback=callback;
         
        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{

                this._p5 = p;                
                this.loadFont("P",()=>{
                    this.setUp(p);
                    this._callback();
                })

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


    setUp(p: p5){
        
        this._isInitialized=true;

        let canvas = this._p5.createCanvas(
            160,
            90
        );
        this._graphics=this._p5.createGraphics(160,90);

        this._p5.pixelDensity(1);
        canvas.id('p5canvasSrc');
        
        document.getElementById("p5canvasSrc").style.display = Params.debug ? "block" : "none";
        document.getElementById("p5canvasSrc").style.position="fixed";
        document.getElementById("p5canvasSrc").style.top="0";
        document.getElementById("p5canvasSrc").style.left="0";
        document.getElementById("p5canvasSrc").style.zIndex="10000";

        //this._p5.noLoop();
        //this.drawFont(this._p5.width,this._p5.height,1,0,0);

    }

    onLoad(){


    }

    click(){

    }

    reset(){
        
    }

    draw(){

        if(!this._isInitialized)return;

        //this._p5.background(0);
        //this._p5.fill(255);
        //this._p5.stroke(255,0,0);

        this._graphics.background(0);
        this._graphics.fill(255);
        this._path.draw(this._graphics,this._graphics.width,this._graphics.height,1,0,0,0);
        this._graphics.fill(0);
        this._path.draw(this._graphics,this._graphics.width,this._graphics.height,1,0,0,1);
        
        this._p5.image(this._graphics,0,0,this._p5.width,this._p5.height);

    }

    resize(){

    }

    
    

    public getGraphics():Graphics{
        
        return this._graphics;

    }

    
}