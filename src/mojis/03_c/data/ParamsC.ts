import { GUI } from 'lil-gui'
import { DirectionalLight } from 'three';
import { MyGUI } from './MyGUI';
import { Random } from './Random';

export class ParamsC {

    public static gui:GUI;
    //public static 
    public static canvasWidth:number = 512;
    public static canvasHeight:number = 512;
    
    public static width:number = 512;
    public static height:number = 512;
    public static wire:THREE.Mesh;
    public static dLight:DirectionalLight;

    public static colorId:number = 0;
    public static colorMax:number = 8;
    public static sizeId:number = 0;
    public static spaceId:number = 0;
    public static resolutionId:number = 0;
    public static divisionId:number = 0;
    public static isPreviewed:boolean=false;

    public static duration:number=3;
    public static resolution:number = 512;
    public static interval:number = 10;//sec
    
    public static p5element:HTMLElement;

    public static numRules:number=0;
    public static rules:number[];

    public static init(){

        MyGUI.Init();
        this.gui = MyGUI.gui;

        //解像度
        ParamsC.setResolution();
        ParamsC.setDivision();
        ParamsC.setRule();

             
    }

    //解像度を決める、今回は固定
    public static setResolution(){
        ParamsC.resolutionId = 0;
        ParamsC.resolution =256;//128;//256;//512;
    }

    //ルールを決める
    public static setRule(){
        let baseRules:number[] = [];
        for(let i=0;i<256;i++){
            baseRules[i]=i;
        }

        ParamsC.rules = [];
        let numRandom=16;


        let rr = Random.value;
        if(rr<0.333){
            numRandom=5;
        }else if(rr<0.666){
            numRandom=10;
        }else{
            numRandom=15;
        }

        if(ParamsC.divisionId==2){
            let rr = Random.value;
            if(rr<0.75){
                numRandom=3;
            }else{
                numRandom=15;
            }

        }

        for(let i=0;i<numRandom;i++){
            let rr = baseRules.splice(
                Math.floor(Random.value*baseRules.length),
                1
            );
            ParamsC.rules.push(rr[0]);
        }
    }

    public static setDivision(){

        let rr = Random.value;
        if(rr<0.5){
            ParamsC.divisionId=0;
        }else if(rr<0.8){
            ParamsC.divisionId=1;
        }else{
            ParamsC.divisionId=2;
        }

        
    }

    


   

    public static convertToBinary(x:number):number {

        let bin = 0;
        let rem, i = 1, step = 1;
        while (x != 0) {
            rem = x % 2;
            x = Math.floor(x / 2);
            bin = bin + rem * i;
            i = i * 10;
        }
        //console.log(`Binary: ${bin}`);
        return bin;
    }

    public static zeroPadding(NUM:number, LEN:number):string{
        
        return String(NUM).padStart(LEN, '0');

        //return ( Array(LEN).join('0') + NUM ).slice( -LEN );
    }

}