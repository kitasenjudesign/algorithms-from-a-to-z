import { InfoData } from "../data/InfoData";
import { Params } from "../data/Params";
import { Stage } from "../data/Stage";
import { TextAnim } from "../mojis/00_base/TextAnim";

export class TitleView{

    private static _anim1:TextAnim;
    private static _anim2:TextAnim;
    private static _anim3:TextAnim;
    private static _data:InfoData;
    private static _container:HTMLDivElement;
    
    private static _width:number = 0;
    private static _height:number = 0;

    constructor(){
       
    }

    public static init(data:InfoData){

        this._data = data;
        if(this._data.alphabet=="") return;

        let info = document.getElementById("info");
        this._container = info as HTMLDivElement;
        info.style.display = "block";

        //info.style.transformOrigin = "0 0";
        //info.style.scale = Params.isMobile ? "0.5" : "1";

        this._anim1 = new TextAnim("title");
        this._anim2 = new TextAnim("subtitle");
        this._anim3 = new TextAnim("year");

        this._anim1.setText("Algorithms from A to Z");
        this._anim2.setText(this._data.title);

        let txt = this._data.date +", "+data.author;
        if(data.anotherTitle!=""){
            txt = ""+this._data.anotherTitle +"<br/>"+txt;
        }
        this._anim3.setText(txt);

        this._width = this._container.clientWidth;
        this._height = this._container.clientHeight;

        if(this._data.alphabet==""){
            this._anim1.setText("");
            this._anim2.play(this._data.title,0.3);
            this._anim3.play(txt,0.5);

        }else{
            this._anim1.play("Algorithms from A to Z",0.1);
            this._anim2.play(this._data.title,0.3);
            this._anim3.play(txt,0.5);
        }

        if(!Params.debug){
            document.getElementById("center")!.style.display = "none";
            document.getElementById("center2")!.style.display = "none";
            document.getElementById("center3")!.style.display = "none";
        }

        setTimeout(() => {
            console.log("speak:",data.alphabet+":"+data.title);
            let utterance = new SpeechSynthesisUtterance(data.alphabet+":"+data.title);  
            utterance.lang = "en-US"
            //utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);            
        }, 500);


    }



    public static show(){
        document.getElementById("info")!.style.display = "block";
    }
    public static hide(){
        document.getElementById("info")!.style.display = "none";
    }

    public static getSize():{width:number,height:number} {

        return { width: this._width, height: this._height };

    }


    public static setPosition(x:number,y:number){

        this._container!.style.left = x + "px";
        this._container!.style.top  = y + "px";

    }




    /**
     * センターからの差分（オフセット）を指定！！
     * @param centerX 
     * @param centerY 
     */
    public static setCenter(centerX:number, centerY:number){

        
        centerX+=0.001;
        centerY+=0.001;

        let cx = Stage.width/2;
        let cy = Stage.height/2;

        let textX = cx + centerX;
        let textY = cy + centerY;

        document.getElementById("center")!.style.left   = textX + "px";
        document.getElementById("center")!.style.top    = textY + "px";

        document.getElementById("center3")!.style.left   = (cx) + "px";
        document.getElementById("center3")!.style.top    = (cy) + "px";



        //textは　何象限にあるか(Quadrant)
        let quadrant = 0;

        let dir = {x:cx-centerX*9999999,y:cy-centerY*9999999};
        

        let crossPoint = this.intersectRectFromInside(
            {x:0,y:0,w:Stage.width,h:Stage.height},
            {x:cx,y:cy},
            {x:dir.x,y:dir.y}
        )

        //console.log(quadrant,crossPoint);

        document.getElementById("center2")!.style.left   = (crossPoint.x-50) + "px";
        document.getElementById("center2")!.style.top    = (crossPoint.y-50) + "px";


        let ratio = 0.6;
        // use `ratio` to interpolate between text position and crossPoint
        // ratio = 0 => text position, ratio = 1 => crossPoint
        const t = Math.max(0, Math.min(1, ratio));
        let tgtX = (textX * (1 - t) + crossPoint.x * t) - this._width / 2;
        let tgtY = (textY * (1 - t) + crossPoint.y * t) - this._height / 2;


        
        let margin = 50;

        if(margin >tgtX) tgtX = margin;
        if(margin >tgtY) tgtY = margin;
        if(tgtX+this._width + margin>Stage.width) tgtX = Stage.width - this._width - margin;
        if(tgtY+this._height + margin>Stage.height) tgtY = Stage.height - this._height - margin;

        this._container!.style.left = tgtX + "px"
        this._container!.style.top  = tgtY + "px"
        


    }


    static intersectRectFromInside(
        rect:{x:number,y:number,w:number,h:number}, 
        p0:{x:number,y:number}, 
        p1:{x:number,y:number}) {
        const { x, y, w, h } = rect;

        const edges = [
            [{ x: x,     y: y     }, { x: x + w, y: y     }], // 上
            [{ x: x + w, y: y     }, { x: x + w, y: y + h }], // 右
            [{ x: x + w, y: y + h }, { x: x,     y: y + h }], // 下
            [{ x: x,     y: y + h }, { x: x,     y: y     }]  // 左
        ];

        let nearest = null;
        let minT = Infinity;

        for (const [e0, e1] of edges) {
            const hit = this.intersectSegment(p0, p1, e0, e1);
            if (!hit) continue;

            // p0→p1 のパラメータ t を計算
            const dx = p1.x - p0.x;
            const dy = p1.y - p0.y;
            const t = (Math.abs(dx) > Math.abs(dy))
            ? (hit.x - p0.x) / dx
            : (hit.y - p0.y) / dy;

            if (t > 0 && t < minT) {
            minT = t;
            nearest = hit;
            }
        }

        return nearest; // null or 1点
    }


    static intersectSegment(p0:{x:number,y:number}, p1:{x:number,y:number}, p2:{x:number,y:number}, p3:{x:number,y:number}) {
        const s1x = p1.x - p0.x;
        const s1y = p1.y - p0.y;
        const s2x = p3.x - p2.x;
        const s2y = p3.y - p2.y;

        const denom = (-s2x * s1y + s1x * s2y);
        if (denom === 0) return null; // 平行

        const s =
            (-s1y * (p0.x - p2.x) + s1x * (p0.y - p2.y)) / denom;
        const t =
            ( s2x * (p0.y - p2.y) - s2y * (p0.x - p2.x)) / denom;

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
            // 交点
            return {
            x: p0.x + (t * s1x),
            y: p0.y + (t * s1y)
            };
        }

        return null;
    }


    
}