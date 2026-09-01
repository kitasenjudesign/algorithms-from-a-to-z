
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { Path } from "opentype.js";
import { PathWrapper } from "../../font/PathWrapper";
import { WaveSimulation } from "./WaveSimulation";
import { p5Base } from "../00_base/p5Base";
import { TitleView } from "../../html/TitleView";
import { Stage } from "../../data/Stage";
import { Params } from "../../data/Params";

export class WaveMainP5 extends p5Base{

    private _ratio:number = 0.0;
    private _waveSimulation:WaveSimulation;
    private _ox:number = 0;
    private _oy:number = 0;
    private _flowY:number = 0;

    constructor(){
        super();
        //this._waveSimulation = new WaveSimulation();

    }

    start(callback:()=>void){
        
        this._callback=callback;
         

        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                this._p5 = p;
                let letter = Params.alphabet;
                if(letter=="") letter = "W";
                console.log("letter = ",letter);

                this._fontManager = new FontManager();
                this._fontManager.init(letter,(path)=>{
                    this.setUp(p);

                    this._ox = this._p5.width*0.4 * (Math.random()-0.5);
                    this._oy = this._p5.height*0.4 * (Math.random()-0.5);

                    TitleView.setCenter(this._ox,this._oy);

                    this._waveSimulation = new WaveSimulation();
                    this._path = path;
                    this._isInitialized=true;
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
        this._p5.frameRate(48);

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
        this._p5.fill(255,255,255,255);
        this._p5.stroke(0);

        //this._waveSimulation.draw(this._p5);
        this._waveSimulation.draw();
        if(this._p5.frameCount%120==1){
            this._waveSimulation.impulse();
            
            //this._waveSimulation.impulse();
            //this._waveSimulation.impulse();

            
        }


        //console.log(">>>>");
        //console.log(">>>>",this,this._path);
        
        
        let size = this._path.getBoundingBox();//ここ

        let w = size.xMax - size.xMin;
        let h = size.yMax - size.yMin;

        let scale = 9;
        w = w * scale;
        h = h * scale;

    
        let centerX = this._p5.width / 2 + this._ox;
        let centerY = this._p5.height / 2 + this._oy;
        
        //console.log(this._p5.frameCount)
        this._p5.beginShape();

        let sum:number = 0;

        this._path.getStrokes().forEach((stroke)=>{

            let num = 500;
            for(let t=0;t<num;t++){

                let rr = t/num + this._p5.frameCount * 0.001;

                let p1 = stroke.pointAt(rr%1);
                let p2 = stroke.pointAt((rr+0.002)%1);

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

                let amp = this._waveSimulation.pos[t%num] * 90.05
                /*
                this._p5.line(
                    cx,
                    cy,
                    cx + nx * amp,
                    cy + ny * amp
                );*/
                sum += amp;
                this._p5.vertex(cx + nx * amp, cy + ny * amp+this._flowY);
                
                
            }
            this._p5.endShape(this._p5.CLOSE);

        });
        
        this._flowY += sum*0.0001;
        this._flowY += (0 - this._flowY)/10;

    }

    resize(){

       
        
    }
    
}

