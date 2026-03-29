
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { Path } from "opentype.js";
import { PathWrapper } from "../../font/PathWrapper";
import { p5fontCanvas } from "../00_base/p5fontCanvas";
import { QuadTreeThree } from "./QuadTreeThree";
import { QuadTreeSplitter } from "./QuadTreeSplitter";
import { Stage } from "../../data/Stage";
import gsap from "gsap";
import { TitleView } from "../../html/TitleView";

export class QuadTreeP5{

    private _callback   :()=>void;
    private _p5         :p5;
    private _src        :QuadTreeThree;
    private _splitter   :QuadTreeSplitter;
    private _isInit     :boolean=false;
    constructor(){
      this._isInit = false;
    }


    start(callback:()=>void){
        
        console.log("start!!!");
        this._callback=callback;
         
        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                this._p5 = p;
                

                this._src = new QuadTreeThree();
                this._src.init(()=>{
                    this.setUp(p);
                    TitleView.setPosition(
                        Stage.width/8,
                        Stage.height/8
                    )
                    this._isInit=true;
                    callback();
                });
                
                //this._imageData = null;
            }
            /** フレームごとの描画処理 */
            p.draw = ()=> {
                //console.log("draw");
                this.draw();
            }

            p.mouseClicked = ()=>{

            }
            
        };
        
        new p5(sketch, document.body);
    }


    setUp(p: p5){
        
        let n = this._p5.createCanvas(
            Stage.width,
            Stage.height
        );
        n.id('p5canvas');
        document.getElementById("p5canvas")!.style.position="absolute";

        this._splitter = new QuadTreeSplitter();
        
        this._p5.frameRate(12);
        this.loopAnim();
    }


    loopAnim(){

        this._splitter._maxDepth = 0;
        this._splitter.animParams(7,2,1);
       
        this._src.rotate(4,4);
        //this._splitter.animColor(60,0.5,5.5);
        //this._splitter.animColor(255,0.5,8.5);
        
        this._splitter.animParams(0,1,8.5);

        gsap.delayedCall(10.5,this.loopAnim.bind(this));
    }

    onLoad(){


    }

    click(){

    }

    reset(){
        
    }

    draw(){

        if(!this._isInit)return;

        //if(!this._isInit)return;

        //if(this._p5.frameCount%30==1)this._splitter.changeParam();

        //console.log("draw");
        //this._p5.background(0);
        let data = this._src.captureImageData();
        this._splitter.split(this._p5, data);


    }

    resize(){

       
        
    }
    
}

