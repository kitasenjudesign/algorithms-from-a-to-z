import gsap from "gsap";
import p5 from "p5";
import { p5MainCA } from "./p5MainCA";

export class caRect{

    public x:number=0;
    public y:number=0;
    public w:number=512;
    public h:number=512;

    public idxA:number = 0;
    public idxB:number = 0;
    public idxC:number = 0;
    public idxBG:number = 0;

    public flag:boolean=false;

    private _listBG:number[] = [
        150,18,186,5
    ];
    private _listLetter:number[] = [
        147
    ];
    private _bgIndex:number = 0;
    private _letterIndex:number = 0;

    constructor(idxBG:number, idxA:number, idxB:number, idxC:number){
        this.idxBG = idxBG;
        this.idxA = idxA;
        this.idxB = idxB;
        this.idxC = idxC;
    }

    public hide(duration:number=0.1,delay:number=0){

        this.h=0;
        gsap.to(this,{
            delay:delay,
            h:512,
            duration:duration,
            ease:"linear"
        });

        gsap.delayedCall(3,()=>{
            this.flag=true;
        });

    }

    public draw(p5:p5, parent:p5MainCA){


            if(p5.frameCount%180==0){
                this._bgIndex++;
                this._letterIndex++;
            }

            p5.fill(
                this._listBG[this._bgIndex%this._listBG.length],
                
                0,0
            );
            p5.rect(
                this.x,this.y,this.w,this.h
            );


            //文字を書く
            //if(p5.frameCount%50==30){
                p5.fill(
                    this._listLetter[this._letterIndex%this._listLetter.length],
                    //p5MainCA.RULES[1],//p5MainCA.RULES[this.idxA],
                    255,//p5MainCA.RULES[this.idxB],
                    
                    //p5MainCA.RULES[this.idxC],
                    0,
                    255
                );
            //}

            if(p5.frameCount>=50){
                parent.drawFont(p5.width,p5.height,2.5,0,-p5.height/6);
            }


    }

}