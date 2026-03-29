import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { QuadTreeP5 } from "./QuadTreeP5";


export class QuadTreeMain extends WorkBase{

    private qtreeP5: QuadTreeP5;
    
    constructor(){

        super(InfoData.Q);

    }

    init(){

        this.qtreeP5 = new QuadTreeP5();
        this.qtreeP5.start(()=>{});

    }

}

