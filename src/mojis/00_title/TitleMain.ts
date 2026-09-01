import { InfoData } from "../../data/InfoData";
import { Stage } from "../../data/Stage";
import { TitleView } from "../../html/TitleView";
import { TextAnim } from "../00_base/TextAnim";
import { WorkBase } from "../00_base/WorkBase";


export class TitleMain extends WorkBase{

    //private asciiP5: AsciiMainP5;
  
    constructor(){

        super(InfoData.TITLE);

        //this.createRandomTitleWords();
        this.showTitle();
        this._loop();

    }

    private _loop(){

        this._setPosition();
        setTimeout(()=>{
            this._loop();
        },3000);

    }

    private _setPosition(){


        TitleView.setBasePosition(
            Stage.width/2+Stage.width/4*(Math.random()-0.5),
            Stage.height/2+Stage.height/4*(-Math.random())
        );
        TitleView.setPosition();
        
        let xx = Stage.width/2  +Stage.width/4*(Math.random()-0.5);
        let yy = Stage.height/2 +Stage.height/4*(Math.random());

        document.getElementById("year").style.position = "fixed";
        document.getElementById("year").style.left = xx+"px";
        document.getElementById("year").style.top = yy+"px";

    }




    private createRandomTitleWords(){

        const texts = ["Algorithms", "from", "A to Z","by Kitasenju Design"];
        let idx=0;
        for(const text of texts){

            const div = document.createElement("div");
            div.className = "titleWord shadow";
            div.textContent = text;
            document.body.appendChild(div);
            //div.style.rotate = (Math.random()*60-30) + "deg";
            div.style.left = (200+idx*200) + "px";
            div.style.top  = (200+Math.random() * (Stage.height-400)) + "px";
            idx++;

        }

    }

}