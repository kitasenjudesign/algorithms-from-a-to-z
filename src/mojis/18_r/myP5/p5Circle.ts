import p5 from "p5";
import { ParamsRd } from '../data/ParamsRd';


export class p5Circle{

    public radius:number = 0;
    public x:number = 256;
    public y:number = 256;

    public rr:number = 0;
    public gg:number = 0;
    public bb:number = 0;

    public index:number = 0;
    static ruleIdx:number = 0;

    constructor(){


        this.index = Math.floor(ParamsRd.rdParams.length*Math.random());

        //let ruleList=[3,6,7];
        let ruleList=[3,6,8];

        p5Circle.ruleIdx++;
        this.index=ruleList[p5Circle.ruleIdx%ruleList.length];

        //6,3いい
        /*
        if(Math.random()<0.5){
            this.index = 6;
        }else{
            this.index = 3;
        }*/



        //0
        //1
        //2 飽和系
        //3 面白い、いい感じのつぶつぶ、うごきあり
        //4 敷き詰められる、うごかない
        //5 荒い
        //6 細かい、繰り返し、うごく
        //7 荒い
        //8 すくなめ、他との組み合わせ？
        //9　塗り
        //10
        //11
        //12
        //13
        //14



        this.rr = 255/ParamsRd.rdParams.length*this.index;
        
        
        this.gg = 50;//255*Math.random();
        this.bb = 50;//255*Math.random();

        this.radius = 800*Math.random();

    }

    update(p5:p5,isDebug:boolean=false,idx:number=0){

        

        if(isDebug){
            p5.fill(
                idx/ParamsRd.rdParams.length*255,
                this.gg,
                this.bb,
                255          
            );
        }else{
            p5.fill(
                this.rr,
                this.gg,
                this.bb,
                255          
            );
        }


        //p5.noFill();
        //p5.strokeWeight(10);
        /*
        p5.stroke(
            this.rr,
            this.gg,
            this.bb,
            255
        );*/

        /*
        p5.circle(
            this.x,
            this.y,
            this.radius
        )*/

        p5.textSize(this.radius);
        p5.textAlign(p5.CENTER,p5.CENTER);

        p5.text("R",this.x,this.y);

        /*
        p5.fill(255,255,255,255);
        p5.textSize(32);
        p5.text(
            this.index,
            256+this.radius/2,
            256
        )*/

        /*
        if(Math.random()<0.1){
            this.rr = 255*Math.random();
            this.gg = 255*Math.random();
            this.bb = 255*Math.random();            
        }*/

        this.radius+=2;
        if(this.radius>800){
            this.radius=0;
            //this.rr = 255*Math.random();
            //this.gg = 255*Math.random();
            //this.bb = 255*Math.random();            
        }

    }


}