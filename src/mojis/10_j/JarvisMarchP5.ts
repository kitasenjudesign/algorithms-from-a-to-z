
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { PathWrapper } from "../../font/PathWrapper";
import { GiftWrapping } from "./GiftWrapping";
import { JavisPoint } from "./JarvisPoint";
import { JavisPointControl } from "./JarvisPointControl";
import { TitleView } from "../../html/TitleView";
import { Stage } from "../../data/Stage";
import { Params } from "../../data/Params";

export class JarvisMarchP5{

    private _callback   :()=>void;
    private _p5         :p5;
    private _fontManager:FontManager;
    private _path:PathWrapper;
    private _width:number = 0;
    private _height:number = 0;
    private _ratio:number = 0.0;
    private _isInit:boolean=false;
    private _points: JavisPoint[] = [];
    private _control: JavisPointControl;
    private _ox:number = 0;
    private _oy:number = 0;
    public _noiseAmp:number = 0;
    public _radius:number = 20;
    private _isFreeMode:boolean = false;
    private _blink:number = 0;

    constructor(){
        
        //this._waveSimulation = new WaveSimulation();

    }

    init(callback:()=>void){

        this._control = new JavisPointControl(this);
        this._callback=callback;
        this._width = Stage.width;
        this._height = Stage.height;
        this._ox=(Math.random()-0.5)*this._width*0.1;

        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                this._p5 = p;
                let letter = Params.alphabet;
                if(letter=="") letter = "J";
                console.log("letter = ",letter);
                this._fontManager = new FontManager();
                this._fontManager.init(letter,(path)=>{
                    this._path = path;
                    this._isInit = true;
                    this.setUp(this._p5);
                    this._callback();
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
        
        let num = 50;
        for(let i=0;i<num;i++){
            let point = new JavisPoint();
            point.ratio = i / num
            point.index = i;
            this._points.push(point);
        }
       

        this._p5.createCanvas(
            this._width,
            this._height
        );
        
        this._p5.pixelDensity(1);

        //r.id('p5canvas');
        //this._p5.frameRate(30);
        //this._p5.noSmooth();

        //this._p5.noLoop();
        this._p5.frameRate(30);

        for(let i=0;i<this._points.length;i++){
            this._points[i].ratio = i%2==0 ? 0.5 : 0;
        }
        this._control.setPoints(this._points);
        this._control.loopA();


        Params.gui.add(this,"_radius",0,300).name("radius");
        Params.gui.add(this,"_noiseAmp",0,300).name("noiseAmp");
        Params.gui.add(this,"applyImpulse");

    }

    onLoad(){
    }

    click(){

    }

    reset(){
        
    }

    setFreeMode(b:boolean){

        //this._isFreeMode = b;

    }

    public setBlink(b:number){
        this._blink = b;
    }

    draw(){

        if(!this._isInit)return;


        if(this._p5.frameCount%100==1) this._p5.background(255,255,255);

        this._p5.background(0);

        this._p5.fill(0);
        this._p5.stroke(0,0,0);

        let s = this._path.getStrokes();
        let scl = 10;//+1*Math.sin(this._p5.frameCount*0.03);
        let rect = this._path.getRect();//

        let list:{x:number,y:number}[] = [];
        
        this._p5.stroke(255);
        this._p5.strokeWeight(2);

        //TitleView.setCenter(this._ox, this._oy);
        TitleView.setCenter(this._ox, this._oy);

        for(let i=0;i<s.length;i++){

            let num =this._points.length;


             

            for(let j=0;j<num;j++){

                
                /*
                this._points[j].offsetX += this._points[j].vx;
                this._points[j].offsetY += this._points[j].vy;
                */

                let ratio = this._points[j].ratio+this._p5.frameCount*0.002;
                
                let p = s[i].pointAt(ratio%1);//比率から位置を割り出す


                if(!this._isFreeMode){

                    //this._points[j].x += (p.x - this._points[j].x)/4;
                    //this._points[j].y += (p.y - this._points[j].y)/4;
                    this._points[j].x = p.x;
                    this._points[j].y = p.y;
                    this._points[j].updateV();


                }else{
                    
                    //freeMode
                    this._points[j].x += this._points[j].vx;
                    this._points[j].y += this._points[j].vy;

                    //画面をはみ出したら跳ね返る
                    //(外へ向かうときだけ反転するので、すでにはみ出ていても内側へ戻ってくる)
                    let sx = (this._points[j].x - rect.x - rect.width/2)*scl + this._width/2 + this._ox;
                    let sy = (this._points[j].y - rect.y - rect.height/2)*scl + this._height/2 + this._oy;
                    let r = this._radius;

                    if(sx - r < 0 && this._points[j].vx < 0){
                        this._points[j].vx *= -1;
                    }
                    if(sx + r > this._width && this._points[j].vx > 0){
                        this._points[j].vx *= -1;
                    }
                    if(sy - r < 0 && this._points[j].vy < 0){
                        this._points[j].vy *= -1;
                    }
                    if(sy + r > this._height && this._points[j].vy > 0){
                        this._points[j].vy *= -1;
                    }

                }
            
                let tgtX = this._points[j].x;
                let tgtY = this._points[j].y;



                let xx = (tgtX-rect.x - rect.width/2)*scl;
                let yy = (tgtY-rect.y - rect.height/2)*scl;
                xx+=this._width/2+this._ox;
                yy+=this._height/2+this._oy;

                //xx += this._points[j].offsetX;
                //yy += this._points[j].offsetY;

                //xx += (this._p5.noise(p.x,999+this._p5.frameCount*0.2+j/10)-0.5)*this._noiseAmp;
                //yy += (this._p5.noise(p.y,100+this._p5.frameCount*0.2+j/10)-0.5)*this._noiseAmp;

                //this._points[j].update();
                //xx += this._points[j].offsetX;
                //yy += this._points[j].offsetY;

                let radius= this._radius;
                this._p5.circle(xx,yy,radius*2);

                let numPoints=10;
                for(let k=0;k<numPoints;k++){

                    let rad = Math.PI*2 * (k/numPoints);
                    let xxx = xx + radius*Math.cos(rad);
                    let yyy = yy + radius*Math.sin(rad);
                    //this._p5.circle(xxx,yyy,2);
                    list.push({x:xxx,y:yyy});

                }

            }

        }

        let wrapped = GiftWrapping.getWrappedPoints(list);


        for(let i=0;i<wrapped.length;i++){

            this._p5.line(
                wrapped[i].x, 
                wrapped[i].y, 
                wrapped[(i+1)%wrapped.length].x, 
                wrapped[(i+1)%wrapped.length].y
            );

        }

        this._p5.stroke(255,255,255,this._p5.frameCount%2==0?this._blink:this._blink*0.5);
        this._blink -= 10;
        if(this._blink<0) this._blink=0;
        this._p5.noFill();
        this._path.draw(this._p5, this._width, this._height, scl, this._ox, this._oy);



    }

    getPixel(i:number,j:number): {r:number,g:number,b:number,a:number}{

        let img = this._p5.drawingContext.getImageData(i,j,1,1);
        let data = img.data;
        return {
            r: data[0],
            g: data[1],
            b: data[2],
            a: data[3]
        };

    }

    resize(){

       
        
    }
    
}

