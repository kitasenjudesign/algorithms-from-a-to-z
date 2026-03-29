import * as THREE from 'three';
import lifegameVert from "../glsl/lifegame.vert";
import lifegameFrag from "../glsl/lifegame.frag";
import { ShaderMaterial, TextureLoader } from 'three';
import { ColorTex } from './ColorTex';


export class CAVisualizer extends THREE.Mesh{

    //quads    :QTreeQuads;
    mat         :ShaderMaterial;
    colorTex    :ColorTex;

    constructor(planeWidth:number,textureWidth:number,p5width:number){

        let plane = new THREE.PlaneGeometry(
            128,128//planeWidth,planeHeight
        );

        let loader = new TextureLoader();
        let dotTex = loader.load("./data/l.png");
        dotTex.minFilter=THREE.NearestFilter;
        dotTex.magFilter=THREE.NearestFilter;
        
        let loader2 = new TextureLoader();
        let dotTex2 = loader2.load("./data/c.png");
        dotTex2.minFilter=THREE.NearestFilter;
        dotTex2.magFilter=THREE.NearestFilter;

        let loader3 = new TextureLoader();
        let dotTex3 = loader3.load("./data/r.png");
        dotTex3.minFilter=THREE.NearestFilter;
        dotTex3.magFilter=THREE.NearestFilter;

        let loader4 = new TextureLoader();
        let dotTex4 = loader4.load("./data/c2.png");
        dotTex4.minFilter=THREE.NearestFilter;
        dotTex4.magFilter=THREE.NearestFilter;

        let material = new THREE.ShaderMaterial({
          uniforms: {
            textureLifeGame: {value: null},
            textureLifeGame2: {value: null},
            ruleTex:{value:null},//ruleTex.dataTex},
            colorTex:{value:null},
            dotTex: {value: dotTex},
            dotTex2: {value: dotTex2},
            dotTex3: {value: dotTex3},
            dotTex4: {value: dotTex4},
            areaTex: {value: null},
            time: {value: 0},
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

        //this.quads = new QTreeQuads();
        //this.add(this.quads);
        //this.lineQuad = new TQuads();
        //this.lineQuad.visible=false;
        //this.add(this.lineQuad);

        this.colorTex = new ColorTex();
        this.mat.uniforms.colorTex.value = this.colorTex.tex;

    }


    public update(tex1:THREE.Texture,tex2:THREE.Texture,areaTex:THREE.Texture){
        
        this.mat.uniforms.textureLifeGame.value = tex1;
        this.mat.uniforms.textureLifeGame2.value = tex2;
        this.mat.uniforms.areaTex.value = areaTex;
        this.mat.uniforms.time.value += 0.1;
    }

}