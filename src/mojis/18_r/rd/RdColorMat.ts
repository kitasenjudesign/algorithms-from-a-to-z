import * as THREE from 'three';
import { Camera, Matrix4, Object3D, OrthographicCamera, Texture, TextureLoader, Vector3 } from 'three';
import rdPlaneVert from "../glsl/rdPlane.vert";
import rdPlaneVert2 from "../glsl/rdPlane2.vert";

import rdPlaneFrag from "../glsl/rdPlane.frag";
import rdPlaneFrag2 from "../glsl/rdPlane2.frag";

import rdDecord from "../glsl/_encode-decode.frag";
import { ParamsRd } from '../data/ParamsRd';
import { p5MainRd } from '../myP5/p5MainRd';


export class RdColorMat extends THREE.ShaderMaterial{

    private _texture1:Texture;
    private _count:number=0;
    /**
     * new
     * @param	tt
     * @param	t2
     */
    constructor(tgt:THREE.WebGLRenderTarget,width:number,height:number) 
    {
        //texture
        let loader = new TextureLoader();
        let tex = loader.load("./data/color2.png");
        
        let loader2 = new TextureLoader();
        let tex2 = loader2.load("./data/color2.png");

        let rgb = new Vector3(Math.random(),Math.random(),Math.random());
        

        super({
                
                //vertexShader: rdPlaneVert,
                vertexShader: rdPlaneVert2,
                
                //fragmentShader: rdDecord+rdPlaneFrag,
                fragmentShader: rdPlaneFrag2,
                
                uniforms: THREE.UniformsUtils.merge(
                    [
                        THREE.ShaderLib[ 'phong' ].uniforms,        
                        {
                            tex1: { value: tex },
                            tex2: { value: tex2 },
                            ruleTex:{value: null},
                            map: { value: tex },

                            colorId:{value: ParamsRd.colorId/ParamsRd.colorMax },

                            counter:{value: 0},
                            size: { value: new THREE.Vector2(width,height) }
                        }
                    ]
                )
        });
        this.side = THREE.DoubleSide;
        this.lights = true;
        this._texture1 = tex;
        
        //console.log( this.vertexShader );

        let WIDTH:number = 128;
        let BOUNDS:number = 512;

        this.defines.WIDTH = WIDTH.toFixed( 1 );
        this.defines.BOUNDS = BOUNDS.toFixed( 1 );

        //console.log(this.uniforms);
        //this.wireframe = true;
        //console.log(this);



    }

    public update(rt:THREE.WebGLRenderTarget):void {
        //console.log(this.uniforms.tex1.value)
        //this.uniforms.tex1.value = rt.texture;
        this.uniforms.map.value = rt.texture;
        this.uniforms.counter.value += 0.01;
        //this._count++;

        let tex = p5MainRd.Instance.getCanvasTex();
        if(tex){
            this.uniforms.ruleTex.value = tex;
        }


        
    }

}