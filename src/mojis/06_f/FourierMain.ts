import { InfoData } from "../../data/InfoData";
import { Stage } from "../../data/Stage";
import { WorkBase } from "../00_base/WorkBase";
import { FourierP5 } from "./FourierP5";

export class FourierMain extends WorkBase {

    constructor() {
        super(InfoData.F);
        this.showTitle();
    }

    init(){
        let f=new FourierP5();
        f.init(Stage.width,Stage.height, () => {
            console.log("FourierP5 initialized");
            
        });
    }

}