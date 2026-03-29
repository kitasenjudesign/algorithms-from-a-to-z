import * as THREE from 'three';
import { ParamsG } from '../data/ParamsG';
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer';
import lifegameVert from "../glsl/lifegame.vert";
import lifegameFrag from "../glsl/lifegame.frag";
import lifegameCalcFrag from "../glsl/lifegameCalc.frag";
import { p5Main } from '../myP5/p5Main';
import { RuleTex } from '../lifegame/RuleTex';
//import { TQuads } from '../quads/TQuads';
import { CACalculator } from './CACalculator';
import { CAVisualizer } from './CAVisualizer';
import { GameOfLifeP5src } from '../GameOfLifeP5src';


export class CAMain extends THREE.Object3D{

    //material    :THREE.ShaderMaterial;
    
    renderer    :THREE.WebGLRenderer;
    calculator  :CACalculator;
    visualizer  :CAVisualizer;

    counter     :number=0;
    src         :GameOfLifeP5src;
    callback    :()=>void;

    constructor(){
        super();
    }
    
    init(src:GameOfLifeP5src, renderer:THREE.WebGLRenderer, callback:()=>void){

        this.src = src;
        this.renderer = renderer;

        let textureWidth = ParamsG.resolution;  
        const planeWidth = textureWidth;//256;//512;
        const planeHeight = textureWidth;//256;//512;

        console.log(">>>>>>>>>>>",planeWidth);

        this.callback=callback;
        this.calculator = new CACalculator(
            this.src,textureWidth,planeWidth,renderer
        );
        this.calculator.init(()=>{
            this.init2();
        });
       
    }

    init2(){

        console.log("init2")
        let textureWidth = ParamsG.resolution;  
        const planeWidth = textureWidth;//256;//512;    
        this.visualizer = new CAVisualizer(planeWidth,textureWidth,this.calculator.p5Main._width);
        this.add(this.visualizer);

        this.callback();

    }

    reset():void{
        this.calculator.reset();
    }

    getCurrentTexture():THREE.Texture{
        return this.calculator.getCurrentTexture();
    }

    update(){
      
        this.counter++;
        
        if(this.counter>=11){
            this.calculator.update();//計算
        }

        this.visualizer.update(
            this.calculator.getCurrentTexture(),
            this.calculator.getAltenateTexture(),
            this.calculator.getAreaTexture()
        );

    }



}