import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { SpiroP5 } from "./SpiroP5";

export class SpiroMain extends WorkBase{

    private spiroP5: SpiroP5;

    constructor(){
        
        //https://kitasenjudesign.com/tool/06_spiro/

        super(InfoData.S);
        this.showTitle();


    }

    init(){
        
        this.spiroP5 = new SpiroP5();
        this.spiroP5.start(()=>{
            
        });
    }

}