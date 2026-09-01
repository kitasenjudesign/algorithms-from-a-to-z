import p5, { Graphics, Shader } from "p5";
import { QuadTreeThree } from "./QuadTreeThree";
import { Params } from "../../data/Params";
import { Stage } from "../../data/Stage";
import gsap from "gsap";

export class QuadTreeSplitter{

    private _data   :ImageData;
    private _p5     :p5;
    private _minSize:number = 0;

    public _minDepth:number = 2;
    public _maxDepth:number = 4;
    public _hensaTh:number = 0.03;

    private bgColor:number=255;
    private strokeColor:string = "#ffffff";
    private drawColorTh:number = 0;

    public pastRects: { [key: string]: number } = {};


    constructor(){


        Params.gui.add(this,"_hensaTh",0,2).listen();
        Params.gui.add(this,"_maxDepth",0,10).step(1).listen();
        Params.gui.add(this,"drawColorTh",0,255).listen();
        Params.gui.add(this,"_minSize",0,100).step(1).listen();
        Params.gui.add(this,"bgColor",0,255).step(1).listen();
        //Params.gui.add(this,"_minSize",2,20).step(1);
    }


    animColor(tgtColor:number,duration:number,delay:number):void{
        gsap.to(this,{
            duration:duration,
            delay:delay,
            bgColor:tgtColor
        });
    }

    animParams(tgtDepth:number,duration:number,delay:number):void{
        gsap.to(this,{
            duration:duration,
            delay:delay,
            _maxDepth:tgtDepth,
            ease: "linear"
        });
    }

    split(p5:p5,data:ImageData):void{

        this._p5 = p5;
        this._p5.background(0,0,0,255);
        this._data=data;
        this.split1(0,0,this._data.width,this._data.height,0);

    }


    split1(x:number,y:number,ww:number,hh:number, depth:number){

        let hensa = this.getHensa(x,y,ww,hh,1);
       

        if(hensa<this._hensaTh || depth>=this._maxDepth){

            let rr = this.getMean(x,y,ww,hh,1);

            this._p5.noFill();
            if(rr>=this.drawColorTh){
                let ssX = Stage.width / QuadTreeThree.WIDTH;
                let ssY = Stage.height / QuadTreeThree.HEIGHT;
                
                if(ww>this._minSize){

                    if(rr==0) this._p5.stroke(this.bgColor);
                    else  this._p5.stroke(this.strokeColor);

                    this._p5.rect(
                        x*ssX,
                        y*ssY,
                        ww*ssX,
                        hh*ssY
                    );
                    
                    
                    if(this.pastRects[`${x}_${y}_${ww}_${hh}`]==null){
                        this.pastRects[`${x}_${y}_${ww}_${hh}`] = 120;
                    }else{
                        this.pastRects[`${x}_${y}_${ww}_${hh}`]-=10;
                    }


                    this._p5.fill(255,255,255,this.pastRects[`${x}_${y}_${ww}_${hh}`]);

                    
                    if(this.pastRects[`${x}_${y}_${ww}_${hh}`]<=0){
                        this.pastRects[`${x}_${y}_${ww}_${hh}`]=0;
                    };

                        


                    this._p5.ellipse(
                        x*ssX + ww*ssX/2,
                        y*ssY + hh*ssY/2,
                        ww*ssX,
                        hh*ssY
                    );

                }

            }

            return;

        }


        let rx = 0.5;
        let ry = 0.5;

        this.split1(x,y,ww/2,hh/2,depth+1);
        this.split1(x+ww/2,y,ww/2,hh/2,depth+1);
        this.split1(x,y+hh/2,ww/2,hh/2,depth+1);
        this.split1(x+ww/2,y+hh/2,ww/2,hh/2,depth+1);

    }




    public getHensa(
        xx:number,yy:number,ww:number,hh:number,per:number=1
    ):number{
        
        let m = this.getMean(xx,yy,ww,hh,per);//平均値
    
        let sum = 0;
        let nn = 0;
        for(let j=yy;j<yy+hh;j++){
            for(let i=xx;i<xx+ww;i++){
                if(Math.random()<=per){
                    sum += Math.abs( m-this.getPixel(xx,yy) )
                    //sum += this.getPixel(xx,yy);
                    nn++;    
                }
            }
        }

        return sum/nn;

    }

    //平均値を取得する
    public getMean(
        xx:number,yy:number,ww:number,hh:number,per:number
    ):number{
        let m = 0;
        let num = 0;
        for(let j=yy; j<yy+hh; j++){
            for(let i=xx; i<xx+ww; i++){
                if( Math.random()< per ){
                    m += this.getPixel(i,j);
                    num++;
                }
            }
        }
        return m/num;
    }


    public getPixel(x:number, y:number):number {

        let index:number = (x + y*this._data.width) * 4;
        let r:number = this._data.data[ index ];
        let g:number = this._data.data[ index + 1 ];
        let b:number = this._data.data[ index + 2 ];
        let a:number = this._data.data[ index + 3 ];

        return (r+g+b)/3;
    }


}
