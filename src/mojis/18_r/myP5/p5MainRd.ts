import p5 from "p5";
import { ParamsRd } from '../data/ParamsRd';
import { p5Circle } from "./p5Circle";
import { CanvasTexture } from "three";
import { p5Base } from "../../00_base/p5Base";
import { TitleView } from "../../../html/TitleView";
import { Params } from "../../../data/Params";


export class p5MainRd extends p5Base{

    public _canvasTex:THREE.CanvasTexture;
    public canvasElement:HTMLCanvasElement;
    public isInit:boolean=false;

    public _width       :number = 512;
    public _height      :number = 512;
    public static Instance     :p5MainRd;

    private debug:boolean=false;
    private debugIndex:number=3;
    private debugBg:number=8;

    private _ox:number=0;
    private _oy:number=0;

    constructor(){
        //super();
        super();
    }

    init(callback:()=>void){

        p5MainRd.Instance = this;
        //this._circle = [];
        this._ox = Math.random()*100-50;
        this._oy = Math.random()*10-5;
        //for(let i=0;i<6;i++){
        //    this._circle.push(new p5Circle());
        //}

        this._callback=callback;

        new p5((p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                this.loadFont("R",()=>{
                    this.setUp();                
                })
            }
            /** フレームごとの描画処理 */
            p.draw = ()=> {
                this.draw();
            }

            this._p5 = p;
        });
        
    }


    setUp(){


        //console.log("setup2")

        let r = this._p5.createCanvas(
            512,
            512
        );
        r.id('p5canvas');
        
        if(Params.debug){
            r.elt.style.zIndex="999999";
            r.elt.style.position="absolute";
            r.elt.style.transform="scale(0.2,0.2)"
            //r.elt.style.display="none";
        }else{
            r.elt.style.display="none";

        }

        this._p5.pixelDensity(1);
        this._p5.frameRate(3);
        this._p5.noSmooth();
        
        //console.log(r.elt);
        this.canvasElement = r.elt;//scopeがよくわからない
        this.isInit=true;
    
        p5MainRd.Instance = this;
        
        //this._bg = 0;
        this._callback();

        if(Params.debug){
        ParamsRd.gui.add(this,"reset").name("RESET_p5")
        ParamsRd.gui.add(this,"debug");//.name("RESET_p5")
        ParamsRd.gui.add(this,"debugIndex",0,15).step(1);
        ParamsRd.gui.add(this,"debugBg",0,15).step(1);

        }

        this.draw();
    }

    reset(){
        
    }

    draw(){

        if(!this.isInit)return;

        this._p5.blendMode(this._p5.BLEND);
        this._p5.background(
                this.debugBg/ParamsRd.rdParams.length*255,
                0,
                0,
                255
        );
       

        this._p5.fill(
            this.debugIndex/ParamsRd.rdParams.length*255,
            255,
            0,
            255          
        );
        this._p5.noStroke();

            
        let scale = 3;
        this.drawFont(this._width,this._height,scale,this._ox,this._oy,0);

        if(this._path.getStrokes().length >= 2){
            this._p5.fill(
                    this.debugBg/ParamsRd.rdParams.length*255,
                    0,
                    0,
                    255
            );
            this.drawFont(this._width,this._height,scale,this._ox,this._oy,1);
        }

        
        TitleView.show();
        TitleView.setCenter(this._ox,this._oy);

     

    }

    getRandomPos():{x:number,y:number}{

        let count =0;
        while(true){

            if(count++>200)break;

            let x = Math.floor(Math.random()*this._p5.width);
            let y = Math.floor(Math.random()*this._p5.height);
            let c = this.getPixel(x,y);
            //console.log(c);

            if(c.g <128){
                return {
                    x:x/this._p5.width,
                    y:y/this._p5.height
                }
            }

        }
        return {x:0,y:0};

    }


    getCanvasTex():THREE.CanvasTexture{

        if( !this.isInit ) return null;

        if(this._canvasTex==null){
            this._canvasTex= new CanvasTexture(this.canvasElement)
            //this._canvasTex.minFilter=NearestFilter;
            //this._canvasTex.magFilter=THREE.NearestFilter;
        }
        this._canvasTex.needsUpdate=true;
        //this.uniforms.tex2.value = this._canvasTex;
        
        return this._canvasTex;
    }    

}