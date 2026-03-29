import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { Path } from "opentype.js";
import { PathWrapper } from "../../font/PathWrapper";
import { TitleView } from "../../html/TitleView";
import { Stage } from "../../data/Stage";
import { Params } from "../../data/Params";

export class UnsharpMaskP5src{

    private _callback   :()=>void;

    public _p5         :p5;
    private _fontManager:FontManager;
    private _path:PathWrapper;
    public _width:number = 0;
    public _height:number = 0;
    private _blurAmount: number = 0; // px or p5 filter value
    private _ox:number = 0;
    private _oy:number = 0;
    private _os:number = 1;

    constructor(){
        
    }

    start(callback:()=>void){

        this._callback=callback;
         this._width=160*2;
         this._height=90*2;

        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                this._p5 = p;

                this._ox=(Math.random()-0.5)*this._width*0.2;
                this._oy=(Math.random()-0.5)*this._height*0.2;
                this._os=1.8;//+Math.random()*0.2;

                this._fontManager = new FontManager();
                this._fontManager.init("U",(path)=>{   
                    this._path = path;  
                    this.setUp(p);
                    
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
        
        let r=this._p5.createCanvas(
            this._width,
            this._height
        );
        this._p5.pixelDensity(1);
        r.id("p5canvas");

        if(!Params.debug){
            r.elt.style.display="none";
        }
        document.getElementById("p5canvas").style.top="100px"
        //r.id('p5canvas');
        //this._p5.frameRate(30);
        //this._p5.noSmooth();

        //this._p5.noLoop();
        this._p5.frameRate(15);
        this._p5.noLoop();
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

        if(!this._path)return;

        let ratio = 0.5+0.5*Math.sin(this._p5.frameCount*0.05);

        this._p5.fill(0);
        this._p5.rect(0,0,this._width,this._height);
        this._p5.fill(255,255,255,255-ratio*105);

    
        this._p5.noStroke();

        let oxx = this._ox/this._p5.width*Stage.width;
        let oyy = this._oy/this._p5.height*Stage.height;

        TitleView.setCenter(oxx, oyy);

        this._path.draw(
            this._p5,this._width,this._height,this._os,this._ox,this._oy
        );

        
        this._blurAmount = 12;


        // 単純に p5 の filter を使う（適用できればこれでOK）
        if(this._blurAmount > 0){
            try {
                // p5 のフィルタ（renderer が P2D なら有効）
                (this._p5 as any).filter((this._p5 as any).BLUR, this._blurAmount);
            } catch(e) {
                
            }
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

