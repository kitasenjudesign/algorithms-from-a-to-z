import { Scene, Camera, RawShaderMaterial, PlaneGeometry, Mesh } from 'three';

export class ExShaderPass{

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
            //このクラスはShaderMaterial と同じように機能しますが、
            //組み込みのユニフォームと属性の定義が GLSL シェーダー コードに自動的に付加されない点が異なります。
            this.material = new RawShaderMaterial();
            this.geometry = new PlaneGeometry(2.0, 2.0);
            this.plane = new Mesh(this.geometry, this.material);
            this.scene.add(this.plane);

        }

    }

    update(){
        
        //Common.renderer.setRenderTarget(this.props.output);
        //Common.renderer.render(this.scene, this.camera);
        //Common.renderer.setRenderTarget(null);



        
    }



}
    