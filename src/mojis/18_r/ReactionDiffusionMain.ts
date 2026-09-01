import { InfoData } from "../../data/InfoData";
import { TitleView } from "../../html/TitleView";
import { WorkBase } from "../00_base/WorkBase";
import { MainRd } from "./main/MainRd";

export class ReactionDiffusionMain extends WorkBase{

    constructor(){
        super(InfoData.R);
        this.showTitle();
    }

    public init(): void {
        // Initialization logic here
        //TitleView.hide();
        let mainRd = new MainRd();
        mainRd.init();
    }

}