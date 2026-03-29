import p5 from "p5";
import { KDTree } from "./kdtree/KDTree";
import { KDTreeData } from "./kdtree/KDTreeData";
//import { Animations } from "./anim/Animations";

import { AnimKD } from "./anim/AnimKD";
import { TitleView } from "../../html/TitleView";
import { Stage } from "../../data/Stage";

export class p5MainKD{


    public _width       :number = 512;
    public _height      :number = 512;
    private _p5         :p5;
    private _callback   :()=>void;


    private _kdTree: KDTree;
    //private _animations:Animations;
    private _anim:AnimKD
    private _kdText: p5.Image;

    constructor(){
      


    }

    init(callback:()=>void){

        this._callback=callback;

        new p5((p: p5)=>{

            p.preload = ()=>{
                this._kdText=p.loadImage("./data/kd.png");
            }

            /** 初期化処理 */
            p.setup = ()=>{
                this.setUp();                
            }
            /** フレームごとの描画処理 */
            p.draw = ()=> {
                this.draw();
            }

            p.mouseMoved = ()=>{
                //this.mouseMoved();
            }
            p.mouseDragged = ()=>{
              // this.mouseMoved();
              //this.mouseMoved();
            }

            p.mouseClicked = ()=>{
                //this.click();
                //this.mouseMoved();
            }
            p.keyPressed = ()=>{
            }

            this._p5 = p;
        });
        
    }


    setUp(){
        //Params.init();

        TitleView.setPosition(Stage.width/2, Stage.height/16);

        this._kdTree=new KDTree();

        let r = this._p5.createCanvas(
            KDTree.WIDTH,
            KDTree.HEIGHT,
            //this._p5.WEBGL // WEBGLモードでキャンバスを作
        );
        this._width = r.width;
        this._height = r.height;
        r.id('p5canvas');

        this._p5.pixelDensity(1); // ピクセル密度を1に設定
        this._p5.noSmooth();
        this._p5.frameRate(30); // フレームレートを30に設定

        /*
        Params.gui.add(this,"tweenRectsFromTop");
        Params.gui.add(this,"setRandomBottom");
        Params.gui.add(this,"addImpuse2");
        Params.gui.add(this,"breakRects");
        */
       
        this._anim = new AnimKD(this._p5);     
        this._anim.start(this._kdText);
        this._anim.update(this._kdText);
    }

  

    draw(){

        this._anim.update(this._kdText);

    }
        

    drawTest(){
        
    }


}
