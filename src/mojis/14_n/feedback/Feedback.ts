//https://scrapbox.io/kitasenjudesign/%E6%B5%81%E4%BD%93%EF%BC%88%E3%83%8A%E3%83%93%E3%82%A8%E3%83%BB%E3%82%B9%E3%83%88%E3%83%BC%E3%82%AF%E3%82%B9%EF%BC%89
//移流項＝流体の流れ（Advection）

import { Material, WebGLRenderTarget, Scene, Camera, RawShaderMaterial, PlaneGeometry, Mesh, Texture, ShaderMaterial, TextureLoader, NearestFilter } from 'three';
import faceVert from "../glsl/face.vert";
import myFrag from "../glsl/shader1.frag";
import glslify from 'glslify';
import { Common } from '../fluid/Common';
import { NMainP5 } from '../NMainP5';
import { ExternalForce } from '../fluid/ExternalForce';

export class Feedback{

    //webrendertargeを２種類作る
    scene   :Scene;
    camera  :Camera;

    renderTargetA:WebGLRenderTarget;
    renderTargetB:WebGLRenderTarget;

    material    :RawShaderMaterial;
    geometry    :PlaneGeometry;
    plane       :Mesh;

    time:number = -0.01;
    pingpong:boolean=false;

    texture1:Texture;
    texture2:Texture;
    texIndex:number=0;

    navierP5:NMainP5;

    init(){

        let n = 2;
        this.renderTargetA = new WebGLRenderTarget(512*n, 512*n);
        this.renderTargetB = new WebGLRenderTarget(512*n, 512*n);

        
        this.renderTargetA.texture.minFilter = NearestFilter;
        this.renderTargetA.texture.magFilter = NearestFilter;
        this.renderTargetB.texture.minFilter = NearestFilter;
        this.renderTargetB.texture.magFilter = NearestFilter;
        
        
        /*
        this.renderTargetA.texture.minFilter = NearestFilter;
        this.renderTargetA.texture.magFilter = NearestFilter;
        this.renderTargetB.texture.minFilter = NearestFilter;
        this.renderTargetB.texture.magFilter = NearestFilter;
        */

        this.navierP5 = new NMainP5();
        this.navierP5.init(() => {
            this.material.uniforms.baseTex.value = this.navierP5.getCanvasTex();
        });

        this.scene = new Scene();
        this.camera = new Camera();

        let loader = new TextureLoader();
        //this.texture1 = loader.load("kitasenju.jpg");
        

        this.material = new RawShaderMaterial({
            uniforms: {
                baseTex:{value: null},//this.texture1},
                inputTex:{value: null},
                velTex:{value: null},
                time:{value:0},
                center:{value: ExternalForce.center},
                //textureSize: {value: new THREE.Vector2(textureWidth, textureWidth)}
            },
            vertexShader: faceVert,
            fragmentShader: myFrag
        });

        this.geometry = new PlaneGeometry(2.0, 2.0);
        this.plane = new Mesh(this.geometry, this.material);
        this.scene.add(this.plane);

        window.onmousedown=(e)=>{

            this.time=-0.01;
            this.material.uniforms.baseTex.value = this.navierP5.getCanvasTex();
            this.material.uniforms.time.value = this.time;

        }


    }

    
    getOutput():Texture{
        return this.pingpong ? this.renderTargetA.texture : this.renderTargetB.texture;
    }
    //getOutput():Texture{  
    //}

    update(velTex:Texture){

        
        //if(this.time>0.02)this.time=-0.01;

        this.material.uniforms.time.value = this.time;
        this.material.uniforms.velTex.value = velTex;
        if(this.pingpong){
            this.material.uniforms.inputTex.value = this.renderTargetB.texture;
            Common.renderer.setRenderTarget(this.renderTargetA);        
            Common.renderer.render(this.scene, this.camera);    
        }else{
            this.material.uniforms.inputTex.value = this.renderTargetA.texture;
            Common.renderer.setRenderTarget(this.renderTargetB);        
            Common.renderer.render(this.scene, this.camera);
        }

        this.pingpong = !this.pingpong;

        Common.renderer.setRenderTarget(null);
        //Common.renderer.setRenderTarget(this.props.output);

        let canvas = this.navierP5.getCanvasTex();
        this.material.uniforms.baseTex.value = this.navierP5.getCanvasTex();
        this.material.uniforms.center.value = ExternalForce.center;

        if(this.material.uniforms.baseTex.value!=null){
            this.time+=0.01;
        }
    }


}