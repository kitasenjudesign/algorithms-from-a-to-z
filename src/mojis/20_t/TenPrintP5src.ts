import p5 from "p5";
import { p5Base } from "../00_base/p5Base";
import { Params } from "../../data/Params";


export class TenPrintP5src extends p5Base{

    public isInit:boolean=false;

    public _width       :number = 32;
    public _height      :number = 18;

    constructor(){
        //super();
        super();
    }

    init(callback:()=>void){

       
        this._callback=callback;

        new p5((p: p5)=>{
            
            /** 初期化処理 */
            p.setup = ()=>{
                this.loadFont("T",()=>{
                    this.setUp();                
                })
            }
            /** フレームごとの描画処理 */
            p.draw = ()=> {
                this.draw();
            }

            this._p5 = p;
        });
        
    }


    setUp(){

        let r = this._p5.createCanvas(
            this._width,
            this._height
        );
        r.id('p5canvasSrc');
        r.elt.style.display=Params.debug ? "block" : "none";
        r.elt.style.position="absolute";
        r.elt.style.top="0px";
        r.elt.style.left="0px";
        r.elt.style.zIndex="9999999";

        this._p5.frameRate(30);
        this._p5.noSmooth();
        this._p5.pixelDensity(1);
        this.isInit=true;
    
        //this._bg = 0;
        this._callback();
    }

    reset(){
        
    }

    draw(){

        if(!this.isInit)return;

        this._p5.background(0,0,255);
        this._p5.fill(255);
        this._p5.noStroke();
        //this.drawFont(this._width,this._height,0.3,0,0);

        this._p5.rect(2,2,28,4);
        this._p5.rect(13,4,5,13);
    }

}