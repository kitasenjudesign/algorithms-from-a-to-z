import { Scene, Camera, PlaneGeometry, RawShaderMaterial, Mesh, Vector2 } from 'three';
import { Simulation } from './Simulation';
import face_vert from "../glsl/face.vert";
//import color_frag from "../glsl/color.frag";
import color_frag from "../glsl/simpleOutput.frag";

import { Common } from './Common';
import { Feedback } from '../feedback/Feedback';

export class Output{

    scene       :Scene;
    camera      :Camera;
    simulation  :Simulation;
    output      :Mesh;
    feedback    :Feedback;
    material    :RawShaderMaterial;

    constructor(){
        this.init();
    }

    init(){
        this.simulation = new Simulation();

        this.feedback = new Feedback();
        this.feedback.init();
        

        this.scene = new Scene();
        this.camera = new Camera();


        this.material = new RawShaderMaterial({
            vertexShader: face_vert,
            fragmentShader: color_frag,
            uniforms: {
                tex: {
                    value: null
                },
                velTex: {
                    value: null//this.simulation.fbos.vel_0.texture
                },
                boundarySpace: {
                    value: new Vector2()
                }
            },
        });

        this.output = new Mesh(
            new PlaneGeometry(2, 2),
            this.material
        );

        this.scene.add(this.output);
    }
    addScene(mesh:Mesh){
        this.scene.add(mesh);
    }

    resize(){
        this.simulation.resize();
    }

    render(){

        this.feedback.update(
            this.simulation.fbos.vel_0.texture,
        );
        let tex = this.feedback.getOutput();
        this.material.uniforms.tex.value = tex;
//console.log(tex)

        //以下のように描くと最終出力
        Common.renderer.setRenderTarget(null);
        Common.renderer.render(this.scene, this.camera);

        //

    }

    update(){
        this.simulation.update();
        this.render();
    }    

}