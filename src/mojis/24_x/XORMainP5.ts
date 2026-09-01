
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { Path } from "opentype.js";
import { PathWrapper } from "../../font/PathWrapper";
import { TitleView } from "../../html/TitleView";
import { Stage } from "../../data/Stage";
import { Params } from "../../data/Params";

export class XORMainP5{

    private _callback   :()=>void;
    private _p5         :p5;
    private _fontManager:FontManager;
    private _path:PathWrapper;
    private _isInit:boolean=false;
    private _ox:number = 0;
    private _oy:number = 0;
    private _os:number = 1;
    constructor(){
        
        //this._waveSimulation = new WaveSimulation();

    }

    start(callback:()=>void){
        
        this._callback=callback;
         

        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                this._p5 = p;
                let letter = Params.alphabet;
                if(letter=="") letter = "X";
                console.log("letter = ",letter);

                this._fontManager = new FontManager();
                this._fontManager.init(letter,(path)=>{     
                    this._path = path;
                    this.setUp(this._p5);
                    this._isInit=true;
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

        this._ox = 300*(Math.random()-0.5);
        this._oy = 300*(Math.random()-0.5);
        this._os = 5 + Math.random() * 5;
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

        if(!this._isInit)return;

        this._p5.blendMode(this._p5.BLEND);
        this._p5.background(0,0,0);

        this._p5.blendMode(this._p5.DIFFERENCE);


        let rect = this._path.getRect();
        let s = this._path.getStrokes();
        let scl = this._os;

        let num = 1 + 80 * Math.pow(0.5 + 0.5 * Math.sin(this._p5.frameCount * 0.001+Math.PI/12), 3);
        let radius = 120;

        for(let i=0;i<s.length;i++){

            for(let j=0;j<=num;j++){

                let ratio = j / num + this._p5.frameCount * 0.001;
                ratio %= 1;

                let ss = s[i].pointAt( ratio );
                let xx = (ss.x-rect.x - rect.width/2)*scl;
                let yy = (ss.y-rect.y - rect.height/2)*scl;
                xx+=this._ox;
                yy+=this._oy;
                this._p5.circle(
                    xx + Stage.width/2,
                    yy + Stage.height/2,
                    radius
                );
            }

        }
        
        TitleView.setCenter(this._ox,this._oy);


    }

    resize(){

       
        
    }
    
}

