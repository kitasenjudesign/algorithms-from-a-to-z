import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { YUVp5 } from "./YUVp5";

export class YUVMain extends WorkBase{


    constructor(){

        super(InfoData.Y);

    }

    init(){
        //YUV
        let yuvp5=new YUVp5();
        yuvp5.start(()=>{
            console.log("YUVp5 started");
        });
    }

}