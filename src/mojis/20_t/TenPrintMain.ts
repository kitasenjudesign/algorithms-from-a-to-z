//波動方程式

import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { TenPrintP5 } from "./TenPrintP5";

export class TenPrintMain extends WorkBase{

    private tenPrintP5: TenPrintP5;
    //private 

    constructor(){
        
        super(InfoData.T);
        this.showTitle();
    }
    
    init(){       
        
        this.tenPrintP5 = new TenPrintP5();
        this.tenPrintP5.start(()=>{

        });

    }

}