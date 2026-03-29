import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { ErrorDiffusionP5 } from "./ErrorDiffusionP5";

export class ErrorDiffusionMain extends WorkBase{

    private _edP5: ErrorDiffusionP5;

    constructor(){
        super(InfoData.E)
    }

    init(){
        
        this._edP5 = new ErrorDiffusionP5();
        this._edP5.start(()=>{

        });

    }


}
