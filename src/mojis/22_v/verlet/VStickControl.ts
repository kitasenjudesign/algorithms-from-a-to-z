import p5 from "p5";
import { p5MainV } from "../p5MainV";
import { VPoint } from "./VPoint";

export class VStickControl {

    //一本の線のこと

    list:VPoint[]=[];
    public start:VPoint;
    public end:VPoint;
    public ratioS:number=0;
    public ratioE:number=0;
    private v1:number = 0.001*Math.random();
    private v2:number = 0.001*Math.random();
    private spd:number=1;
    constructor(list:VPoint[], ratioS:number, ratioE:number){
        
        this.list = list;
        this.start = list[0];
        this.end = list[list.length-1];
        this.ratioS = ratioS;
        this.ratioE = ratioE;

    }

    init(){
        
    }

    public update(p5:p5){

        this.ratioS += this.v1*this.spd;
        this.ratioE += this.v2*this.spd;

        if(this.ratioS>1){
            this.ratioS = 0;
        }
        if(this.ratioE>1){
            this.ratioE = 0;
        }

        let p1 = p5MainV.instance.getPosition(this.ratioS);
        let p2 = p5MainV.instance.getPosition(this.ratioE);

        


        this.start._basePos.x=p1.x;
        this.start._basePos.y=p1.y;
        this.end._basePos.x = p2.x;
        this.end._basePos.y = p2.y;

    }

    public draw(p5:p5){

        p5.circle(this.start.position.x,this.start.position.y,2);
        p5.circle(this.end.position.x,this.end.position.y,2);

    }


}
