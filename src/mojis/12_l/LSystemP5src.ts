
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { Path } from "opentype.js";
import { PathWrapper } from "../../font/PathWrapper";
import { LSystemTree } from "./LSystemTree";
import { p5Base } from "../00_base/p5Base";
import { Params } from "../../data/Params";

export class LSystemP5src extends p5Base{


    public static W:number = 90;
    public static H:number = 90;

    private _trees:LSystemTree[];

    constructor(){
      super();
    }

    start(callback:()=>void){
        
        this._callback=callback;
         
        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{

                this._p5 = p;           
                let letter = Params.alphabet;
                if(letter=="") letter = "L";
                console.log("letter = ",letter);     
                this.loadFont(letter,()=>{
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
            LSystemP5src.W,
            LSystemP5src.H
        );
        this._p5.pixelDensity(1);
        canvas.id('p5canvas');
        document.getElementById("p5canvas").style.position="fixed";
        document.getElementById("p5canvas").style.top="0";
        document.getElementById("p5canvas").style.left="0";
        document.getElementById("p5canvas").style.zIndex="10000";

        if(!Params.debug){
            canvas.elt.style.display = "none";
        }

        this._p5.noLoop();
        this.drawFont(this._p5.width,this._p5.height,1,0,0);

    }

    onLoad(){


    }

    click(){

    }

    reset(){
        
    }

    draw(){

        if(!this._isInitialized)return;



    }

    resize(){


    
        
    }
    
}

