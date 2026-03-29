import { ShaderPass } from "./ShaderPass";
import face_vert from "../glsl/face.vert";
import divergence_frag from "../glsl/divergence.frag";

//発散
export class Divergence extends ShaderPass{

    constructor(simProps:any){
        super({
            material: {
                vertexShader: face_vert,
                fragmentShader: divergence_frag,
                uniforms: {
                    boundarySpace: {
                        value: simProps.boundarySpace
                    },
                    velocity: {
                        value: simProps.src.texture
                    },
                    px: {
                        value: simProps.cellScale
                    },
                    dt: {
                        value: simProps.dt
                    }
                }
            },
            output: simProps.dst
        })

        this.init();
    }

    override update(vel:any=null){
    //update({ vel }){
        this.uniforms.velocity.value = vel.texture;
        super.update();
    }

    
}
