import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { LSystemP5 } from "./LSystemP5";

export class LSystemMain extends WorkBase{


    constructor(){
        super(InfoData.L);
    }

    init(){

        let lSystem = new LSystemP5();
        lSystem.start(()=>{

        });

    }
    

}