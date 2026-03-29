
import { InfoData } from "../../data/InfoData";
import { Stage } from "../../data/Stage";
import { TitleView } from "../../html/TitleView";
import { WorkBase } from "../00_base/WorkBase";
import { AsciiThree } from "./AsciiThree";

export class AsciiMain extends WorkBase{

    //private asciiP5: AsciiMainP5;
    private asciiThree:AsciiThree;

    constructor(){
        
        super(InfoData.A);
        this.init();
    }

    init(){

        this.asciiThree = new AsciiThree();
        this.asciiThree.init();

        this.loop();

        TitleView.setPosition(200,200);
        this.resize();
        window.addEventListener("resize", () => this.resize());

    }

    loop(){

        let e = document.getElementById("ascii");

        if(e){
            let img = this.asciiThree.captureImageData();
            // convert to ascii (5 tones)
            const ascii = this.imageDataToAscii(
                img,
                this.asciiThree.WIDTH,
                this.asciiThree.HEIGHT
            );
            // ensure monospace / preserve whitespace
            e.style.whiteSpace = "pre";
            e.style.fontFamily = "monospace, monospace";
            e.style.fontSize = (Stage.width/1920*33)+"px";
            e.textContent = ascii;
        }

        setTimeout(() => {
            this.loop();
        }, 1000 / 20);  
        
    }

    /**
     * Convert ImageData -> ASCII string using `levels` tones.
     * cols: target character columns (approx). height is computed with aspect correction.
     */
    private imageDataToAscii(img: ImageData, cols = 80, levels = 5): string {
        const w = img.width;
        const h = img.height;
        if (w === 0 || h === 0) return "";

        // character set for non-edge (light -> dark)
        const charset = [" ", ".", ":", "-", " "]; // length should be == levels
        const chars = charset.length >= levels ? charset : (new Array(levels).fill(0).map((_,i)=> charset[Math.floor(i/levels*charset.length)]));

        // build grayscale image
        const data = img.data;
        const gray = new Float32Array(w * h);
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const idx = (y * w + x) * 4;
                const r = data[idx], g = data[idx + 1], b = data[idx + 2];
                gray[y * w + x] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            }
        }

        // Sobel operator to get gradient magnitude + direction
        const gx = new Float32Array(w * h);
        const gy = new Float32Array(w * h);
        const mag = new Float32Array(w * h);
        let maxMag = 0;

        const get = (x: number, y: number) => {
            if (x < 0) x = 0;
            if (x >= w) x = w - 1;
            if (y < 0) y = 0;
            if (y >= h) y = h - 1;
            return gray[y * w + x];
        };

        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                // Sobel kernels
                const a00 = get(x - 1, y - 1), a10 = get(x, y - 1), a20 = get(x + 1, y - 1);
                const a01 = get(x - 1, y),     a11 = get(x, y),     a21 = get(x + 1, y);
                const a02 = get(x - 1, y + 1), a12 = get(x, y + 1), a22 = get(x + 1, y + 1);

                const gxv = -a00 - 2 * a01 - a02 + a20 + 2 * a21 + a22;
                const gyv = -a00 - 2 * a10 - a20 + a02 + 2 * a12 + a22;

                const i = y * w + x;
                gx[i] = gxv;
                gy[i] = gyv;
                const m = Math.hypot(gxv, gyv);
                mag[i] = m;
                if (m > maxMag) maxMag = m;
            }
        }

        // ascii generation grid
        const cellW = Math.max(1, Math.floor(w / cols));
        const aspectCorrection = 2; // tweak as needed
        const cellH = Math.max(1, Math.floor(cellW * aspectCorrection));
        const rows = Math.floor(h / cellH);

        let out = "";

        // directional chars for edges (8-way)
        //const dirChars = ['-','/','|','\\','-','/','|','\\'];

        const dirChars = ['|','/','-','\\','|','/','-','\\'];


        // threshold for edge detection (relative to maxMag)
        const edgeThreshold = Math.max(1e-6, maxMag * 0.12);

        for (let r = 0; r < rows; r++) {
            let rowStr = "";
            const yStart = r * cellH;
            for (let c = 0; c < cols; c++) {
                const xStart = c * cellW;

                // average luminance for the cell (fallback rendering)
                let sum = 0;
                let count = 0;
                for (let yy = 0; yy < cellH; yy++) {
                    const y = yStart + yy;
                    if (y >= h) continue;
                    for (let xx = 0; xx < cellW; xx++) {
                        const x = xStart + xx;
                        if (x >= w) continue;
                        sum += gray[y * w + x];
                        count++;
                    }
                }
                const avgLum = count > 0 ? (sum / count) : 0;
                const norm = avgLum / 255;

                // sample gradient at the cell center
                const cx = Math.min(w - 1, Math.floor(xStart + cellW / 2));
                const cy = Math.min(h - 1, Math.floor(yStart + cellH / 2));
                const ci = cy * w + cx;
                const m = mag[ci] ?? 0;

                if (m > edgeThreshold) {
                    // choose direction char based on angle
                    const angle = Math.atan2(gy[ci] || 0, gx[ci] || 0) * 180 / Math.PI; // -180..180
                    let a = angle;
                    if (a < 0) a += 360;
                    // create 8 sectors (45deg each), offset to center sectors
                    const sector = Math.floor((a + 22.5) / 45) % 8;
                    rowStr += dirChars[sector];
                } else {
                    // non-edge: map brightness to chars
                    const idxChar = Math.min(levels - 1, Math.max(0, Math.floor((1 - norm) * levels)));
                    rowStr += chars[idxChar] ?? chars[chars.length - 1];
                }
            }
            out += rowStr + "\n";
        }

        return out;
    }


    private resize(){

        let box = document.getElementById("ascii");
        const vw = Stage.width;
        const vh = Stage.height;

        const bw = box.offsetWidth;
        const bh = box.offsetHeight;

        const left = (vw - bw) / 2;
        const top  = (vh - bh) / 2;

        box.style.position = "absolute";
        box.style.left = left + "px";
        box.style.top  = top  + "px";

    }




    

}