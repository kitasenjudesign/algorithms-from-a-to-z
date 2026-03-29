import * as THREE from 'three';
import p5 from "p5";
import { p5Base } from '../00_base/p5Base';
import { TitleView } from '../../html/TitleView';
import { Params } from '../../data/Params';
import { Stage } from '../../data/Stage';

export class NMainP5 extends p5Base{

    public _canvasTex:THREE.CanvasTexture;
    public canvasElement:HTMLCanvasElement;
    public isInit:boolean=false;

    //public _width:number = 512;
    //public _height:number = 512;
    private _dom:HTMLElement;
    private _counter:number=0;

    public _ox:number=0;
    public _oy:number=0;

    private _blurAmount:number = 0;

    public static instance:NMainP5;


    constructor(){
        super();
        NMainP5.instance = this;
    }

    init(callback:()=>void){

        new p5((p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                
                this.loadFont("Navier",()=>{
                    this.setUp();
                    callback();
                });

        
            }

            /** フレームごとの描画処理 */
            p.draw = ()=> {
                this.draw();
            }            
            this._p5 = p;
        });
        
    }


    setUp(){

        this.isInit=true;
        let r = this._p5.createCanvas(512, 512*Stage.height/Stage.width);
        r.id('p5canvas');
        this._p5.frameRate(30);

        this._oy=(Math.random()-0.5)*this._p5.height*0.3;

        console.log(r.elt);
        this.canvasElement = r.elt;//scopeがよくわからない
        this.isInit=true;
    
        this._dom = r.elt;

        this._dom.style.position="absolute";
        this._dom.style.top = "0";
        this._dom.style.left = "0";
        this._dom.style.zIndex = "9999"
        this._dom.style.transformOrigin="0 0"
        this._dom.style.transform="scale(0.2,0.2)"
        this._dom.style.display=Params.debug ? "block" : "none";

        this._p5.background(0,0,0,255);
                
    }


    

    draw(){
        if(!this.isInit)return;

        this._p5.blendMode(this._p5.BLEND);
        this._p5.background(0,0,0);

        //this._p5.fill(150+105*(0.5+0.5*Math.sin(this._p5.frameCount*0.1)));
        //this._p5.noFill();
        //this._p5.stroke(150+105*(0.5+0.5*Math.sin(this._p5.frameCount*0.1)));

        this._p5.blendMode(this._p5.DIFFERENCE);
        this._p5.fill(255);
        let rect = this._path.getRect();


        //this._logoX+=this._logoVx;
        //this._logoY+=this._logoVy;
        let s = 0.8;
        //if(this._logoX < -this._p5.width/2*s || this._logoX > this._p5.width/2*s) this._logoVx *= -1;
        //if(this._logoY < -this._p5.height/2*s || this._logoY > this._p5.height/2*s) this._logoVy *= -1;

        this._ox = this._p5.width/2;

        TitleView.setCenter(this._ox,this._oy);

        this.drawFont(this._p5.width,this._p5.height,2,this._ox,this._oy);


        this._p5.blendMode(this._p5.BLEND);
        this._p5.fill(0,0,0,64+64*Math.sin(this._p5.frameCount*0.05));
        this._p5.rect(0,0,this._p5.width,this._p5.height);

    }

    /**
     * Set blur amount in pixels (0 to disable). Will be applied each frame after drawing.
     */
    public setBlur(amount:number){
        this._blurAmount = Math.max(0, amount);
    }
    

    public getRatio():{x:number,y:number}{

        if( !this.isInit ) return {x:0,y:0};

        return {
            x:this._p5.width/this._p5.height,
            y:1
        };
    }

    getCanvasTex():THREE.CanvasTexture | null{

        if( !this.isInit ) return null;

        if(this._canvasTex==null){
            this._canvasTex= new THREE.CanvasTexture(this.canvasElement)
            this._canvasTex.minFilter=THREE.NearestFilter;
            this._canvasTex.magFilter=THREE.NearestFilter;
        }
        this._canvasTex.needsUpdate=true;
        //this.uniforms.tex2.value = this._canvasTex;
        
        return this._canvasTex;
    }

}


 