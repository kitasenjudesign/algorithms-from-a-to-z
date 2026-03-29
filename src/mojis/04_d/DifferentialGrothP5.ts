import p5 from "p5";
//import { Params } from "./data/Params";
import { DotsMain } from "./dots/DotsMain";
import { FontManager } from "../../font/FontManager";
import { PathWrapper } from "../../font/PathWrapper";
import { Params } from "../../data/Params";
import { TitleView } from "../../html/TitleView";
import { Stage } from "../../data/Stage";

export class DifferentialGrothP5{


    public _width       :number = 512;
    public _height      :number = 512;
    public  _p5         :p5;
    private _main       :DotsMain;
    private _nodeIndex:number = 0;
    private _fontManager:FontManager;   
    private _path:PathWrapper;
    private _isInitialized:boolean = false;
    private _offsetX:number = 0;
    private _offsetY:number = 0;

    public static bgColor:string = "#000000";
    public static fillColor:string = "#ffffff";
    public static strokeColor:string = "#888";

    //private _lines     :DiffLines;

    constructor(){

    }

    init(callback:()=>void){

        new p5((p: p5)=>{

            
            
            p.preload = ()=>{

                
            }

            /** 初期化処理 */
            p.setup = ()=>{

                if(Params.color){
                    DifferentialGrothP5.bgColor = "#fdfcdeff";
                    DifferentialGrothP5.fillColor = "#18188dff";
                    DifferentialGrothP5.strokeColor = "#ffffff";
                }

                this._p5=p;
                this._fontManager = new FontManager();
                this._fontManager.init("D",(path)=>{
                    this._path = path;
                    this._width=Stage.width;
                    this._height=Stage.height;
                    this.setUp();      
                    this._isInitialized = true;
                    if(callback)callback();                    
                });

                       
            }
            /** フレームごとの描画処理 */
            p.draw = ()=> {
                this.draw();
            }

            p.mouseMoved = ()=>{
                //this.mouseMoved();
            }
            
            p.mouseDragged = ()=>{
                //if(!Params.mouseMode)return;
                console.log("drag ",p.mouseX, p.mouseY);
                if(p.mouseX<p.width && p.mouseY<p.height){
                    this._main.addNode(p.mouseX, p.mouseY, true, this._nodeIndex);
                }
            }
            p.mousePressed = ()=>{
                //if(!Params.mouseMode)return;
                console.log("press ",p.mouseX, p.mouseY);
                this._nodeIndex++;         
                if(p.mouseX<p.width && p.mouseY<p.height){       
                this._main.addNode(p.mouseX, p.mouseY,false, this._nodeIndex);
                }                
            }
            
            /*
            p.keyPressed = ()=>{

                if (p.key === 's') {
                    
                    this.downloadSVG();
                }
                if (p.key === 'c') {
                    //this.copyToClipboard(); // クリップボードにコピー
                }
                if (p.key === 'r') {
                    this.removeNode();
                }
            }*/

            
        });

        
        console.log("Params gui setup",Params.gui);
        
        //Params.gui.add(this,"copyToClipboard").name("SVGをコピー");
        //Params.gui.add(this,"downloadSVG").name("SVGを保存");
        Params.gui.add(this,"reset");
        Params.gui.add(this,"removeNode").name("ノードを削除!!");
        Params.gui.add(this,"setRandomNode").name("setRandomNode");
        
        
    }

    setUp(){
        

        //@ts-ignore
        console.log(" ----mode:", window.SVG);      
        let r = this._p5.createCanvas(
            Stage.width,
            Stage.height,
            //@ts-ignore
            //window.SVG
            //this._p5.WEBGL // WEBGLモードでキャンバスを作
        );
        this._width = r.width;
        this._height = r.height;
        //r.id('p5canvas');

        this._p5.pixelDensity(1); // ピクセル密度を1に設定
        this._p5.frameRate(30); // フレームレートを30に設定
        this._p5.background(0);

        this._main = new DotsMain();
        this._main.init(this._p5);

        let s = this._path.getStrokes();
        let scl = 8;
        let rect = this._path.getRect();//
       
        let data:number[][][] = [];

        scl += 4*Math.random();
        let ox = 300*(Math.random()-0.5);
        let oy = 300*(Math.random()-0.5);

        TitleView.setCenter(ox,oy);

        for(let i=0;i<s.length;i++){

            data[i] = [];
            for(let j=0;j<100;j++){
                let p = s[i].pointAt(j/100);
                let xx = (p.x-rect.x - rect.width/2)*scl;
                let yy = (p.y-rect.y - rect.height/2)*scl;
                xx+=this._width/2 + ox;
                yy+=this._height/2 + oy;
                data[i].push([xx,yy]);
            }
            //this._p5.circle(xx,yy,2);

        }
        this.addPoints(data);




    }

    addPoints(data:number[][][]){

        console.log("addPoints data:", data.length);

        for(let i=0; i<data.length; i++){
            const path = data[i];
            console.log("path:", path);
            for(let j=0; j<path.length; j++){
                const point = path[j];
                //console.log("point:", point);
                //console.log(this._p5);
                let isLast = (j == path.length - 1);
                this._main.addNode(
                    point[0],
                    point[1],
                    !isLast,
                    i
                );

            }
        }
        this._nodeIndex=data.length;

    }

    removeNode(){

        for(let i=0;i<this._main.nodes.length;i++){
            this._main.removeNode();
        }

    }

    setRandomNode(){
        //for(let i=0;i<this._main.nodes.length/2;i++){
            this._main.setRandom();
        //}
    }

    reset(){
        this._main.reset();
    }

    downloadSVG(){
        
       // p5Main._p5.save("output.svg"); // SVGファイルを保存

    }

    

    

    draw(){
        if(!this._isInitialized)return;


        this._p5.background(DifferentialGrothP5.bgColor);
        this._p5.fill(DifferentialGrothP5.fillColor);



        
        if(this._main)this._main.update();
        //this._p5a.blendMode(this._p5a.DIFFERENCE);
        //this._path.draw(this._p5a, this._width, this._height,8);


    }   
    

}
