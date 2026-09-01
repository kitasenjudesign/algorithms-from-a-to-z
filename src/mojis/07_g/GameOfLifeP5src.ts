import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { Path } from "opentype.js";
import { PathWrapper } from "../../font/PathWrapper";
import { Params } from "../../data/Params";
import { ParamsG } from "./data/ParamsG";
import { TitleView } from "../../html/TitleView";

export class GameOfLifeP5src{

    private _callback   :()=>void;

    public _p5         :p5;
    private _fontManager:FontManager;
    private _path:PathWrapper;
    public _width:number = 0;
    public _height:number = 0;
    private _blurAmount: number = 0; // px or p5 filter value
    private _ox:number = 0;
    private _oy:number = 0;
    private _os:number = 0.6;

    constructor(){
        
    }

    start(str:string,w:number,h:number,callback:()=>void){

        this._callback=callback;
         this._width=w;
         this._height=h;
        console.log("GameOfLifeP5src:start", w, h);
        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{

                this._p5 = p;
                this._os=0.6+0.05*(Math.random());
                
                this._fontManager = new FontManager();
                this._fontManager.init(str,(path)=>{     
                    
                    this._path = path;
                    this.setUp(p);
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
        
        let r=this._p5.createCanvas(
            this._width,
            this._height
        );
        this._ox = this._p5.width / 2*0.2*(Math.random()-0.5);
        this._oy = this._p5.height / 2*0.2*(Math.random()-0.5);

        TitleView.setCenter(
            this._ox,
            this._oy
        );

        this._p5.pixelDensity(1);
        r.id("p5canvas");
        
        document.getElementById("p5canvas").style.top="100px"  

        if(!Params.debug){
            document.getElementById("p5canvas").style.display="none";
        }

        this._p5.frameRate(30);
        this.draw();

    }

    onLoad(){


    }

    click(){

    }

    reset(){
        
    }

    /**
     * ブラー量を設定（0で無効）
     * amount: p5.filter の値（小さいほど弱い）、もしくはピクセル単位のぼかし量（フォールバック）
     */
    public setBlur(amount: number){
        this._blurAmount = Math.max(0, amount);
    }

    draw(){

        this._p5.noStroke();
        this._p5.fill(0,0,0);
        this._p5.rect(0,0,this._width,this._height);
        this._p5.fill(255,255,255);
        this._path.draw(this._p5,this._width,this._height,this._os,this._ox,this._oy);
    
    }

    getPixel(i:number,j:number): number{

        //console.log(i,j,this._p5.width,this._p5.height);

        return this._p5.get(i,j)[0];

        /*
        let img = this._p5.drawingContext.getImageData(i,j,1,1);
        let data = img.data;
        return {
            r: data[0],
            g: data[1],
            b: data[2],
            a: data[3]
        };*/

    }

    setImage(img:p5.Image){
        
        img.loadPixels();

        for(let j=0;j<this._height;j++){
            for(let i=0;i<this._width;i++){
                img.set(i,j,this._p5.get(i,j) );
            }
        }

        img.updatePixels();

    }

    getImageData(): ImageData{
        return this._p5.drawingContext.getImageData(0, 0, this._width, this._height);
    }

    resize(){

       
        
    }
    
}

