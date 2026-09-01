import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { BoidsP5 } from "./BoidsP5";


export class BoidsMain extends WorkBase{
    
    constructor(){
        
        super(InfoData.B);
        this.showTitle();
        
    }

    init(){

        let boids = new BoidsP5();            
        boids.start(()=>{   
           
        });

    }

}