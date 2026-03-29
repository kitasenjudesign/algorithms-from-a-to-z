
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { PathWrapper } from "../../font/PathWrapper";
import { p5Base } from "../00_base/p5Base";
import { FourierCircles } from "./FourierCircles";
import { TitleView } from "../../html/TitleView";

export class FourierP5 extends p5Base{

    private _width:number = 0;
    private _height:number = 0;
    private _ratio:number = 0.0;
    private _circles:FourierCircles;

    constructor(){
        super();
        //this._waveSimulation = new WaveSimulation();

    }

    
    init(moji:string,width:number,height:number,callback:()=>void){
        
        this._callback=callback;
        this._width = width;
        this._height = height;

        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                this._p5 = p;
                
                this.loadFont("F",()=>{
                    this.setUp(this._p5);
                    this._isInitialized=true;
                    callback();
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
            this._width,
            this._height
        );
        this._p5.pixelDensity(1);
        this._p5.frameRate(60);

        this._circles = new FourierCircles();
        let ox = this._width*0.3*(Math.random()-0.5);
        let oy = this._height*0.1*(Math.random()-0.5);
        let cx = this._width / 2+ox;
        let cy = this._height / 2+oy;
        this._circles.setStart(
            cx,
            cy
        );
        TitleView.setCenter(ox, oy);

        let list:{x:number,y:number}[] = [];
        let points = this._path.getPoints(
            this._width,
            this._height,10,0,0,400
        )[0];

        for(let i=0;i<points.length;i++){
            list.push({
                x:points[i][0],
                y:points[i][1]
            });
        }
        this._circles.init(list);

    }

    onLoad(){


    }

    click(){

    }

    reset(){
        
    }

    draw(){

        if(!this._isInitialized)return;

        this._p5.background(0)
        this._p5.stroke(255);

        this._circles.draw(this._p5);

    }

  

    resize(){

       
        
    }
    
}

