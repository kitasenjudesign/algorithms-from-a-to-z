//波動方程式

import p5 from "p5";
import { p5MainV } from "./p5MainV";
import { WorkBase } from "../00_base/WorkBase";
import { InfoData } from "../../data/InfoData";

export class VerletMain extends WorkBase{


    //p5:VerletMainP5;
    p5MainV:p5MainV;

    constructor(){
        
        super(InfoData.V);

        this.p5MainV = new p5MainV();
        this.p5MainV.init(()=>{

        });
        /*
        this.p5 = new VerletMainP5();
        this.p5.init("V",()=>{

        });*/

    }
    
    init(){       
        
    }

}