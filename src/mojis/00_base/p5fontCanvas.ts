
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { PathWrapper } from "../../font/PathWrapper";

export class p5fontCanvas{

    private _callback   :()=>void;
    private _p5         :p5;
    private _fontManager:FontManager;
    private _path:PathWrapper;
    private _width:number = 0;
    private _height:number = 0;
    private _ratio:number = 0.0;

    constructor(){
        
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
                
                this._fontManager = new FontManager();
                this._fontManager.init(moji,(path)=>{     
                    this._path = path;
                    this.setUp(this._p5);
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
            this._width,
            this._height
        );
        
        this._p5.pixelDensity(1);

        //r.id('p5canvas');
        //this._p5.frameRate(30);
        //this._p5.noSmooth();

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

        if(this._p5.frameCount%100==1) this._p5.background(255,255,255);

        this._p5.fill(0);
        this._p5.stroke(0,0,0);

        let s = this._path.getStrokes();
        let scl = 0.5;
        let rect = this._path.getRect();//
       
        
        for(let i=0;i<s.length;i++){

            let p = s[i].pointAt(Math.random());
            let xx = (p.x-rect.x - rect.width/2)*scl;
            let yy = (p.y-rect.y - rect.height/2)*scl;
            xx+=this._width/2;
            yy+=this._height/2;

            //this._p5.circle(xx,yy,2);

            this._p5.rect(xx,yy,2,2);

        }
        
        

    }

    getPixel(i:number,j:number): {r:number,g:number,b:number,a:number}{

        let img = this._p5.drawingContext.getImageData(i,j,1,1);
        let data = img.data;
        return {
            r: data[0],
            g: data[1],
            b: data[2],
            a: data[3]
        };

    }

    resize(){

       
        
    }
    
}

