import { InfoData } from "../../data/InfoData";
import { Params } from "../../data/Params";
import { TitleView } from "../../html/TitleView";
import { TextAnim } from "./TextAnim";

export class WorkBase{


    private _data:InfoData;

    constructor(data:InfoData){

        this._data = data;
        Params.currentData = this._data;
        
    }

    showTitle(){

        console.log("showTitle");
        TitleView.init(this._data);
       
    }

    init(){

    }



}