
import p5 from "p5";

import { p5Base } from "../00_base/p5Base";
import { IK } from "./IK";
import { TitleView } from "../../html/TitleView";
import { Params } from "../../data/Params";
import { Stage } from "../../data/Stage";


export class IKMainP5 extends p5Base{

    private _ox:number = 0;
    private _oy:number = 0;
    private _os:number = 0;

    private _strokeColor:string="#fff"
    private _bgColor:string = "#000"

    private _iks: IK[];

    constructor(){
        super();

        if(Params.color){
            this._strokeColor="#fff";
            this._bgColor="rgba(153, 0, 71, 1)"
        }
    }

    start(callback:()=>void){
        
        this._callback=callback;
         

        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                this._p5 = p;
                let letter = Params.alphabet;
                if(letter=="") letter = "IK";
                console.log("letter = ",letter);
                this.loadFont(
                    letter,()=>{
                    this.setUp(p);
                    this._callback();
                });
                
            }
            /** フレームごとの描画処理 */
            p.draw = ()=> {
                this.draw();
            }

            p.mouseClicked = ()=>{
                this.click();
            }

            p.windowResized = ()=>{
                this.resize();
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
        this._p5.frameRate(30);
        this._isInitialized=true;
        this.reset();

        
        this._iks = [];
        let allPoints = this._path.getPoints(
            this._p5.width,this._p5.height,10,0,0,400
        );
        

        this._ox=(Math.random()-0.5)*this._p5.width*0.2;
        this._oy=(Math.random()-0.5)*this._p5.height*0.2;


        for(let k=0;k<allPoints.length;k++){

            let points = allPoints[k];

           //listです
            console.log("len=",points.length);
            let start = 0;
            
            while(true){
                let num = 40+Math.floor(40*Math.random());
                let last = start+num;
                

                if(last>points.length) last = points.length;

                console.log(start,last,points.length);

                let list:{x:number,y:number}[] = [];
                for(let i=start;i<last;i++){                                            
                    list.push({
                        x:points[i][0]+this._ox,
                        y:points[i][1]+this._oy
                    });
                }
                start=last-1;
                let ik=new IK();
                ik.init(list);
                ik.startMove(this._iks.length*0.1);
                this._iks.push(ik);

                if(last>=points.length)break;

            }
                
                    

        }   

    }

    onLoad(){


    }

    click(){
        this.reset();
    }

    reset(){
        
    }

    draw(){

        if(!this._isInitialized)return;

        this._p5.background(this._bgColor);

        this._p5.noFill();
        this._p5.strokeWeight(5);
        this._p5.stroke(this._strokeColor);


        TitleView.setCenter(this._ox, this._oy);
        for(let i=0;i<this._iks.length;i++){
            let ik = this._iks[i];
            ik.draw(this._p5);// this._p5.mouseX, this._p5.mouseY);
        }

        //this.drawFont(this._p5.width, this._p5.height,this._os,this._ox,this._oy);

    }

   

    resize(){

        if (!this._p5) {
            return;
        }
        this._p5.resizeCanvas(Stage.width, Stage.height);

    }
    
}
