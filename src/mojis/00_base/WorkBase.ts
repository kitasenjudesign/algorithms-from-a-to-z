import { InfoData } from "../../data/InfoData";
import { TitleView } from "../../html/TitleView";
import { TextAnim } from "./TextAnim";

export class WorkBase{


    private _data:InfoData;

    constructor(data:InfoData){

        this._data = data;
        TitleView.init(this._data);
        
    }

    init(){

    }

}