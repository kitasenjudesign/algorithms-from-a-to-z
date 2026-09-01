import { Main } from "../main/Main";

export class ArrowView{

    prevBtn!:HTMLDivElement;
    nextBtn!:HTMLDivElement;

    constructor(){

    }

    init(){

        this.prevBtn = document.getElementById("prevBtn") as HTMLDivElement;
        this.nextBtn = document.getElementById("nextBtn") as HTMLDivElement;

        this.prevBtn.addEventListener("mousedown", ()=>{
            Main.prevPage();
        });
        this.nextBtn.addEventListener("mousedown", ()=>{
            Main.nextPage();
        });

    }

}
