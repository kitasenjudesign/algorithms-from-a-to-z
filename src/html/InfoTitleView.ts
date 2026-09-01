import { InfoData } from "../data/InfoData";
import { TextAnim } from "../mojis/00_base/TextAnim";

export class InfoTitleView{

    private _data!:InfoData;
    private _anim1!:TextAnim;
    private _anim2!:TextAnim;
    private _anim3!:TextAnim;

    constructor(){

    }

    init(data:InfoData){

        this._data = data;
        if(this._data == null) return;

        this._anim1 = new TextAnim("infoMainTitle");
        this._anim2 = new TextAnim("infoSubtitle");
        this._anim3 = new TextAnim("infoYear");

    }

    //TitleViewと同じアニメーション
    play(){

        if(this._data == null) return;

        
        
        let txt = this._data.date + ", " + this._data.author;

        if(this._data.date == "") txt = this._data.author;

        if(this._data.anotherTitle != ""){
            txt = this._data.anotherTitle + "<br/>" + txt;
        }

        if(this._data.alphabet == ""){
            this._anim1.setText("");
            this._anim2.play(this._data.title, 0.3);
            this._anim3.play(txt, 0.5);
        }else{
            this._anim1.play("Algorithms from A to Z", 0.1);
            this._anim2.play(this._data.title, 0.3);
            this._anim3.play(txt, 0.5);
        }

    }

}
