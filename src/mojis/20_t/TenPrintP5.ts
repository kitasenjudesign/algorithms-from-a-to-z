
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { Path } from "opentype.js";
import { PathWrapper } from "../../font/PathWrapper";
import { p5fontCanvas } from "../00_base/p5fontCanvas";
import { TenPrintP5src } from "./TenPrintP5src";
import { Params } from "../../data/Params";
import { TitleView } from "../../html/TitleView";
import { Stage } from "../../data/Stage";

export class TenPrintP5{

    private _callback   :()=>void;
    private _p5         :p5;
    private _src:TenPrintP5src;
    private _width:number = 32;
    private _height:number = 18;
    private _isInit:boolean = false;
    private _list: number[][] = [];
    private _count: number = 0;
    private _type: number = 0;
    //private _imageData: ImageData | null;

    

    constructor(){
      
    }


    start(callback:()=>void){
        
        console.log("start!!!");
        this._callback=callback;
         
        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                this._p5 = p;

                this._src = new TenPrintP5src();
                this._src.init(()=>{
                    for(let j=0;j<this._src._height;j++){
                        this._list[j] = [];
                        for(let i=0;i<this._src._width;i++){
                            this._list[j][i] = Math.random() > 0.5 ? 1 : 0;
                        }
                    }
                    this.setUp(p);
                });
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
        
        let r = this._p5.createCanvas(
            Stage.width,
            Stage.height
        );


        r.id('p5canvas');
        r.elt.display = Params.debug ? "block" : "none";
        
        TitleView.setPosition(
            Stage.width/this._width*18,
            Stage.height/this._height*17-TitleView.getSize().height
        );
        //this._p5.frameRate(30);
        //this._p5.noSmooth();

        //this._p5.noLoop();
        this._p5.frameRate(5.53);
        this._isInit=true;

        //

    }

    onLoad(){


    }

    click(){

    }

    reset(){
        
    }

    draw(){

        if(!this._isInit)return;   

        this._p5.background(0);
        
        this._p5.stroke(255);
        this._p5.strokeWeight(1);
        //console.log("draw");
        let ww = Stage.width / this._width;
        let hh = Stage.height / this._height;

        let num = this._src._width;
        for(let i=0;i<num;i++){

            let idx = this._count % (this._src._width * this._src._height);
            let j = Math.floor(idx / this._src._width);
            let i = idx % this._src._width;
            this._count++;

            switch(this._type%3){
                case 0:
                    this._list[j][i]=Math.random() > 0.5 ? 1 : 0;
                    break;
                case 1:
                    this._list[j][i]=this._src.getPixel(i,j).r>128 ? 1 : 0;
                    break;
                case 2:
                    this._list[j][i]=this._src.getPixel(i,j).r>128 ? Math.random() > 0.5 ? 1 : 0 : 1;
                    break;
            }

            for(let j=0;j<this._src._height;j++){
                for(let i=0;i<this._src._width;i++){
                    this.drawPrint(i,j,ww,hh,this._list[j][i]);
                }
            }

        }

        if(this._count>=this._src._width * this._src._height){
            this._count = 0;
            this._type++;

        }

       /*
                    let pixel = this._src.getPixel(i,j);
                    if(pixel.r>128){
                        this.drawPrint(i,j,ww,hh,1);
                    }else{  
                        this.drawPrint(i,j,ww,hh,Math.random()>0.5 ? 0 : 1);
                    }*/
        


    }


    drawPrint(xx:number,yy:number,sizeX:number,sizeY:number,type:number=0){

        xx *= sizeX;
        yy *= sizeY;

        if(type==0){
            this._p5.line(xx,yy,xx+sizeX,yy+sizeY);
        }else{
            this._p5.line(xx+sizeX,yy,xx,yy+sizeY);
        }

    }

    resize(){

       
        
    }
    
}

