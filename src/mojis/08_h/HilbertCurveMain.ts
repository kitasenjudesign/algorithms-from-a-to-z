import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { HilbertCurveP5 } from "./HilbertCurveP5";

export class HilbertCurveMain extends WorkBase {

    constructor(){
        super(InfoData.H);
    }

    init(){
        
        let h = new HilbertCurveP5();
        h.init(()=>{
            // Initialization complete
        });
    }

}