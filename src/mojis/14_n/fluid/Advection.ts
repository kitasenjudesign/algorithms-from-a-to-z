import { ShaderPass } from "./ShaderPass";
import face_vert from "../glsl/face.vert";
import line_vert from "../glsl/line.vert";
import advection_frag from "../glsl/advection.frag";
import { BufferAttribute, BufferGeometry, LineSegments, RawShaderMaterial } from 'three';


//https://scrapbox.io/kitasenjudesign/%E6%B5%81%E4%BD%93%EF%BC%88%E3%83%8A%E3%83%93%E3%82%A8%E3%83%BB%E3%82%B9%E3%83%88%E3%83%BC%E3%82%AF%E3%82%B9%EF%BC%89
//移流項＝流体の流れ（Advection）

export class Advection extends ShaderPass{


    line:LineSegments;

    constructor(simProps:any){
        super({
            material: {
                vertexShader: face_vert,
                fragmentShader: advection_frag,
                uniforms: {
                    boundarySpace: {
                        value: simProps.cellScale
                    },
                    px: {
                        value: simProps.cellScale
                    },
                    fboSize: {
                        value: simProps.fboSize
                    },
                    velocity: {
                        value: simProps.src.texture
                    },
                    dt: {
                        value: simProps.dt
                    },
                    isBFECC: {
                        value: true
                    }
                },
            },
            output: simProps.dst
        });

        this.init();
    }

    init(){
        super.init();
        this.createBoundary();
    }

    createBoundary(){
        const boundaryG = new BufferGeometry();
        const vertices_boundary = new Float32Array([
            // left
            -1, -1, 0,
            -1, 1, 0,

            // top
            -1, 1, 0,
            1, 1, 0,

            // right
            1, 1, 0,
            1, -1, 0,

            // bottom
            1, -1, 0,
            -1, -1, 0
        ]);
        boundaryG.setAttribute( 'position', new BufferAttribute( vertices_boundary, 3 ) );

        const boundaryM = new RawShaderMaterial({
            vertexShader: line_vert,
            fragmentShader: advection_frag,
            uniforms: this.uniforms
        });

        this.line = new LineSegments(boundaryG, boundaryM);
        this.scene.add(this.line);
    }

    override update(dt:number=0, isBounce:boolean=true, BFECC:boolean=true){

        this.uniforms.dt.value = dt;
        this.line.visible = isBounce;
        this.uniforms.isBFECC.value = BFECC;

        super.update();
    }


}
