import { ShaderPass } from "./ShaderPass";
import mouse_vert from "../glsl/mouse.vert";
import externalForce_frag from "../glsl/externalForce.frag";
import { Mouse } from './Mouse';
import { PlaneGeometry, Vector2, RawShaderMaterial, Mesh, AdditiveBlending } from 'three';

//発散
export class ExternalForce extends ShaderPass{

    
    mouse:Mesh;

    public static center:Vector2 = new Vector2();

    constructor(simProps:any){
        super({
            output: simProps.dst
        });

        this.init(simProps);
    }

    override init(simProps:any=null){
        super.init();
        const mouseG = new PlaneGeometry(
            1, 1
        );

        const mouseM = new RawShaderMaterial({
            vertexShader: mouse_vert,
            fragmentShader: externalForce_frag,
            blending: AdditiveBlending,
            uniforms: {
                px: {
                    value: simProps.cellScale
                },
                force: {
                    value: new Vector2(0.0, 0.0)
                },
                center: {
                    value: new Vector2(0.0, 0.0)
                },
                scale: {
                    value: new Vector2(simProps.cursor_size, simProps.cursor_size)
                }
            },
        })

        this.mouse = new Mesh(mouseG, mouseM);
        this.scene.add(this.mouse);
    }


    override update(props:any=null){
        const forceX = Mouse.diff.x / 2 * props.mouse_force;
        const forceY = Mouse.diff.y / 2 * props.mouse_force;

        const cursorSizeX = props.cursor_size * props.cellScale.x;
        const cursorSizeY = props.cursor_size * props.cellScale.y;

        const centerX = Math.min(Math.max(Mouse.coords.x, -1 + cursorSizeX + props.cellScale.x * 2), 1 - cursorSizeX - props.cellScale.x * 2);
        const centerY = Math.min(Math.max(Mouse.coords.y, -1 + cursorSizeY + props.cellScale.y * 2), 1 - cursorSizeY - props.cellScale.y * 2);

        const mouseMat:any = this.mouse.material;
        const uniforms:any = mouseMat.uniforms;

        uniforms.force.value.set(forceX, forceY);
        uniforms.center.value.set(centerX, centerY);
        uniforms.scale.value.set(props.cursor_size, props.cursor_size);

        ExternalForce.center.set(centerX, centerY);

        super.update();
    }

    
}
