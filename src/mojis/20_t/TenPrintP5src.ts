import p5 from "p5";
import { p5Base } from "../00_base/p5Base";
import { Params } from "../../data/Params";


export class TenPrintP5src extends p5Base{

    public isInit:boolean=false;

    //32x18
    public _width       :number = 32;
    public _height      :number = 18;

    //abc.pngは1文字100x60のスプライトシート(A~Zが縦に並んでいる)
    private static readonly CHAR_W:number = 100;
    private static readonly CHAR_H:number = 60;

    private _sheet!:p5.Image;
    private _letterGraphics!:p5.Graphics;

    constructor(){
        //super();
        super();
    }

    init(callback:()=>void){


        this._callback=callback;

        new p5((p: p5)=>{

            p.preload = ()=>{
                this._sheet = p.loadImage("./data/abc.png");
            }

            /** 初期化処理 */
            p.setup = ()=>{
                let letter = Params.alphabet;
                if(letter=="") letter = "T";
                console.log("letter = ",letter);

                this.loadFont(letter,()=>{
                    this.setUp(letter);
                })
            }
            /** フレームごとの描画処理 */
            p.draw = ()=> {
                this.draw();
            }

            this._p5 = p;
        });

    }


    setUp(letter:string){

        let r = this._p5.createCanvas(
            this._width,
            this._height
        );
        r.id('p5canvasSrc');
        r.elt.style.display=Params.debug ? "block" : "none";
        r.elt.style.position="absolute";
        r.elt.style.top="0px";
        r.elt.style.left="0px";
        r.elt.style.zIndex="9999999";

        this._p5.frameRate(30);
        this._p5.noSmooth();
        this._p5.pixelDensity(1);

        this.setLetter(letter);

        this.isInit=true;

        //this._bg = 0;
        this._callback();
    }

    //スプライトシートから1文字を切り出し、黒インクを白に塗り替えて保持する
    //(getPixel()での明るさ判定は「白=文字の形」を前提にしているため)
    private setLetter(letter:string){

        let code = letter.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
        if(code < 0 || code > 25) code = "T".charCodeAt(0) - "A".charCodeAt(0);

        const cw = TenPrintP5src.CHAR_W;
        const ch = TenPrintP5src.CHAR_H;

        const g = this._p5.createGraphics(cw, ch);
        g.clear();
        g.image(this._sheet, 0, 0, cw, ch, 0, code * ch, cw, ch);

        //透明部分はそのままに、インク(不透明)部分だけを白へ塗り替える
        const ctx = g.drawingContext as CanvasRenderingContext2D;
        ctx.globalCompositeOperation = "source-in";
        g.noStroke();
        g.fill(255);
        g.rect(0, 0, cw, ch);
        ctx.globalCompositeOperation = "source-over";

        this._letterGraphics = g;

    }

    reset(){

    }

    draw(){

        if(!this.isInit)return;

        this._p5.background(0,0,255);

        if(this._letterGraphics){
            this._p5.image(this._letterGraphics, 0, 0, this._width, this._height);
        }
    }

}