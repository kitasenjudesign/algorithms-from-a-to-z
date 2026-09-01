import { GUI } from 'lil-gui'
import { MyGUI } from './MyGUI';
import { Stage } from './Stage';
import { InfoData } from './InfoData';

export class Params{

    public static gui:GUI;
    public static debug:boolean=false;
    private static _initialized:boolean=false;

    public static debugText: boolean = false;
    public static mouseMode: boolean = true; // マウスモードの有効/無効
    public static speed: number = 0.01;
    public static randomness: number = 0.01;
    public static randomStrength: number = 1;
    public static maxSpeed: number = 1;
    public static maxForce: number = 1;
    public static mouseDistance: number = 100; // マウスとの距離
    public static svgScale: number = 1; // SVGのスケール
    public static mutation: number = 100; // ミューテーションの強さ

    public static mojiCenterX: number = 0;
    public static mojiCenterY: number = 0;

    public static isStation:boolean=true;//えきモード
    public static isMobile:boolean=false;
    public static color:boolean = false;

    public static currentData:InfoData;
    public static language:string = "en";
    public static alphabet:string = "";

    public static init(){

        if(this._initialized) return;
        this._initialized = true;

        console.log(">>>>> lang = ",navigator.language);
        const params = new URLSearchParams(window.location.search);

        //言語指定
        this.language = navigator.language.toLowerCase().indexOf("ja") == 0 ? "ja" : "en";
        let lang = params.get("lang");
        if(lang){
            this.language = lang=="ja"?"ja":"en";
        }


        console.log(window.location.hostname);
        if( window.location.hostname == 'kitasenjudesign.com' ){
            this.isStation=false;
        }else{
            
        }

        let win = window as any;
        this.isStation = win.isStation;
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        

        let dd = params.get("debug");

        if(dd && dd=="1"){
            this.debug = true;
        }
        if(dd && dd=="0"){
            this.debug = false;
        }

        let cc = params.get("col");
        if(cc && cc=="1"){
            this.color = true;
        }
        if(cc && cc=="0"){
            this.color = false;
        }

        let ss = params.get("station");
        if(ss && ss=="1"){
            this.isStation = true;
        }
        if(ss && ss=="0"){
            this.isStation = false;
        }

        let tt = params.get("t");
        if(tt){
            this.alphabet = String(tt);
        }else{

        }



        Stage.showNoEntryArea();

       
        if(this.isStation){
             this.initCursorHide();

        }

        MyGUI.Init();
        this.gui = MyGUI.gui;

    }

    private static initCursorHide(): void {
        let timer: ReturnType<typeof setTimeout> | null = null;

        const hide = () => {
            document.body.style.cursor = 'none';
        };
        const show = () => {
            document.body.style.cursor = '';
            if (timer !== null) clearTimeout(timer);
            timer = setTimeout(hide, 3000);
        };

        document.addEventListener('mousemove', show);
        setTimeout(hide, 3000);
    }

    public static getMaxPoints(): number {
        
        return 10000;
        
    }




}