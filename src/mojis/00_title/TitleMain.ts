import { InfoData } from "../../data/InfoData";
import { Stage } from "../../data/Stage";
import { TextAnim } from "../00_base/TextAnim";
import { WorkBase } from "../00_base/WorkBase";


export class TitleMain extends WorkBase{

    //private asciiP5: AsciiMainP5;
  
    constructor(){

        super(InfoData.TITLE);

        setTimeout(() => {
            //console.log("speak:",data.alphabet+":"+data.title);
            let utterance = new SpeechSynthesisUtterance("Algorithms from A to Z by Kitasenju Design");  
            utterance.lang = "en-US"
            //utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);            
        }, 500);

        this.init();

        document.getElementById("about").style.display = "flex";
        document.getElementById("about").style.width = Stage.width + "px";

        let animA1 = new TextAnim("a1");
        let animA2 = new TextAnim("a2");
        let animA3 = new TextAnim("a3");

        let animB1 = new TextAnim("b1");
        let animB2 = new TextAnim("b2");
        let animB3 = new TextAnim("b3");


        let ww = document.getElementById("a1").getBoundingClientRect().width;

        console.log("W"+ww+","+Stage.width/2);

        let space = (Stage.width-ww*2)/3;

        document.getElementById("centerCon1").style.marginLeft = (space)+"px";
        document.getElementById("centerCon2").style.marginLeft = (space/2)+"px";

        animA1.play(document.getElementById("a1").innerHTML);
        animA2.play(document.getElementById("a2").innerHTML,0.3);
        animA3.play(document.getElementById("a3").innerHTML,0.6);
        
        animB1.play(document.getElementById("b1").innerHTML);
        animB2.play(document.getElementById("b2").innerHTML,0.3);
        animB3.play(document.getElementById("b3").innerHTML,0.6);        

    }

}