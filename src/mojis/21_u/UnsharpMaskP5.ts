import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { Path } from "opentype.js";
import { PathWrapper } from "../../font/PathWrapper";
import { p5fontCanvas } from "../00_base/p5fontCanvas";
import { UnsharpMaskP5src } from "./UnsharpMaskP5src";
import { Stage } from "../../data/Stage";
import { Params } from "../../data/Params";

export class UnsharpMaskP5{

    private _callback   :()=>void;
    private _p5         :p5;
    private _isInit     :boolean=false;
    private _src        :UnsharpMaskP5src;
    private _image:p5.Image;

    // ping-pong buffers for feedback
    private _bufA!: p5.Graphics;
    private _bufB!: p5.Graphics;
    private _ping: number = 0; // 0 => A is src, 1 => B is src
    // unsharp params
    private _usAmount: number = 0.65;     // strength of unsharp (0..1 recommended)
    private _usBlurRadius: number = 4;   // blur radius used for the blurred image

    private _randA:number = Math.random()*0.02+1;
    private _randB:number = Math.random()*0.02+1;
    private _randC:number = Math.random()*0.02+1;

    private _frameCount:number = 0;

     constructor(){
       this._isInit = false;
     }


    start(callback:()=>void){
        
        console.log("start!!!");
        this._callback=callback;
         
        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{

                if(!Params.isStation){
                    this._usAmount=0.8;
                }
                this._p5 = p;
                this._src= new UnsharpMaskP5src();
                this._src.start(()=>{
                    this.setUp(p);
                    this._isInit=true;
                    this.draw();
                    callback();
                })
               
                //this._imageData = null;
            }
            /** フレームごとの描画処理 */
            p.draw = ()=> {
                //console.log("draw");
                this.draw();
            }

            p.mouseClicked = ()=>{

            }
            
        };
        
        new p5(sketch, document.body);
    }


    setUp(p: p5){
         
         let n = this._p5.createCanvas(
             Stage.width,
             Stage.height
         );
         

        n.id('p5canvas');

        /*
        if(!Params.debug){
            n.elt.style.display="block";
        }else{
            n.elt.style.display="none";
        }*/
        
        document.getElementById("p5canvas")!.style.position="absolute";
        //document.getElementById("p5canvas")!.style.top="310px";
        //document.getElementById("p5canvas")!.style.left="110px";

        //r.id('p5canvas');
        //this._p5.frameRate(30);
        //this._p5.noSmooth();
        this._image = this._p5.createImage(this._src._width, this._src._height);
        
        this._src.setImage(this._image);
        // create ping-pong buffers sized to the source image
        this._bufA = this._p5.createGraphics(this._image.width, this._image.height);
        this._bufA.pixelDensity(1);
        this._bufB = this._p5.createGraphics(this._image.width, this._image.height);
        this._bufB.pixelDensity(1);

        // initialize bufA with the original image (draw once)
        this._bufA.clear();
        this._bufA.image(this._image, 0, 0, this._bufA.width, this._bufA.height);
        this._ping = 0;
         //this._p5.noLoop();
         this._p5.frameRate(1);
         this._p5.noSmooth();
         

    }

    onLoad(){


    }

    click(){

    }

    reset(){
        
    }

    draw(){
        if(!this._isInit) {
            console.log("not init");
            return;
        }

        this._frameCount++;
        console.log(this._frameCount);

        if(Params.isStation){
            if(this._frameCount>=11)return;
        }
        //console.log("loop");

        // ping-pong: select src and dst buffers
        const src = (this._ping === 0) ? this._bufA : this._bufB;
        const dst = (this._ping === 0) ? this._bufB : this._bufA;

        //this._usAmount=1;
        // apply unsharp mask from src -> dst
        this.applyUnsharpToBuffer(src, dst, this._usAmount, this._usBlurRadius);

        // draw result scaled to canvas
        this._p5.background(0);
        this._p5.image(dst, 0, 0, this._p5.width, this._p5.height);

        // swap for next frame (feedback)
        this._ping = 1 - this._ping;


    }

    resize(){

     }
    
    // Core: unsharp mask from srcGraphics into dstGraphics (pixel-wise)
    private applyUnsharpToBuffer(srcG: p5.Graphics, dstG: p5.Graphics, amount: number, blurRadius: number){
        const p = this._p5;
        const w = srcG.width, h = srcG.height;

        // produce blurred version in a temp graphics
        const blurG = p.createGraphics(w, h);
        blurG.pixelDensity(1);
        blurG.image(srcG, 0, 0);
        // built-in blur filter (integer radius)
        blurG.filter((p as any).BLUR || 'blur', blurRadius);
        blurG.loadPixels();

        srcG.loadPixels();
        dstG.loadPixels();

        const srcPixels = srcG.pixels;
        const blurPixels = blurG.pixels;
        const dstPixels = dstG.pixels;
        const len = w * h * 4;

        // formula: out = src*(1+amount) - blur*amount
        const kSrc = 1 + amount;
        const kBlur = amount;

        for(let i=0;i<len;i+=4){
            // RGBA channels
            const sr = srcPixels[i];
            const sg = srcPixels[i+1];
            const sb = srcPixels[i+2];
            const sa = srcPixels[i+3];

            const br = blurPixels[i];
            const bg = blurPixels[i+1];
            const bb = blurPixels[i+2];
            const ba = blurPixels[i+3];

            let or = Math.round(sr * kSrc - br * kBlur*this._randA);
            let og = Math.round(sg * kSrc - bg * kBlur*this._randB);
            let ob = Math.round(sb * kSrc - bb * kBlur*this._randC);
            let oa = sa; // preserve alpha from source

            // clamp 0..255
             if(!Params.isStation){
                if(or < 0) or = 0; else if(or > 230) or = 230;
                if(og < 0) og = 0; else if(og > 230) og = 230;
                if(ob < 0) ob = 0; else if(ob > 230) ob = 230;

             }else{
                if(or < 0) or = 0; else if(or > 210) or = 210;
                if(og < 0) og = 0; else if(og > 210) og = 210;
                if(ob < 0) ob = 0; else if(ob > 210) ob = 210;

             }

            dstPixels[i] = or;
            dstPixels[i+1] = og;
            dstPixels[i+2] = ob;
            dstPixels[i+3] = oa;
        }

        dstG.updatePixels();
        // clean temp
        blurG.remove();
    }

 }

