import { Params } from "../data/Params";
import { TextData } from "./TextData";

export class TextDataLoader{

    public textDatas:TextData[] = [];

    async load(url:string = "./atozalgorithm.json"){

        const res = await fetch(url);
        const json = await res.json();

        this.textDatas = [];

        for(const page of json.pages){

            if(page.title.charAt(0) == "_"){
                const textData = new TextData();
                
                let lines:string[] = []; 
                if(Params.language == "en"){
                    
                    for(let i=1;i<page.lines.length;i++){
                        //console.log(page.lines[i].indexOf('[EN]'),page.lines[i]);
                        if(page.lines[i].indexOf('[EN]')>=0) lines.push(page.lines[i].split('[EN]')[1]);
                    }
                }else{
                    
                    for(let i=1;i<page.lines.length;i++){
                        if(page.lines[i].indexOf('[EN]')<0) lines.push(page.lines[i]);
                    }
                }

                //console.log(lines);
                textData.title = page.title;
                textData.lines = lines;

                this.textDatas.push(textData);
            }

        }

        return this.textDatas;

    }

}
