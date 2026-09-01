import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { XORMainP5 } from "./XORMainP5";

export class XORMain extends WorkBase{

    private _xorMainP5: XORMainP5;

    constructor(){

        super(InfoData.X);
        this.showTitle();
    }

    init(){
        this._xorMainP5 = new XORMainP5();
        this._xorMainP5.start(()=>{
            
        });
    }

}