import * as THREE from 'three';
import { ParamsC } from '../data/ParamsC';
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer';
import lifegameCalcFrag from "../glsl/lifegameCalc.frag";
import { p5MainCA } from '../myP5/p5MainCA';
import { RuleTex } from '../lifegame/RuleTex';
import { WebGLRenderer } from 'three';
//import glslify from 'glslify';
import { Random } from '../data/Random';


export class CACalculator{

    gpuCompute  :GPUComputationRenderer;
    variableLifeGame:Variable;
    p5MainCA      :p5MainCA;
    counter     :number = 0;
    rule        :number = 0;
    isInit:boolean=false;
    renderer    :WebGLRenderer;

    constructor(
        textureWidth:number,planeWidth:number,renderer:WebGLRenderer
    ){

        console.log("CACalculator!!!!!!", textureWidth, planeWidth);
        this.renderer = renderer;
        this.gpuCompute = new GPUComputationRenderer(
            textureWidth, textureWidth, renderer
        );
        const textureLifeGame = this.gpuCompute.createTexture();

        let l = textureLifeGame.image.data.length;
        let idx = 0;

        

        for(let j=0;j<textureWidth;j++){
            for(let i=0;i<textureWidth;i++){

                textureLifeGame.image.data[idx + 0] = i==128 ? 1 : 0;//randoms[i];//i==Math.floor(textureWidth/2) ? 1 : 0;
                textureLifeGame.image.data[idx + 1] = i==128 ? 1 : 0;//Math.random()<0.5 ? 1 : 0;//g
                textureLifeGame.image.data[idx + 2] = i==128 ? 1 : 0;//Math.random()<0.5 ? 1 : 0;//g
                textureLifeGame.image.data[idx + 3] = 1//i==128 ? 1 : 0;//Math.random()<0.5 ? 1 : 0;//g
                idx += 4;

            }
        }


        this.variableLifeGame =this.gpuCompute.addVariable(
            "textureLifeGame",
            //antsCalcFrag,
            lifegameCalcFrag, 
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
        uniforms.rule = {value:this.rule};
        uniforms.ruleTex = {value:ruleTex.dataTex };
        uniforms.ruleTexSize = {value: ruleTex.size };
        uniforms.areaTex = { value: null };

        const error = this.gpuCompute.init();
        if (error !== null) {
          console.error(error);
        }

        //ParamsC.gui.add(this,"rule",0,255,1).listen();
        //ParamsC.gui.add(this,"nextRule");
        //ParamsC.gui.add(this,"prevRule");
        
    }

    


    public nextRule(){
        this.rule++;
        this.rule = this.rule%256;
    }
    public prevRule(){
        this.rule--;
        if(this.rule<0)this.rule=255;
    }    

    public init(callback:()=>void){


        //ここでp5
        this.p5MainCA = new p5MainCA();
        this.p5MainCA.init(()=>{
            this.isInit=true;
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
        return this.p5MainCA.getCanvasTex();
    }



    public reset(){

        //this.p5Main._qTree.update(5);
        //this.p5Main._qTree.swapRandomly();

    }

    /**
     * 任意のタイミングでtextureLifeGameの特定のピクセル(x,y)だけ書き換える。
     * GPUComputationRendererはピンポン方式で2枚のレンダーターゲットを使い回すため、
     * 両方に書き込まないと次のcompute()で上書き/巻き戻りが起きる。
     */
    public setPixel(x:number, y:number, r:number, g:number, b:number, a:number=1){

        const data = new Float32Array([r, g, b, a]);
        const pixelTex = new THREE.DataTexture(
            data, 1, 1, THREE.RGBAFormat, THREE.FloatType
        );
        pixelTex.needsUpdate = true;

        const pos = new THREE.Vector2(x, y);

        this.renderer.copyTextureToTexture(
            pos, pixelTex,
            this.gpuCompute.getCurrentRenderTarget(this.variableLifeGame).texture
        );
        this.renderer.copyTextureToTexture(
            pos, pixelTex,
            this.gpuCompute.getAlternateRenderTarget(this.variableLifeGame).texture
        );

    }

    //生死のみで扱いたいとき用のショートカット(コンストラクタでの初期化と同じ値の付け方)
    public setCell(x:number, y:number, alive:boolean){
        let v = alive ? 1 : 0;
        this.setPixel(x, y, v, v, v, 1);
    }


    public update(){

        if(!this.isInit)return;
        if(this.p5MainCA.getCanvasTex()==null)return;


        /*
        if(this.p5MainCA._p5.frameCount>=100){
            for(let i=0;i<ParamsC.resolution;i++){
                this.setPixel(
                    i,
                    ParamsC.resolution-1,
                    i%32==0 ? 1 : 0,
                    i%32==0 ? 1 : 0,
                    i%32==0 ? 1 : 0,
                    1
                );
            }
        }*/

        //return;
        this.variableLifeGame.material.uniforms.areaTex.value= this.p5MainCA.getCanvasTex();
        //this.material.uniforms.areaTex.value = this.p5Main.getCanvasTex();

        this.gpuCompute.compute();

        let tex = this.gpuCompute.getCurrentRenderTarget(this.variableLifeGame).texture;
        let tex2 = this.gpuCompute.getAlternateRenderTarget(this.variableLifeGame).texture;

        tex.magFilter=THREE.NearestFilter;
        tex.minFilter=THREE.NearestFilter;
        
        this.variableLifeGame.material.uniforms.rule.value = Math.floor(this.rule);
        this.variableLifeGame.material.uniforms.counter.value= this.counter;
        this.counter+=1;

    }

}
