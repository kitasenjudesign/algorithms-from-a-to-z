import { GUI } from 'lil-gui'
import { MyGUI } from './MyGUI';
import { Stage } from './Stage';

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

    public static isStation:boolean=false;//えきモード
    public static isMobile:boolean=false;
    public static color:boolean = false;

    public static init(){

        if(this._initialized) return;
        this._initialized = true;

        console.log(window.location.hostname);
        if( window.location.hostname == 'kitasenjudesign.com' ){
            this.isStation=false;
        }else{
            
        }

        let win = window as any;
        this.isStation = win.isStation;
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        const params = new URLSearchParams(window.location.search);
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

        Stage.showNoEntryArea();



        MyGUI.Init();
        this.gui = MyGUI.gui;

    }

    public static getMaxPoints(): number {
        
        return 10000;
        
    }




}