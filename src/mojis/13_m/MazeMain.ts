import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { MazeP5 } from "./MazeP5";

export class MazeMain extends WorkBase{

    private _mazeP5: MazeP5;

    constructor(){
        super(InfoData.M);
    }

    init(){
        console.log("MazeMain init");
        this._mazeP5 = new MazeP5();
        this._mazeP5.init(()=>{
            console.log("MazeP5 initialized");
        });
    }

}