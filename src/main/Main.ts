
import { Mouse } from "../data/Mouse";
import { Params } from "../data/Params";
import { ArrowView } from "../html/ArrowView";
import { AlphabetInputView } from "../html/AlphabetInputView";
import { InfoView } from "../html/InfoView";
import { TitleMain } from "../mojis/00_title/TitleMain";
import { AsciiMain } from "../mojis/01_a/AsciiMain";
import { BoidsMain } from "../mojis/02_b/BoidsMain";
import { CAMain } from "../mojis/03_c/CAMain";
import { DifferentialGrowth } from "../mojis/04_d/DifferentialGroth";
import { ErrorDiffusionMain } from "../mojis/05_e/ErrorDiffusionMain";
import { FourierMain } from "../mojis/06_f/FourierMain";
import { GameOfLifeMain } from "../mojis/07_g/GameOfLifeMain";
import { HilbertCurveMain } from "../mojis/08_h/HilbertCurveMain";
import { IKMain } from "../mojis/09_i/IKMain";
import { JarvisMarchMain } from "../mojis/10_j/JarvisMarchMain";
import { KDTreeMain } from "../mojis/11_k/KDTreeMain";
import { LSystemMain } from "../mojis/12_l/LSystemMain";
import { MazeMain } from "../mojis/13_m/MazeMain";
import { NavierMain } from "../mojis/14_n/NavierMain";
import { OpenTypeMain } from "../mojis/15_o/OpenTypeMain";
import { PerlinNoiseMain } from "../mojis/16_p/PerlinNoiseMain";
import { QuadTreeMain } from "../mojis/17_q/QuadTreeMain";
import { ReactionDiffusionMain } from "../mojis/18_r/ReactionDiffusionMain";
import { SpiroMain } from "../mojis/19_s/SpiroMain";
import { TenPrintMain } from "../mojis/20_t/TenPrintMain";
import { UnsharpMaskMain } from "../mojis/21_u/UnsharpMaskMain";
import { VerletMain } from "../mojis/22_v/VerletMain";
import { WaveMain } from "../mojis/23_w/WaveMain";
import { XORMain } from "../mojis/24_x/XORMain";
import { YUVMain } from "../mojis/25_y/YUVMain";
import { ZFightingMain } from "../mojis/26_z/ZFightingMain";


export class Main{

    public static type:string="";
    public static TEXTS:string="0abcdefghijklmnopqrstuvwxyz";
    private info:InfoView;
    
    constructor(){

    }

    public static nextPage(){
        console.log("next page");
        const params = new URLSearchParams(window.location.search);
        const a =   params.get("auto");
        const lang = params.get("lang");
        let str = Main.TEXTS;
        let idx = str.indexOf(Main.type);
        let nextIdx = (idx + 1) % str.length;

        let query = "?type=" + str[nextIdx];
        if(lang){
            query += "&lang=" + lang;
        }
        window.location.search = query;
    }
    public static prevPage(){
        console.log("prev page");
        const params = new URLSearchParams(window.location.search);
        const lang = params.get("lang");
        let str = Main.TEXTS;
        let idx = str.indexOf(Main.type);
        let prevIdx = (idx - 1 + str.length) % str.length;

        let query = "?type=" + str[prevIdx];
        if(lang){
            query += "&lang=" + lang;
        }
        window.location.search = query;
    }

    public init(){

        Params.init();
        Mouse.init();

        const params = new URLSearchParams(window.location.search);
        let t =     params.get("type");
        const a =   params.get("auto");

        console.log("type:", t, "auto:", a);
        //音声はtitleview

        if(t===null){
            //return;
            Main.type="0";
            t="0";

            console.log("default page: 0");

        }
        
        
            t=t.toLowerCase();

            //autoがあったとき
            if(a=="1"){

                console.log("auto mode: next page after 10 seconds");
                let str = Main.TEXTS;
                let idx = str.indexOf(t);
                let nextIdx = (idx + 1) % str.length;
                setTimeout(() => {
                    window.location.search = "?type=" + str[nextIdx] + "&auto=1";
                }, 10000);

            }else{
                console.log("manual mode");
            }

            Main.type = t;

        

            if(t=="0"){
                document.title="Algorithms from A to Z";
            }else{
                document.title=t.toUpperCase() + " - Algorithms from A to Z"
            }
            
        const alphabetInput = new AlphabetInputView();


        switch(t){
            case "0":
                let title = new TitleMain();
                title.init();
                break;
            case "a":
                let a = new AsciiMain();
                a.init();
                break;
            case "b":
                let b = new BoidsMain();
                b.init();            
                break;
            case "c":
                let c = new CAMain();
                c.init();
                break;
            case "d":
                let d = new DifferentialGrowth();
                d.init();
                break;
            case "e":
                let e = new ErrorDiffusionMain();
                e.init();
                break;
            case "f":
                let f = new FourierMain();
                f.init();
                break;
            case "g":
                let g = new GameOfLifeMain();
                g.init();
                break;
            case "h":
                let h = new HilbertCurveMain();
                h.init();
                break;
            case "i":
                let i = new IKMain();
                i.init();

                break;
            case "j":
                let j = new JarvisMarchMain();
                j.init();
                break;
            case "k":
                let k = new KDTreeMain();
                k.init();
                break;
            case "l":
                let l=new LSystemMain();
                l.init();
                break;
            case "m":
                let m = new MazeMain();
                m.init();
                
                break;
            case "n":
                let n = new NavierMain();
                n.init();
                break;
            case "o":
                let o = new OpenTypeMain();
                o.init();
                break;
            case "p":
                let p = new PerlinNoiseMain();
                p.init();
                break;
            case "q":
                let q = new QuadTreeMain();
                q.init();
                break;
            case "r":
                let r = new ReactionDiffusionMain();
                r.init();
                break;
            case "s":
                let s = new SpiroMain();
                s.init();
                break;
            case "t":
                let t = new TenPrintMain();
                t.init();
                break;
            case "u":
                let u = new UnsharpMaskMain();
                u.init();
                break;
            case "v":
                let v = new VerletMain();
                v.init();
                break;
            case "w":
                let w = new WaveMain();
                w.init();
                break;
            case "x":
                let xx = new XORMain();
                xx.init();
                break;
            case "y":
                let yy=new YUVMain();
                yy.init();
                break;
            case "z":
                let z = new ZFightingMain();
                z.init();
                break;
        }

        this.info = new InfoView();
        this.info.init(Params.currentData);

        const arrow = new ArrowView();
        arrow.init();

        alphabetInput.init(Params.currentData);

        
        this.addKeyEventListener();
    }


    private addKeyEventListener(){
        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                // Handle escape key press
            }

            console.log("key down:", event.key);
            if(event.key===" "){
                window.location.search = "?type=0&auto=1";
                return;
            }

            const target = event.target as HTMLElement;
            const isTextInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");

            if(!isTextInput && event.key === "ArrowRight"){
                Main.nextPage();
                return;
            }
            if(!isTextInput && event.key === "ArrowLeft"){
                Main.prevPage();
                return;
            }
            //if(event.key==="Enter"){
            //    window.location.search = "?type=0&auto=1";
            //    return;
            //}

            //console.log(event.key);

            let t = event.key;
            if (!/^[a-z0]$/.test(t)) return;

        
            //    window.location.search = "?type=" + t;
            //    return;
            

        });

    }

}