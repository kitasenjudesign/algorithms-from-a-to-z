
import p5, { Graphics, Shader } from "p5";
import opentype, { Font, Path } from 'opentype.js';
import { PathWrapper } from "./PathWrapper";

export class FontManager{

    font:Font | null = null;
    
    constructor(){
        
        //console.log("constructor");

    }

    init(text:string, callback:(line:PathWrapper)=>void){

        opentype.load("./data/FreeSans.otf", (err, f) => {
            if (err) {
                console.log(err);
            } else {

                console.log("onload",f);

                this.font = f;

                console.log("moji = ",text);
                const linePath= this.font.getPath(text, 0, 0, 100);

                let wrapper = new PathWrapper(linePath);
                
                //console.log(linePath);
                //console.log("bbb");
                callback(wrapper);

            }
        });

    }

  


    /*

    */


}