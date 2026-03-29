import { Scene, Camera, RawShaderMaterial, PlaneGeometry, Mesh } from 'three';
import { Common } from './Common';

export class ShaderPass{

    props:any;
    uniforms:any;
    scene:Scene;
    camera:Camera;
    material:RawShaderMaterial;
    geometry:PlaneGeometry;
    plane:Mesh;

    constructor(props:any){
        this.props = props;
        this.uniforms = this.props.material?.uniforms;
    }

    init(){

        this.scene = new Scene();
        this.camera = new Camera();

        if(this.uniforms){
            
            this.material = new RawShaderMaterial(this.props.material);
            this.geometry = new PlaneGeometry(2.0, 2.0);
            this.plane = new Mesh(this.geometry, this.material);
            this.scene.add(this.plane);

        }

    }

    update(){
        Common.renderer.setRenderTarget(this.props.output);
        Common.renderer.render(this.scene, this.camera);
        Common.renderer.setRenderTarget(null);
    }



}
    