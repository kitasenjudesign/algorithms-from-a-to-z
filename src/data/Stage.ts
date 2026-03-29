import { Params } from "./Params";

export class Stage {

    public static showNoEntryArea(): void {

        const area = document.getElementById("noEntryArea");
        if (area) {
            area.style.display = "block";

            area.style.position = "absolute";
            area.style.top = "0px";
            area.style.left = this.width+"px";

            area.style.width = (window.innerWidth-this.width)+"px";
            area.style.height = this.height+"px";
        }
        
    }

    public static get width(): number {
        if(Params.isStation){
            let win = window as any;
            let ww = win.noEntryAreaWidth == null ? 3456 : win.noEntryAreaWidth as any;

            //console.log("ww:",win.noEntryAreaWidth);
            return (window.innerHeight * (16/9)) * ww/3840;
            //return window.innerWidth*3456/3840;
        }
        return window.innerWidth;
    }

    public static get height(): number {
        return window.innerHeight;
    }

}