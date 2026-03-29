//波動方程式
import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { WaveMainP5 } from "./WaveMainP5";

export class WaveMain extends WorkBase{

    private waveP5: WaveMainP5;

    constructor(){
        
        super(InfoData.W);
        //console.log("W");
        this.init();

    }
    
    init(){

        this.waveP5 = new WaveMainP5();
        this.waveP5.start(()=>{

        });
        
    }

}