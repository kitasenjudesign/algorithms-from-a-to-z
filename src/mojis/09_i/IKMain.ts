import { InfoData } from "../../data/InfoData";
import { Params } from "../../data/Params";
import { WorkBase } from "../00_base/WorkBase";
import { IKMainP5 } from "./IKMainP5";

export class IKMain extends WorkBase {

    constructor() {
        super(InfoData.I);  
    }

    init(){
        let k = new IKMainP5();
        k.start(()=>{
//            console.log("IKMainP5 started");
        });
    }

}