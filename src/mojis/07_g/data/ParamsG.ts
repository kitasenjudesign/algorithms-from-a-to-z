import { GUI } from 'lil-gui'
import { DirectionalLight } from 'three';
import { BitmapData } from '../myP5/BitmapData';

export class ParamsG {

    public static gui:GUI;
    public static width:number = 512;
    public static height:number = 512;
    public static wire:THREE.Mesh;
    public static dLight:DirectionalLight;

    public static colorId:number = 0;
    public static colorMax:number = 8;
    public static sizeId:number = 0;
    public static spaceId:number = 0;
    public static resolutionId:number;
    public static isPreviewed:boolean=false;

    public static duration:number=3;
    public static resolution:number = 128;
    public static depth:number=3;


    public static waru:number=2;
    public static interval:number = 10;//sec
    
    public static p5element:HTMLElement;

    public static numRules:number=0;
    public static isDebug:boolean=false;
    public static debugRule:number=0;

    //public static bitmapData:BitmapData;

    public static stageWidth:number = 1080;
    public static stageHeight:number = 1080;

    public static init(){

        this.gui = new GUI();
        this.gui.domElement.style.display="none";

            document.addEventListener('keydown', (event) => {
                const keyName = event.key;
                if(keyName=="d"){
                    if(this.gui){
                        if(this.gui.domElement.style.display=="none"){
                            this.gui.domElement.style.display="block";
                        }else{
                            this.gui.domElement.style.display="none";
                        }    
                    }
                }
            });


            
            

        //console.log(Params.resolutionId + " " + Params.resolution);

        /*
        let a =Params.gui.addFolder("features");
        a.add(Params,"colorId");
        a.add(Params,"sizeId");
        a.add(Params,"resolutionId");
        a.add(Params,"resolution");
        
        let b = Params.gui.addFolder("debug");
        b.add(Params,"isDebug");
        b.add(Params,"debugRule",0,40,1);
        b.add(Params,"numRules").listen();
        */
        
    }

    public static preview(){
        if(ParamsG.isPreviewed)return;

        let hoge = window as any;
        if(hoge.fxpreview!=null){
            ParamsG.isPreviewed=true;
            console.log("preview");
            return hoge.fxpreview();
        }
    }

    public static getDepth():number{
        return ParamsG.depth;
    }


}