import * as THREE from 'three';
import { ParamsG } from '../data/ParamsG';
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer';
import lifegameVert from "../glsl/lifegame.vert";
import lifegameFrag from "../glsl/lifegame.frag";
import lifegameCalcFrag from "../glsl/lifegameCalc.frag";
import { p5Main } from '../myP5/p5Main';
import { RuleTex } from '../lifegame/RuleTex';
//import { TQuads } from '../quads/TQuads';
import { ShaderMaterial, TextureLoader } from 'three';
import { ColorTex } from './ColorTex';


export class CAVisualizer extends THREE.Mesh{

    //p5Main      :p5Main;
   //lineQuad    :TQuads;
    mat         :ShaderMaterial;
    colorTex    :ColorTex;

    constructor(planeWidth:number,textureWidth:number,p5width:number){

        let loader = new TextureLoader();
        let dotTex = loader.load("./data/dot.png")
        dotTex.magFilter=THREE.NearestFilter;
        dotTex.minFilter=THREE.NearestFilter;

        let loader2 = new TextureLoader();
        let dotTex2 = loader.load("./data/dot2.png")
        dotTex2.magFilter=THREE.NearestFilter;
        dotTex2.minFilter=THREE.NearestFilter;

        let loader3 = new TextureLoader();
        let dotTex3 = loader.load("./data/dot3.png")
        dotTex3.magFilter=THREE.NearestFilter;
        dotTex3.minFilter=THREE.NearestFilter;

        let plane = new THREE.PlaneGeometry(
            planeWidth,planeWidth
        );
    
        let material = new THREE.ShaderMaterial({
          uniforms: {
            textureLifeGame: {value: null},
            textureLifeGame2: {value: null},
            dotTex:{value: dotTex},
            dotTex2:{value: dotTex2},
            dotTex3:{value: dotTex3},
            resolution:{value: ParamsG.resolution},

            colorTex:{value:null},

            areaTex: {value: null},
            areaTexSize: {value: new THREE.Vector2(
                p5width,p5width
            )},
            counter: {value: 0},
            planeSize: {value: new THREE.Vector2(planeWidth, planeWidth)},
            textureSize: {value: new THREE.Vector2(textureWidth, textureWidth)}
          },
          vertexShader: lifegameVert,
          fragmentShader: lifegameFrag,
          side: THREE.DoubleSide
        });
        super(plane, material);


        this.mat = material;
        //this.lineQuad = new TQuads();
        //this.add(this.lineQuad);

        this.colorTex = new ColorTex();
        this.mat.uniforms.colorTex.value = this.colorTex.tex;

    }

    //public reset(rects:QTreeRect[]){
    //    this.lineQuad.init(rects)
    //}

    public update(tex1:THREE.Texture,tex2:THREE.Texture,areaTex:THREE.Texture){
        
        //this.lineQuad.update();

        this.mat.uniforms.textureLifeGame.value = tex1;
        this.mat.uniforms.textureLifeGame2.value = tex2;
        this.mat.uniforms.areaTex.value = areaTex;

    }

}