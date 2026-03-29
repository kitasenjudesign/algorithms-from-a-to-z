import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { JarvisMarchP5 } from "./JarvisMarchP5";

export class JarvisMarchMain extends WorkBase{

    private _jarvisMarch: JarvisMarchP5;

    constructor(){
        
        //gift wrapping 
        super(InfoData.J);

    }

    init(){
        
        //console.log("j")

        this._jarvisMarch = new JarvisMarchP5();
        this._jarvisMarch.init(()=>{

        });

    }

}