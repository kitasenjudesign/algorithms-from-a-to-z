import { InfoData } from "../../data/InfoData";
import { WorkBase } from "../00_base/WorkBase";
import { MainGameOfLife } from "./MainGameOfLife";

export class GameOfLifeMain extends WorkBase{

    private _gameOfLife: MainGameOfLife;

    constructor(){

        super(InfoData.G);
        this.showTitle();
    }

    init(){

        this._gameOfLife = new MainGameOfLife();
        this._gameOfLife.init();
        

    }

}