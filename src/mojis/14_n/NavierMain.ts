import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { MainN } from "./MainN";

export class NavierMain extends WorkBase{

    constructor(){

        super(InfoData.N);

    }

    init(){
        
        let n = new MainN();
        n.init();

    }

}