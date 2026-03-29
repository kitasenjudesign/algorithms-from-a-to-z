
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { Path } from "opentype.js";
import { PathWrapper } from "../../font/PathWrapper";

export class p5Base{

    protected _callback   :()=>void;
    protected _p5         :p5;
    protected _fontManager:FontManager;
    protected _path:PathWrapper;
    protected _isInitialized:boolean = false;

    constructor(){
        
    }

    loadFont(moji:string,callback:()=>void){
                
        this._fontManager = new FontManager();
        this._fontManager.init(moji,(path)=>{     
            this._path = path;
            callback();
        });

    }
                

    drawFont(ww:number,hh:number,scale:number,ox:number=0,oy:number=0,tgtStroke:number=-1){

        this._path.draw(this._p5, ww, hh, scale, ox, oy,tgtStroke);

    }
           
    /**
     * 注意！ pixelDensityを１に設定すること
     * 注意！ pixelDensityを１に設定すること
     * 注意！ pixelDensityを１に設定すること
     */
    getPixel(i:number,j:number): {r:number,g:number,b:number,a:number}{

        i = Math.floor(i);
        j = Math.floor(j);

        let img = this._p5.drawingContext.getImageData(i,j,1,1);
        let data = img.data;
        return {
            r: data[0],
            g: data[1],
            b: data[2],
            a: data[3]
        };

    }






    /*
    copyToClipboard() {

        const svgEl = document.querySelector('svg');
        const svgString = svgEl.outerHTML;
    
        // クリップボードにコピー（text/plainとして）
        navigator.clipboard.writeText(svgString).then(() => {
          console.log("✅ SVG copied to clipboard");
          alert("SVGがクリップボードにコピーされました！Illustratorにペーストできます。");
        }).catch(err => {
          console.error("❌ Clipboard error:", err);
        });

    }*/

            
}

