import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { OpenTypeP5 } from "./OpenTypeP5";

export class OpenTypeMain extends WorkBase{
 
    constructor(){

        super(InfoData.O);
        this.showTitle();
    }

    init(){

        let openTypeP5 = new OpenTypeP5();
        openTypeP5.init(()=>{

        });

    }

}

