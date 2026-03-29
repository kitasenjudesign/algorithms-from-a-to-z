
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { PathWrapper } from "../../font/PathWrapper";

export class TextAnim{

    id:string = "";
    public dom:HTMLDivElement;
    

    constructor(idName:string,){

        this.id = idName;
        this.dom = document.getElementById(this.id) as HTMLDivElement;
        console.log(this.dom);
        this.dom.style.gridColumn= "span "+Math.floor(Math.random()*4+1);
        //this.divElement.style.gridRowStart = ""+Math.floor(Math.random()*5+1);  
    }

    setText(text:string){

        if (!this.dom) return;
        this.dom.innerHTML = text;

    }

    play(title:string,delay:number=0,callback:()=>void=null){

        if (!this.dom) return;


        const text = title;
        this.dom.innerHTML = title;
        this.dom.style.opacity = "0";

        
        if(delay==0){
            this.animation(text,callback);
        }else{
            setTimeout(()=>{
                this.animation(text,callback);
            },delay*1000);
        }
    }

    private animation(text:string,callback:()=>void=null){
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {

                if(i==0){
                    this.dom.innerHTML="";
                }
                this.dom.innerHTML = text.substring(0,i+1);
                this.dom.style.opacity = "1";
                i++;
                
            } else {
                if(callback!=null){
                    callback();
                }
                clearInterval(interval);
            }
        }, 40);

    }

}
