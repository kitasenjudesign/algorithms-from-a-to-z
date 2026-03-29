
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { Path } from "opentype.js";
import { PathWrapper } from "../../font/PathWrapper";
import { ErrorDiffusionP5src } from "./ErrorDiffusionP5src";
import { Stage } from "../../data/Stage";

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
                this._src.start("E", W, Math.floor(W*window.innerHeight/innerWidth), ()=>{
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
    
    imageIndex(img:p5.Image, x:number, y:number) {
        return 4 * (x + y * img.width);
    }

    getColorAtindex(img:p5.Image, x:number, y:number) {
        let idx = this.imageIndex(img, x, y);
        let pix = img.pixels;
        let red = pix[idx];
        let green = pix[idx + 1];
        let blue = pix[idx + 2];
        let alpha = pix[idx + 3];
        return this._p5.color(red, green, blue, alpha);
    }

    setColorAtIndex(img:p5.Image, x:number, y:number, clr:p5.Color) {
        let idx = this.imageIndex(img, x, y);

        let pix = img.pixels;
        pix[idx] = this._p5.red(clr);
        pix[idx + 1] = this._p5.green(clr);
        pix[idx + 2] = this._p5.blue(clr);
        pix[idx + 3] = this._p5.alpha(clr);

    }

    // Finds the closest step for a given value
    // The step 0 is always included, so the number of steps
    // is actually steps + 1
    closestStep(max:number, steps:number, value:number) {
        return Math.round(steps * value / 255) * Math.floor(255 / steps);
    }

    makeDithered(img:p5.Image, steps:number) {
        img.loadPixels();

        for (let y = 0; y < img.height; y++) {
            for (let x = 0; x < img.width; x++) {
                let clr = this.getColorAtindex(img, x, y);
                let oldR = this._p5.red(clr);
                let oldG = this._p5.green(clr);
                let oldB = this._p5.blue(clr);
                let newR = this.closestStep(255, steps, oldR);
                let newG = this.closestStep(255, steps, oldG);
                let newB = this.closestStep(255, steps, oldB);

                let newClr = this._p5.color(newR, newG, newB);
                this.setColorAtIndex(img, x, y, newClr);

                let errR = oldR - newR;
                let errG = oldG - newG;
                let errB = oldB - newB;

                this.distributeError(img, x, y, errR, errG, errB);
            }
        }

        img.updatePixels();
    }

    distributeError(img:p5.Image, x:number, y:number, errR:number, errG:number, errB:number) {

        let n1 = 7/16
        let n2 = 3/16
        let n3 = 5/16
        let n4 = 1/16

        let vv = 2;//this._p5.mouseX;
        errR+=this._p5.random(-vv,vv);
        errG+=this._p5.random(-vv,vv);
        errB+=this._p5.random(-vv,vv);
        
        this.addError(img, n1, x + 1, y, errR, errG, errB);
        this.addError(img, n2, x - 1, y + 1, errR, errG, errB);
        this.addError(img, n3, x, y + 1, errR, errG, errB);
        this.addError(img, n4, x + 1, y + 1, errR, errG, errB);
        
    }

    addError(img:p5.Image, factor:number, x:number, y:number, errR:number, errG:number, errB:number) {
        if (x < 0 || x >= img.width || y < 0 || y >= img.height) return;
        let clr = this.getColorAtindex(img, x, y);
        let r = this._p5.red(clr);
        let g = this._p5.green(clr);
        let b = this._p5.blue(clr);
        clr.setRed(r + errR * factor);
        //clr.setGreen(g + errG * factor);
        //clr.setBlue(b + errB * factor);
        clr.setGreen(r + errR * factor);
        clr.setBlue(r + errR * factor);

        this.setColorAtIndex(img, x, y, clr);
    }




}

