import { Advection } from './Advection';
import { ExternalForce } from './ExternalForce';
import { ShaderPass } from './ShaderPass';
import face_vert from "../glsl/face.vert";
import viscous_frag from "../glsl/viscous.frag";

import externalForce_frag from "./glsl/externalForce.frag";


//粘性
export class Viscous extends ShaderPass{

    constructor(simProps:any){
        super({
            material: {
                vertexShader: face_vert,
                fragmentShader: viscous_frag,
                uniforms: {
                    boundarySpace: {
                        value: simProps.boundarySpace
                    },
                    velocity: {
                        value: simProps.src.texture
                    },
                    velocity_new: {
                        value: simProps.dst_.texture
                    },
                    v: {
                        value: simProps.viscous,
                    },
                    px: {
                        value: simProps.cellScale
                    },
                    dt: {
                        value: simProps.dt
                    }
                }
            },

            output: simProps.dst,

            output0: simProps.dst_,
            output1: simProps.dst
        })

        this.init();
    }

    override update(viscous:number=0, iterations:number=0, dt:number=0){
        let fbo_in, fbo_out;
        this.uniforms.v.value = viscous;
        for(var i = 0; i < iterations; i++){
            if(i % 2 == 0){
                fbo_in = this.props.output0;
                fbo_out = this.props.output1;
            } else {
                fbo_in = this.props.output1;
                fbo_out = this.props.output0;
            }

            this.uniforms.velocity_new.value = fbo_in.texture;
            this.props.output = fbo_out;
            this.uniforms.dt.value = dt;

            super.update();
        }

        return fbo_out;
    }

}