import { GUI } from 'lil-gui'
import * as THREE from 'three';
import { Params } from '../../../data/Params';

export class ParamsRd {

    public static gui:GUI;
    public static width:number = 512;//*2;
    public static height:number = 512;//*2;
    public static colorId:number = 0;
    public static colorMax:number=8;
    public static isPreviewed:boolean=false;

    public static stageWidth:number = 540*2;//512;
    public static stageHeight:number = 540*2;//512;

    public static rdParams:THREE.Vector4[] =
        [
            new THREE.Vector4(0.015,0.049,0.21,0.105),//1
            new THREE.Vector4(0.018,0.0476,0.21,0.105),//2
            new THREE.Vector4(0.1214,0.1114,1.15,1.35),//3
            new THREE.Vector4(0.0053,0.038,0.586,0.178),//4
            new THREE.Vector4(0.028,0.05,1.0,0.15),//5
            new THREE.Vector4(0.037,0.059,0.597,0.342),//6
            new THREE.Vector4(0.018,0.0476,0.21,0.105),//7
            new THREE.Vector4(0.037,0.059,0.597,0.342),//8
            new THREE.Vector4(0.037,0.059,0.5,0.342),//9
            new THREE.Vector4(0.0931,0.03482,0.108,0.322),//A
            new THREE.Vector4(0.0931,0.03482,0.108,0.322),//B
            new THREE.Vector4(0.0931,0.03482,0.108,0.322),//C
            new THREE.Vector4(0.0931,0.03482,0.108,0.322),//D
            new THREE.Vector4(0.0931,0.03482,0.108,0.322),//E
            new THREE.Vector4(0.0931,0.03482,0.108,0.322)//F
            
        ]
    

    public static init(){

       
        this.gui = new GUI();

        if(!Params.debug){
            this.gui.domElement.style.display="none";
        }

    }

    

}