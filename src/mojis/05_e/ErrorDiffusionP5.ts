
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { Path } from "opentype.js";
import { PathWrapper } from "../../font/PathWrapper";
import { ErrorDiffusionP5src } from "./ErrorDiffusionP5src";
import { Stage } from "../../data/Stage";
import { Params } from "../../data/Params";

export class ErrorDiffusionP5{

    private _callback   :()=>void;
    private _p5         :p5;
    private _fontManager:FontManager;
    private _path:PathWrapper;
    private _src:ErrorDiffusionP5src;
    private _isInit:boolean=false;

    private _baseImg:p5.Image;
    private _processImg:p5.Image;

    public static FPS:number = 12;
    constructor(){
        
    }

    start(callback:()=>void){
        
        console.log("start")
        this._callback=callback;
         
        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{

                this._p5 = p;
                const W = 140;
                this._src = new ErrorDiffusionP5src();
                let letter = Params.alphabet;
                if(letter=="") letter = "E";
                console.log("letter = ",letter);
                this._src.start(letter, W, Math.floor(W*window.innerHeight/innerWidth), ()=>{
                    this._isInit = true;
                    //console.log("start2")
                    this._callback();
                    this.setUp(p);
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
        this._p5.pixelDensity(1);
        this._p5.noSmooth();
        //r.id('p5canvas');
        //this._p5.frameRate(30);
        //this._p5.noSmooth();

        //this._p5.noLoop();
        this._p5.frameRate(15);

        //https://editor.p5js.org/kitasenjudesign/sketches/GhVl8zU7X
        //imgCopy.copy(baseImg, 0, 0, baseImg.width, baseImg.height, 0, 0, baseImg.width, baseImg.height);
        this._baseImg = this._p5.createImage(this._src._width, this._src._height);
        this._processImg = this._p5.createImage(this._src._width, this._src._height);
    }

    onLoad(){


    }

    click(){

    }

    reset(){
        
    }

    draw(){

        if(!this._isInit)return;

        this._src.setImage(this._baseImg);//baseImgにコピー

        this.makeDithered(this._baseImg,1)
        this._p5.image(this._baseImg,0,0,Stage.width, Stage.height);


    }

    resize(){

       
        
    }
    
    // Finds the closest step for a given value
    // The step 0 is always included, so the number of steps
    // is actually steps + 1
    closestStep(max:number, steps:number, value:number) {
        return Math.round(steps * value / 255) * Math.floor(255 / steps);
    }

    //描画負荷対策: p5.Colorの生成やred()/green()/blue()呼び出しはピクセル毎に非常に重いので、
    //pixels[]配列を直接読み書きする。元の実装もaddError内でG/BをRの値からしか作っていなかった
    //(事実上グレースケール処理)ので、誤差もR成分だけを伝搬させれば同じ結果になる
    makeDithered(img:p5.Image, steps:number) {
        img.loadPixels();

        const pixels = img.pixels;
        const w = img.width;
        const h = img.height;
        const vv = 2;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const idx = 4 * (x + y * w);
                const oldR = pixels[idx];
                const newR = this.closestStep(255, steps, oldR);

                pixels[idx] = newR;
                pixels[idx + 1] = newR;
                pixels[idx + 2] = newR;
                pixels[idx + 3] = 255;

                const errR = (oldR - newR) + (Math.random() * (vv * 2) - vv);

                this.addErrorFast(pixels, w, h, x + 1, y,     errR * (7 / 16));
                this.addErrorFast(pixels, w, h, x - 1, y + 1, errR * (3 / 16));
                this.addErrorFast(pixels, w, h, x,     y + 1, errR * (5 / 16));
                this.addErrorFast(pixels, w, h, x + 1, y + 1, errR * (1 / 16));
            }
        }

        img.updatePixels();
    }

    addErrorFast(pixels:number[], w:number, h:number, x:number, y:number, err:number) {
        if (x < 0 || x >= w || y < 0 || y >= h) return;
        const idx = 4 * (x + y * w);
        const v = pixels[idx] + err;
        pixels[idx] = v;
        pixels[idx + 1] = v;
        pixels[idx + 2] = v;
    }




}

