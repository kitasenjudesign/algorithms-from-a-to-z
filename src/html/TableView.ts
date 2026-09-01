export class TableView{

    dom!:HTMLTableElement;

    constructor(){

    }

    init(){

        /*
        this.dom = document.getElementById("atozTable") as HTMLTableElement;

        const params = new URLSearchParams(window.location.search);
        const current = (params.get("type") ?? "0").toUpperCase();

        const rows = this.dom.querySelectorAll("tbody tr");
        rows.forEach((row)=>{

            const tr = row as HTMLTableRowElement;
            const letter = tr.cells[0].textContent?.trim();
            if(!letter) return;

            if(letter == current){
                tr.classList.add("selected");
                return;
            }

            tr.style.cursor = "pointer";
            tr.addEventListener("mousedown", ()=>{
                window.location.href = "./?type=" + letter;
            });

        });*/

    }

}
