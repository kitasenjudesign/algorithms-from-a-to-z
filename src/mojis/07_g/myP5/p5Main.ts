import * as THREE from 'three';
import p5 from "p5";

import { ParamsG } from '../data/ParamsG';
import { Params } from '../../../data/Params';


export class p5Main {

    public _canvasTex:THREE.CanvasTexture;
    public canvasElement:HTMLCanvasElement;
    public isInit:boolean=false;

    public _width:number = 512;
    public _height:number = 512;
    private _p5:p5;
    private _dom:HTMLElement;
    private _counter:number=0;

    constructor(){
    }

    init(callback:()=>void){

        new p5((p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                this.setUp();
                callback();
            }
            /** フレームごとの描画処理 */
            p.draw = ()=> {
                this.draw();
            }            
            this._p5 = p;
        });
        
    }


    setUp(){

        let r = this._p5.createCanvas(512, 512);
        r.id('p5canvas');
        this._p5.frameRate(30);
        this._p5.noSmooth();
        
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
        this._dom.style.display="block";
        if(!Params.debug){
            this._dom.style.display="none";
        }

        document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            if(keyName=="d"){
                if(this._dom){
                    if(this._dom.style.display=="none"){
                        this._dom.style.display="block";
                    }else{
                        this._dom.style.display="none";
                    }    
                }
            }
        });

        this._p5.background(0,0,0,255);
                
    }


    

    draw(){

    }

    update(){
        
        if(!this.isInit)return;

        //this._p5.noStroke();
        
        //if(!this.flag){
            let rr = 255*Math.random();
            let gg = 255*Math.random();
            let bb = 255*Math.random();
    
            rr = 2/ParamsG.numRules*255; 
            gg = 12/ParamsG.numRules*255; 
            bb = 14/ParamsG.numRules*255; 
            //10,12,13,14,17いい

            //this._p5.blendMode(this._p5.LIGHTEST);
            this._p5.noStroke();
            this._p5.fill(rr,gg,bb);

               let hh = this._counter*8; 
               //this._p5.rect(512*Math.random(),512*Math.random(),50,50);    
                
                let num=10;
               for(let i=0;i<=num;i++){
                   this._p5.rect(i*512/num,0,512/num,(this._p5.frameCount*(1+(num-i)*1))%512);
               }


            this._counter++;

    }

    

    getCanvasTex():THREE.CanvasTexture{

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

