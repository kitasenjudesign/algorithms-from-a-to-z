import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { MainCA1d } from "./main/MainCA1d";

export class CAMain extends WorkBase {

    constructor(){

       //this.init();
       super(InfoData.C);
       this.showTitle();
    }
    
    init(){

        const main = new MainCA1d();
        main.init();

    }

}