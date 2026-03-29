import { Advection } from './Advection';
import { ExternalForce } from './ExternalForce';
import { ShaderPass } from './ShaderPass';
import face_vert from "../glsl/face.vert";
import pressure_frag from "../glsl/pressure.frag";
import { NMainP5 } from '../NMainP5';

export class Pressure extends ShaderPass{

    constructor(simProps:any){
        super({
            material: {
                vertexShader: face_vert,
                fragmentShader: pressure_frag,
                uniforms: {
                    map: {
                        value: null//NMainP5.instance.getCanvasTex()
                    },
                    boundarySpace: {
                        value: simProps.boundarySpace
                    },
                    pressure: {
                        value: simProps.src_p.texture
                    },
                    velocity: {
                        value: simProps.src_v.texture
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
        });

        this.init();
    }

    override update(vel:any=null, pressure:any=null){
        if(vel)this.uniforms.velocity.value = vel.texture;
        if(pressure)this.uniforms.pressure.value = pressure.texture;
        if(NMainP5.instance) this.uniforms.map.value = NMainP5.instance.getCanvasTex();
        super.update();
    }
    

}