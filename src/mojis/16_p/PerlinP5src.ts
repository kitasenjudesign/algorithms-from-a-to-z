import p5, { Graphics, Shader } from "p5";
import { p5Base } from "../00_base/p5Base";
import { Params } from "../../data/Params";

export class PerlinP5src extends p5Base{

    private _graphics:p5.Graphics;
    private _font!:p5.Font;
    private _letter:string = "P";
    private _textSize:number = 80;
    private _textX:number = 0;
    private _textY:number = 0;

    constructor(){
      super();
    }

    start(callback:()=>void){

        this._callback=callback;

        let sketch = (p: p5)=>{

            p.preload = ()=>{
                this._font = p.loadFont("./data/FreeSans.otf");
            }

            /** 初期化処理 */
            p.setup = ()=>{

                this._p5 = p;
                let letter = Params.alphabet;
                if(letter=="") letter = "P";
                console.log("letter = ",letter);

                this._letter = letter;
                this.setUp(p);
                this._callback();

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

        this._isInitialized=true;

        let canvas = this._p5.createCanvas(
            160,
            90
        );
        this._graphics=this._p5.createGraphics(160,90);
        this._graphics.textFont(this._font);
        this._graphics.textSize(this._textSize);
        this._graphics.noStroke();
        this.layoutText();

        this._p5.pixelDensity(1);
        canvas.id('p5canvasSrc');

        document.getElementById("p5canvasSrc").style.display = Params.debug ? "block" : "none";
        document.getElementById("p5canvasSrc").style.position="fixed";
        document.getElementById("p5canvasSrc").style.top="0";
        document.getElementById("p5canvasSrc").style.left="0";
        document.getElementById("p5canvasSrc").style.zIndex="10000";

    }

    //textAlign(CENTER,CENTER)はフォントのascent/descentを基準に揃えるため、
    //フォントによって見た目の中心とずれる。実際のグリフの見た目のbboxで中心を計算する
    private layoutText(){

        const bounds = this._font.textBounds(this._letter, 0, 0, this._textSize) as {x:number,y:number,w:number,h:number};

        this._textX = this._graphics.width/2  - (bounds.x + bounds.w/2);
        this._textY = this._graphics.height/2 - (bounds.y + bounds.h/2);

    }

    onLoad(){


    }

    click(){

    }

    reset(){
        
    }

    draw(){

        if(!this._isInitialized)return;

        this._graphics.background(0);
        this._graphics.fill(255);
        this._graphics.text(this._letter, this._textX, this._textY);

        this._p5.image(this._graphics,0,0,this._p5.width,this._p5.height);

    }

    resize(){

    }

    
    

    public getGraphics():Graphics{
        
        return this._graphics;

    }

    
}