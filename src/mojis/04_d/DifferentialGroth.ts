import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { DifferentialGrothP5 } from "./DifferentialGrothP5";

export class DifferentialGrowth extends WorkBase{


    private growthP5: DifferentialGrothP5;

    constructor(){
        super(InfoData.D);
        this.showTitle();
        //this.init();
    }

    init(){
        
        console.log("D");
        /*
            Differential Growth とは何か（超要約）
            点列（ポリライン）を、
            ・近すぎると反発
            ・遠すぎると分裂（点を追加）
            させながら進化させるアルゴリズム
        */

        this.growthP5 = new DifferentialGrothP5();
        this.growthP5.init(()=>{
            console.log("D2");
            
        });

    }

}