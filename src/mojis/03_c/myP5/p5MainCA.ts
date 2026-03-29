import * as THREE from 'three';
import p5 from "p5";
//import { Drawers } from './drawer/Drawers';

import { p5Base } from '../../00_base/p5Base';
import { Params } from '../../../data/Params';
import gsap from 'gsap';
import { caRect } from './caRect';
import { TitleView } from '../../../html/TitleView';
import { Stage } from '../../../data/Stage';


export class p5MainCA extends p5Base{


    public static RULES       :number[] = [0,18,22,30,41,45,54,62,73,86,90, 110, 124, 126,137, 193,231,184];
    public _width       :number = 512;
    public _height      :number = 512;
    //private _dom        :HTMLElement;
    //public _drawers    :Drawers;
    private _bgIndex         :number=12;
    private _fillIndex1       :number=0;
    private _fillIndex2       :number=5;
    private _fillIndex3       :number=5;

    public _canvasTex:THREE.CanvasTexture;
    public canvasElement:HTMLCanvasElement;
    private _index:number=0;

    private _rectA:caRect;
    private _rectB:caRect;
    private _rectC:caRect;

    constructor(){
        super();
    }

    init(callback:()=>void){

        this._callback=callback;

        new p5((p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{

                this.loadFont("C",()=>{

                    TitleView.setPosition(
                        Stage.width-100-TitleView.getSize().width,
                        100
                    );

                    this._isInitialized=true;
                    this.setUp();                
                    this._callback();
                    
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

        //console.log("setup2")

        let r = this._p5.createCanvas(
            512,
            512
        );
        r.id('p5canvas');
        this._p5.frameRate(30);
        this._p5.noSmooth();
        r.elt.style.display = Params.debug ? "block" : "none";
        r.elt.style.position="absolute";
        r.elt.style.zIndex="20001";
        r.elt.style.transform="scale(0.1,0.1)";
        
        //console.log(r.elt);
        this.canvasElement = r.elt;//scopeがよくわからない
        //this.canvasElement.style.display="none";
        this._isInitialized=true;
    
        //super.setDebug(r.elt);

        

        Params.gui.add(this,"_bgIndex",0,15).step(1).listen();
        Params.gui.add(this,"_fillIndex1",0,15).step(1).listen();
        Params.gui.add(this,"_fillIndex2",0,15).step(1).listen();
        Params.gui.add(this,"_fillIndex3",0,15).step(1).listen();

       

        this._rectA = new caRect(5,0,16,16);
        this._rectB = new caRect(12,0,5,5);
        //this._rectC = new caRect(5,0,16,16);
        
        this._rectC = new caRect(
            12,
            0,//p5MainCA.RULES.length-9,//6
            p5MainCA.RULES.length-9,
            p5MainCA.RULES.length-9);


        this.drawCA();
        this.loop1();

    }

    loop1(){

        //this._rectA.hide(1,6);
       // this._rectB.hide(2,4);
        //this._rectC.hide(2,0);

    }

    reset(){
    }

    draw(){

        //if( this._p5.frameCount%300 == 1 )
        this.drawCA();

    }

    drawCA(){

        //console.log("drawCA");

        this._p5.noStroke();
        this._p5.background(0,0,0);

        let xx = Math.random()*255;
        let yy = Math.random()*255;
        /*
        
        this._p5.fill(
            p5MainCA.RULES[this._bgIndex],
            0,0
        );
        this._p5.rect(0,0,this._p5.width,this._p5.height);
        */
        //this._rectA.draw(this._p5,this);
        //this._rectB.draw(this._p5,this);
        if(this._rectC){
            this._rectC.draw(this._p5,this);
        }

  


       

    }

    getCanvasTex():THREE.CanvasTexture{
    
            if( !this._isInitialized ) return null;
    
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

