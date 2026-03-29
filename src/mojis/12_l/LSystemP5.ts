
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { Path } from "opentype.js";
import { PathWrapper } from "../../font/PathWrapper";
import { LSystemTree } from "./LSystemTree";
import { p5Base } from "../00_base/p5Base";
import { LSystemP5src } from "./LSystemP5src";
import { Params } from "../../data/Params";
import { TitleView } from "../../html/TitleView";
import { Stage } from "../../data/Stage";

export class LSystemP5 extends p5Base{

    private _trees:LSystemTree[];
    private _src:LSystemP5src;
    
    constructor(){
      super();
    }

    start(callback:()=>void){
        
        this._callback = callback;

        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                this._p5 = p;

                this._src = new LSystemP5src();
                this._src.start(()=>{
                     this.setUp(p);
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


    setUp(p: p5){
        
        this._isInitialized=true;

        let canvas = this._p5.createCanvas(
            Stage.width,
            Stage.height
        );

        
        //canvas.style.display = "block";

        //this._p5.frameRate(30);
        //this._p5.noSmooth();

        //ポイントの取得
        let points:{x:number,y:number}[] = [];
        let ww = LSystemP5src.W;
        let hh = LSystemP5src.H;
        for(let i=0;i<ww;i++){
            for(let j=0;j<hh;j++){
                if( this._src.getPixel(i,j).r > 128){
                    points.push({x:i/ww,y:j/hh});
                }
            }
        }
        

        this._p5.stroke(0,255,0 );
        this._trees=[];
        for(let i=0;i<100;i++){

            let p = points[Math.floor(Math.random()*points.length)];
            let t=new LSystemTree(
                p.x * Stage.width,
                p.y * Stage.height,
                0);//Math.PI*2*Math.random());
            this._trees.push(t);
        }
        TitleView.setPosition(
            Stage.width - TitleView.getSize().width-200,
            200
        );

        
        this._p5.frameRate(20);
    }

    onLoad(){


    }

    click(){

    }

    reset(){
        
    }

    draw(){

        if(!this._isInitialized)return;

        console.log("draw",this._trees);

        this._p5.background(0,0,0);
        this._p5.fill(255,0,255);
        this._p5.stroke(255,255,255);

        for(let t of this._trees){
            
            t.draw(
                this._p5,
                Math.sin(this._p5.frameCount*0.02)*0.2
            );
        }

    }

    resize(){


    
        
    }
    
}

