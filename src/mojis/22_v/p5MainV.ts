// 型がないので一旦無視
import p5 from "p5";

// windowオブジェクトにp5を強制的に設定
//(window as any).p5 = p5;

// p5.svg.jsをグローバルにロード
//import './p5.svg.js';

import { p5MainBase } from './p5MainBase';
import { VMain } from "./verlet/VMain";
import { Params } from "../../data/Params";
import { FontManager } from "../../font/FontManager";
import { PathWrapper } from "../../font/PathWrapper";
import { Stage } from "../../data/Stage";
import { TitleView } from "../../html/TitleView";

export class p5MainV extends p5MainBase{


    public _width       :number = 512;
    public _height      :number = 512;
    private _p5         :p5;
    private _vMain      :VMain;
    private _fontManager :FontManager;
    private _callback   :()=>void;
    private _path:PathWrapper;
    public static instance:p5MainV;

    private _ox:number = 0;
    private _oy:number = 0;

    private _bgColor="#000";
    private _strokeColor="#fff"

    constructor(){
        super();
        if(Params.color){
            this._strokeColor = "#f30"
            this._bgColor = "#44f"
        }
        p5MainV.instance = this;
    }

    init(callback:()=>void){

        this._callback=callback;
        
        this._vMain = new VMain();

        //@ts-ignore
        new p5((p: p5)=>{
        //new p5((p: p5)=>{
            p.setup = ()=>{
                this._p5 = p;
                this._width=Stage.width;
                this._height=Stage.height;
                this._fontManager = new FontManager();
                this._fontManager.init("V",(path)=>{
                    
                    this._path=path;
                    this._ox = 200 * (Math.random()-0.5);
                    this._oy = 50 * (Math.random()-0.5);
                    TitleView.setCenter(this._ox,this._oy);
                    this.setUp();

                });
            }
            
            p.draw = ()=> {
                this.draw();
            }

            // キー操作でSVGを保存
            p.keyPressed = () => {
                if (p.key === 's') {
                    p.save("output.svg"); // SVGファイルを保存
                }
            };

        });
        
    }

    setUp(){


        //@ts-ignore
        //console.log(this._p5.createCanvas);

        let r = this._p5.createCanvas(
            Stage.width,
            Stage.height
        );
        //r.id('p5canvas');
        this._p5.frameRate(60);
        this._p5.noSmooth();
        

        r.elt.addEventListener("mousedown",()=>{
            //this._vMain.startRec();
        })
        r.elt.addEventListener("mouseup",()=>{
            //this._vMain.endRec();
        })

        //console.log(r.elt);
        this.canvasElement = r.elt;//scopeがよくわからない
        this.isInit=true;
    
        this._vMain.makeLines();
        
        /*
        for(let j=0;j<200;j++){

            let p1 = this.getPosition(Math.random());
            let p2 = this.getPosition(Math.random());
            this._vMain.startRec();
            let num = 20;//２０分割する
                        
            for(let i=0;i<num;i++){
                let r1 = i/(num-1);
                let r2 = 1 - r1;
                this._vMain.updateRec(
                    p1.x*r1+p2.x*r2+1*Math.random(),
                    p1.y*r1+p2.y*r2+1*Math.random(),
                );
            }
            this._vMain.endRec();

        }*/

        this._callback();
        Params.gui.add(this,"reset");
    }

    public getPosition(ratio:number):{x:number,y:number}{

        let s = this._path.getStrokes()[0];
        let scl = 10.5;
        let rect = this._path.getRect();

        let p1 = s.pointAt(ratio);
        let xx1 = (p1.x-rect.x - rect.width/2)*scl;
        let yy1 = (p1.y-rect.y - rect.height/2)*scl;
        xx1+=this._width/2+this._ox;
        yy1+=this._height/2+this._oy;



        return {x:xx1,y:yy1};
    }



    draw(){

        this._p5.background(this._bgColor);
        this._p5.stroke(this._strokeColor);
        this._p5.noFill();
        this._p5.strokeWeight(1);
        

        if(this._p5.mouseIsPressed){

            this._vMain.updateRec(
                this._p5.mouseX,
                this._p5.mouseY
            );

        }
        
        this._vMain.update(this._p5)
        
    }

    reset(){

        this._vMain.reset();

    }
    

}

