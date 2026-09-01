import p5 from "p5";
import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { p5MainKD } from "./p5MainKD";

export class KDTreeMain extends WorkBase{

    private _kd:p5MainKD;

    constructor(){
        
        super(InfoData.K);
        this.showTitle();
    }

    init(){

        
        this._kd = new p5MainKD();
        this._kd.init(()=>{
            
        });

    }

}