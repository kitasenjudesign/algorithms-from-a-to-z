import * as THREE from 'three';
import { ParamsC } from '../data/ParamsC';
import { CACalculator } from './CACalculator';
import { CAVisualizer } from './CAVisualizer';
//import { CAAreaVisualizer } from './CAAreaVisualizer';


export class CAMain extends THREE.Object3D{

    renderer    :THREE.WebGLRenderer;
    calculator      :CACalculator;
    visualizer      :CAVisualizer;
    //areaVisualizer  :CAAreaVisualizer;

    counter     :number=0;
    callback    :()=>void;

    constructor(){
        super();
    }
    
    init(renderer:THREE.WebGLRenderer, callback:()=>void){

        let textureWidth = ParamsC.resolution;  
        const planeWidth = textureWidth;//256;//512;
        const planeHeight = textureWidth;//256;//512;

        console.log(">>>>>aaa",planeWidth, planeHeight);

        this.callback=callback;
        this.calculator = new CACalculator(textureWidth,planeWidth,renderer);
        this.calculator.init(()=>{
            this.init2();
        });
       
    }

    init2(){

        //console.log("init2")
        let textureWidth = ParamsC.resolution;  
        const planeWidth = textureWidth;//256;//512;
        const planeHeight = textureWidth;//256;//512;        
        this.visualizer = new CAVisualizer(
            planeWidth,
            textureWidth,
            this.calculator.p5MainCA._width
        );
        this.add(this.visualizer);

        //this.areaVisualizer = new CAAreaVisualizer();
        //this.add(this.areaVisualizer)

        this.callback();

    }

    reset():void{

        this.calculator.reset();
        
        //console.log(this.calculator.p5Main._drawers.getRects())

        //this.areaVisualizer.init(
        //    this.calculator.p5Main._drawers.getRects()
        //)
        
    }

    getCurrentTexture():THREE.Texture{
        return this.calculator.getCurrentTexture();
    }

    update(){
      
        this.counter++;
        
        this.calculator.update();//計算
        this.calculator.update();//計算

        this.visualizer.update(
            this.calculator.getCurrentTexture(),
            this.calculator.getAltenateTexture(),
            this.calculator.getAreaTexture()
        );

    }


    resize(x:number,y:number,w:number,h:number){
        //console.log("resize!!");
        //resize
        //this.areaVisualizer.resize(x,y,w,h);
    }

}