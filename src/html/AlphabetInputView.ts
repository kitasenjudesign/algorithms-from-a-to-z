import { InfoData } from "../data/InfoData";
import { Params } from "../data/Params";

export class AlphabetInputView{

    container!:HTMLDivElement;
    input!:HTMLInputElement;
    public static instance:AlphabetInputView;

    constructor(){
        AlphabetInputView.instance = this;
        this.container = document.getElementById("alphabetInput") as HTMLDivElement;
        this.input = document.getElementById("alphabetInputField") as HTMLInputElement;

    }

    init(data:InfoData){

        
        if(!data || data.maxLetters <= 0){
            this.container.style.display = "none";
            return;
        }
        this.container.style.display = "";
        this.input.maxLength = data.maxLetters;

        if(Params.alphabet){
            this.input.value = Params.alphabet;
        }else{
            this.input.value = data.defaultLetter;
        }

        this.input.addEventListener("input", () => {
            this.input.value = this.input.value.replace(/[^a-zA-Z0-9]/g, "");
        });

        this.input.addEventListener("keydown", (event) => {
            if(event.key === "Enter"){
                const params = new URLSearchParams(window.location.search);
                if(this.input.value){
                    params.set("t", this.input.value);
                }else{
                    params.delete("t");
                }
                window.location.search = params.toString();
            }
        });

    }

    setText(value:string){
        this.input.value = value.replace(/[^a-zA-Z0-9]/g, "");
    }

}
