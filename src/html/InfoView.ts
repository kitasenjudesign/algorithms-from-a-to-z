import { Main } from "../main/Main";
import { TextDataLoader } from "./TextDataLoader";
import { TitleView } from "./TitleView";
import { TableView } from "./TableView";
import { Stage } from "../data/Stage";
import { InfoData } from "../data/InfoData";
import { InfoTitleView } from "./InfoTitleView";
import { Params } from "../data/Params";

export class InfoView{

    public static showing:boolean = false;

    dom:HTMLDivElement;
    btn:HTMLDivElement;
    explanationClose!:HTMLDivElement;
    explanation!:HTMLDivElement;
    atozIndex!:HTMLDivElement;
    title!:HTMLDivElement;
    table:TableView;
    loader:TextDataLoader = new TextDataLoader();
    infoTitleView:InfoTitleView = new InfoTitleView();
    data: InfoData;
    title2:HTMLDivElement;

    constructor(){

    }

    init(data:InfoData){
        this.data = data;

        this.dom = document.getElementById("infomation") as HTMLDivElement;
        this.btn = document.getElementById("infoBtn") as HTMLDivElement;
        this.explanationClose = document.getElementById("explanationClose") as HTMLDivElement;
        this.explanation = document.getElementById("explanation") as HTMLDivElement;
        this.atozIndex = document.getElementById("atozIndex") as HTMLDivElement;
        this.title = document.getElementById("title") as HTMLDivElement;
        this.title2 = document.getElementById("infoTitle") as HTMLDivElement; 

       
        //atozTableはtype=0のときloadExplanation()で説明の下に移動して表示する
        const atozTable = document.getElementById("atozTable") as HTMLTableElement;
        atozTable.style.display = "none";

        this.btn.addEventListener("mousedown", ()=>{

            if(this.dom.style.display != "block"){
                this.show();
            }else{
                this.hide();
            }

        });

        this.explanationClose.addEventListener("mousedown", ()=>{
            this.hide();
        });

        this.table = new TableView();
        this.table.init();

        this.initAtozIndex();
        this.infoTitleView.init(this.data);
        

        //リロード時、#infoがついていたらinfoを表示
        if(window.location.hash == "#info"){
            this.show();
        }else{
            this.hide();
        }

        this.loadExplanation();

    }

    show(){
        console.log("show info");
        InfoView.showing = true;
        this.btn.classList.add("open");
        this.dom.style.display = "block";
        this.title.style.display = "none";//タイトル消す
        this.infoTitleView.play();
        history.replaceState(null, "", window.location.pathname + window.location.search + "#info");
    }

    hide(){

        InfoView.showing = false;
        this.dom.style.display = "none";
        this.btn.classList.remove("open");
        this.title.style.display = "block";
        
        history.replaceState(null, "", window.location.pathname + window.location.search);
    }



    initAtozIndex(){

        const params = new URLSearchParams(window.location.search);
        const current = (params.get("type") ?? "0").toUpperCase();

        this.atozIndex.innerHTML = "";

        for(const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ"){

            const a = document.createElement("a");
            a.textContent = letter;

            if(letter == current){
                a.classList.add("selected");
            }else{
                //infoが表示された状態で遷移するので#infoをつける
                a.href = "./?type=" + letter + "#info";
            }

            this.atozIndex.appendChild(a);
            this.atozIndex.appendChild(document.createTextNode(" "));

        }

    }

    async loadExplanation(){

        const textDatas = await this.loader.load();

        const prefix = "_" + Main.type.toUpperCase();
        const data = textDatas.find((d)=> d.title.indexOf(prefix) == 0);
        if(data == null) return;

        this.explanation.innerHTML = "";
        for(let i=0;i<data.lines.length;i++){

            let line = data.lines[i];
            
            const div = document.createElement("div");
            div.textContent = line;
            if(line.indexOf("・") == 0){
                div.style.textAlign = "center";
            }
            this.explanation.appendChild(div);

        }


        //type=0のときは説明の下にtableを移動(explanationごと縦スクロールできる)
        if(Main.type == "0"){
            const atozTable = document.getElementById("atozTable") as HTMLTableElement;
            this.explanation.appendChild(atozTable);
            atozTable.style.display = "table";
        }

    }



}
