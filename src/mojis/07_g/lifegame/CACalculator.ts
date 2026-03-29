import * as THREE from 'three';
import { ParamsG } from '../data/ParamsG';
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer';
import lifegameVert from "../glsl/lifegame.vert";
import lifegameFrag from "../glsl/lifegame.frag";
import lifegameCalcFrag from "../glsl/lifegameCalc.frag";
import { p5Main } from '../myP5/p5Main';
import { RuleTex } from '../lifegame/RuleTex';
import { WebGLRenderer } from 'three';
import { GameOfLifeP5src } from '../GameOfLifeP5src';
//import glslify from 'glslify';


export class CACalculator{

    gpuCompute  :GPUComputationRenderer;
    variableLifeGame:Variable;
    p5Main      :p5Main;
    counter     :number = 0;
    src         :GameOfLifeP5src;

    constructor(
        src:GameOfLifeP5src,
        textureWidth:number,
        planeWidth:number,
        renderer:WebGLRenderer
    ){

        this.src = src;

        console.log("CACalculator!!!!!!>>>>>>>", textureWidth, planeWidth);

        this.gpuCompute = new GPUComputationRenderer(
            textureWidth, textureWidth, renderer
        );
        const textureLifeGame = this.gpuCompute.createTexture();

//        let data = Params.bitmapData;


        for (let i = 0, l = textureLifeGame.image.data.length; i < l; i += 4) {

            let idx = Math.floor(i/4);
            let idxX = idx%textureWidth;
            let idxY = Math.floor(idx/textureWidth);
            //console.log("idxX, idxY", idxX, idxY);
            /*
            let pixel = Params.bitmapData.getPixelR(
                idxX/textureWidth,
                1-idxY/textureWidth
            );*/
            let pixel = this.src.getPixel(idxX,textureWidth-1-idxY);
            //pixel+=Math.random()*200;
            //console.log("pixel", pixel);
            //let pixelData = Params.bitmapData._imageData.data;
            pixel = pixel < 128 ? 0 : 1;
            
            textureLifeGame.image.data[i + 0] = pixel;//pixelData[i+0] < 128 ? 0 : 1;//r初期値
            textureLifeGame.image.data[i + 1] = pixel;//pixelData[i+1] < 128 ? 0 : 1;//g
            textureLifeGame.image.data[i + 2] = pixel;//pixelData[i+2] < 128 ? 0 : 1;//b
            textureLifeGame.image.data[i + 3] = 0.0;
          
        }
        this.variableLifeGame =this.gpuCompute.addVariable(
            "textureLifeGame",
            lifegameCalcFrag, //antsCalcFrag,
            textureLifeGame
        );

        this.gpuCompute.setVariableDependencies(
            this.variableLifeGame,
            [this.variableLifeGame]
        );


        //compute用シェーダー
        let ruleTex = new RuleTex();
        let uniforms = this.variableLifeGame.material.uniforms;
        uniforms.counter = {value: 0};
        uniforms.planeSize = {value: new THREE.Vector2(planeWidth, planeWidth)};
        uniforms.ruleTex = {value:ruleTex.dataTex };
        uniforms.ruleTexSize = {value: ruleTex.size };
        uniforms.areaTex = { value: null };
        uniforms.numRule = {value: ParamsG.numRules };
        const error = this.gpuCompute.init();
        if (error !== null) {
          console.error(error);
        }

    }

    public init(callback:()=>void){

        this.p5Main = new p5Main();
        this.p5Main.init(()=>{
            callback();
        });
    
    }

    getCurrentTexture():THREE.Texture{
        return this.gpuCompute.getCurrentRenderTarget(this.variableLifeGame).texture;
    }
    getAltenateTexture():THREE.Texture{
        return this.gpuCompute.getAlternateRenderTarget(this.variableLifeGame).texture;
    }
    getAreaTexture():THREE.Texture{
        return this.p5Main.getCanvasTex();
    }



    public reset(){


    }


    public update(){
        this.gpuCompute.compute();

        let tex = this.gpuCompute.getCurrentRenderTarget(this.variableLifeGame).texture;
        let tex2 = this.gpuCompute.getAlternateRenderTarget(this.variableLifeGame).texture;

        tex.magFilter=THREE.NearestFilter;
        tex.minFilter=THREE.NearestFilter;
        
        this.variableLifeGame.material.uniforms.counter.value= this.counter;
        this.counter+=0.1;

        if(this.p5Main.getCanvasTex()!=null){
            this.variableLifeGame.material.uniforms.areaTex.value
             = this.p5Main.getCanvasTex();
            //this.material.uniforms.areaTex.value = this.p5Main.getCanvasTex();
        }

        this.p5Main.update();

    }

}
