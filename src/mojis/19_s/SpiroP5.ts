
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { Path } from "opentype.js";
import { PathWrapper } from "../../font/PathWrapper";
import { TitleView } from "../../html/TitleView";
import { Params } from "../../data/Params";
import gsap from 'gsap';
import { CustomEase } from "gsap/CustomEase";

import { Stage } from "../../data/Stage";

export class SpiroP5{

    private _callback   :()=>void;
    private _p5         :p5;
    private _fontManager:FontManager;
    private _path:PathWrapper;

    private _ratio1:number = 0.0;
    private _ratio2:number = 0.0;

    private _amp1:number = 0.0;
    private _amp2:number = 0.0;

    private _tgtRatio1:number = 0.0;
    private _tgtRatio2:number = 0.0;

    private _ox:number = 0;
    private _oy:number = 0;

    private _isInitialized:boolean = false;

    constructor(){
      
    }

    start(callback:()=>void){
        
        this._callback=callback;
         

        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                this._p5 = p;
                let letter = Params.alphabet;
                if(letter=="") letter = "S";
                console.log("letter = ",letter);
                this._fontManager = new FontManager();
                this._fontManager.init(letter,(path)=>{     

                    this.setUp(p);
                    this._ox = this._p5.width*0.2* (Math.random()-0.5);
                    this._oy = this._p5.height*0.2* (Math.random()-0.5);
                    this._path = path;
                    this._isInitialized = true;
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
        
       this._p5.createCanvas(
            Stage.width,
            Stage.height
        );
        //r.id('p5canvas');
        //this._p5.frameRate(30);
        //this._p5.noSmooth();

        //this._p5.noLoop();
        this._p5.frameRate(30);

        Params.gui.add(this,"_amp1",0,500).listen();
        Params.gui.add(this,"_amp2",0,500).listen();
        Params.gui.add(this,"_tgtRatio1",0,1500).listen();
        Params.gui.add(this,"_tgtRatio2",0,1500).listen();

        this._tgtRatio1=500;
        this._tgtRatio2=500;
        this._amp1=80;
        this._amp2=240;

        this.loop1();

    }


    loop1(){
        
        gsap.to(this,{
            duration:10,
            //_tgtRatio1:100,
            //_tgtRatio2:300,
            ease:"linear"
            //ease: CustomEase.create("custom", "M0,0 C0.3,0.602 0.699,0.402 1,1 ")
        })

        gsap.to(this,{
            duration:10,
            _amp1:-30,
            _amp2:-60,
            ease:"sine.inOut",

            //ease: CustomEase.create("custom", "M0,0 C0.3,0.602 0.699,0.402 1,1 "),
        })

        gsap.to(this,{
            delay: 11,
            duration: 5,
            _tgtRatio1:500,
            _tgtRatio2:500,
            _amp1:80,
            _amp2:240,
            ease:"sine.inOut",
            onComplete:()=>{
                this.loop1();
            }
        });


        /*
        gsap.to(this,{
            duration:5,
            delay:5,
            _amp1:500,
            _amp2:500,
            ease: "power2.inOut"
        })
        gsap.to(this,{
            duration:5,
            delay:5,
            _tgtRatio1:300,
            _tgtRatio2:300,
            ease: "power2.inOut",
            onComplete:()=>{
                //this.loop1();
            }
        })*/
    }

    onLoad(){


    }

    click(){

    }

    reset(){
        
    }

    draw(){

        if(!this._isInitialized)return;

        this._p5.background(0,0,0);
        this._p5.noFill();
        this._p5.stroke(255,255,255,255);
        this._p5.strokeWeight(2);
        //console.log(">>>>");
        //console.log(">>>>",this,this._path);
                
        let size = this._path.getBoundingBox();
        let w = size.xMax - size.xMin;
        let h = size.yMax - size.yMin;

        let scale = 10;
        w = w * scale;
        h = h * scale;

        let centerX = this._p5.width / 2 + this._ox;
        let centerY = this._p5.height / 2 + this._oy;

        //console.log(this._p5.frameCount)

        TitleView.setCenter(
            this._ox,
            this._oy
        );
        //console.log("centerX,centerY",centerX,centerY);


        this._ratio1+=(this._tgtRatio1-this._ratio1)/4;
        this._ratio2+=(this._tgtRatio2-this._ratio2)/4;

        this._path.getStrokes().forEach((stroke)=>{

            let rad = 0;
            let px=0;
            let py=0;
            for(let t=0;t<=1;t+=0.001){

                let rr = t;

                let p1 = stroke.pointAt((rr)%1);
                let p2 = stroke.pointAt((rr+0.001)%1);
                let tx = p2.x - p1.x;
                let ty = p2.y - p1.y;

                let nx = -ty;
                let ny = tx;

                // 正規化
                const len = Math.hypot(nx, ny);
                nx /= len;
                ny /= len;

                let cx = p1.x*scale+centerX-w/2;
                let cy = p1.y*scale+centerY+h/2;

                /*
                this._p5.line(
                    cx,
                    cy,
                    cx + nx * 110,
                    cy + ny * 110
                )*/

                let xx = cx;// + nx * 110/2;
                let yy = cy;// + ny * 110/2;

                //xx += Math.cos(rad) * this._p5.mouseX/10;
                //yy += Math.sin(rad) * this._p5.mouseX/10;

                xx += this.getX(rad+this._p5.frameCount*0.1);
                yy += this.getY(rad+this._p5.frameCount*0.1);

                //this._p5.circle(xx,yy,5);
                

                rad += 0.05;

                if(px==0 && py==0){
                    px = xx;
                    py = yy;
                }

                
                this._p5.line(xx, yy, px,py);
                px=xx;
                py=yy;

                
                /*
                this._p5.circle(
                    cx+(nx*110)/2,
                    cy+(ny*110)/2,
                    110
                )*/
                /*
                this._p5.circle(
                    (2*cx+nx*110)/2,
                    (2*cy+ny*110)/2,
                    Math.sqrt( (nx*110)*(nx*110) + (ny*110)*(ny*110) )
               );*/
            
                /*
               this._p5.circle(
                    cx,
                    cy,
                    2
               );*/
            }
        
        });
    }

    
    getX(i:number){

        return this._amp1*Math.cos(i*this._ratio1*0.01)+this._amp2*Math.cos(i*this._ratio2*0.01);

    }

    getY(i:number){
        return this._amp1*Math.sin(i*this._ratio1*0.01)+this._amp2*Math.sin(i*this._ratio2*0.01);
    }

    resize(){

       
        
    }
    
}

