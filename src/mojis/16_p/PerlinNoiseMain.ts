import { InfoData } from "../../data/InfoData";
import { Params } from "../../data/Params";
import { WorkBase } from "../00_base/WorkBase";
import { PerlinP5 } from "./PerlinP5";

export class PerlinNoiseMain extends WorkBase{
 
    constructor(){
        super(InfoData.P);
    }

    init(){

        let perlin = new PerlinP5();
        perlin.start(()=>{
           
        });
    }

}

