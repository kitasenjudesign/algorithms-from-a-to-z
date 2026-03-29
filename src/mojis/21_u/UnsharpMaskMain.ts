//波動方程式

import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { UnsharpMaskP5 } from "./UnsharpMaskP5";

export class UnsharpMaskMain extends WorkBase{


    constructor(){

        super(InfoData.U);
        
    }
    
    init(){       
        
        let unsharp = new UnsharpMaskP5();
        unsharp.start(()=>{

        });

    }

}