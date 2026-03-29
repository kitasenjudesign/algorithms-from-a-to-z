
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { Path } from "opentype.js";
import { PathWrapper } from "../../font/PathWrapper";
import { Stage } from "../../data/Stage";

export class p5BaseOld{

    private _callback   :()=>void;
    private _p5         :p5;
    private _fontManager:FontManager;
    private _path:PathWrapper;
    
    constructor(){
        
    }

    start(callback:()=>void){
        
        this._callback=callback;
         

        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                this._p5 = p;
                
                this._fontManager = new FontManager();
                this._fontManager.init("W",(path)=>{     
                    this._path = path;

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


    setUp(p: p5){
        
       this._p5.createCanvas(
            Stage.width,
            Stage.height
        );
        this._p5.pixelDensity(1);
        //r.id('p5canvas');
        //this._p5.frameRate(30);
        //this._p5.noSmooth();

        //this._p5.noLoop();
        this._p5.frameRate(30);

    }

    onLoad(){


    }

    click(){

    }

    reset(){
        
    }

    draw(){

        this._p5.background(255,255,255);
        this._p5.noFill();
        this._p5.stroke(0,0,0);

    }

    resize(){

       
        
    }
    
}

