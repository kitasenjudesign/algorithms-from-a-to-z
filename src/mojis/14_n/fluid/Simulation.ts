import { Advection } from './Advection';
import { ExternalForce } from './ExternalForce';
import { Viscous } from './Viscous';
import { Controls } from './Controls';
import { Divergence } from './Divergence';
import { Poisson } from './Poisson';
import { FloatType, HalfFloatType, Vector2, WebGLRenderTarget } from 'three';
import { Pressure } from './Pressure';
import { Common } from './Common';

export class Simulation{

    advection       :Advection;
    externalForce   :ExternalForce;
    viscous         :Viscous;
    divergence      :Divergence;
    poisson         :Poisson;
    pressure        :Pressure;
    props           :any;
    fbos            :any;
    options         :any;
    fboSize         :Vector2;
    cellScale       :Vector2;
    boundarySpace   :Vector2;

    /*
    this.fboSize = new THREE.Vector2();
    this.cellScale = new THREE.Vector2();
    this.boundarySpace = new THREE.Vector2();
    */

    constructor(){
        //this.props = props;

        this.fbos = {
            vel_0: null,
            vel_1: null,

            // for calc next velocity with viscous
            vel_viscous0: null,
            vel_viscous1: null,

            // for calc pressure
            div: null,

            // for calc poisson equation 
            pressure_0: null,
            pressure_1: null,
        };

        this.options = {
            iterations_poisson: 32,
            iterations_viscous: 16,//32,
            mouse_force: 150/2,
            resolution: 0.5,
            cursor_size: 40,
            viscous: 300,
            isBounce: true,
            dt: 0.01,//0.014,
            isViscous: false,
            BFECC: false
        };

        const controls = new Controls(this.options);

        this.fboSize = new Vector2();
        this.cellScale = new Vector2();
        this.boundarySpace = new Vector2();

        this.init();
    }

    
    init(){
        this.calcSize();
        this.createAllFBO();
        this.createShaderPass();
    }

    //FBOを生成
    createAllFBO(){
        //const type = ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) ? THREE.HalfFloatType : THREE.FloatType;

        for(let key in this.fbos){
            this.fbos[key] = new WebGLRenderTarget(
                this.fboSize.x,
                this.fboSize.y,
                {
                    //type: type
                    type: HalfFloatType
                }
            )
        }
    }

    createShaderPass(){

        //移流
        this.advection = new Advection({
            cellScale: this.cellScale,
            fboSize: this.fboSize,
            dt: this.options.dt,
            src: this.fbos.vel_0,//入力
            dst: this.fbos.vel_1//出力
        });

        //外力
        this.externalForce = new ExternalForce({
            cellScale: this.cellScale,
            cursor_size: this.options.cursor_size,
            dst: this.fbos.vel_1,//出力
        });

        //粘性
        this.viscous = new Viscous({
            cellScale: this.cellScale,
            boundarySpace: this.boundarySpace,
            viscous: this.options.viscous,
            src: this.fbos.vel_1,//入力
            dst: this.fbos.vel_viscous1,//出力
            dst_: this.fbos.vel_viscous0,//出力
            dt: this.options.dt,
        });

        //発散
        this.divergence = new Divergence({
            cellScale: this.cellScale,
            boundarySpace: this.boundarySpace,
            src: this.fbos.vel_viscous0,//入力
            dst: this.fbos.div,//出力
            dt: this.options.dt,
        });

        //ポアソン方程式
        this.poisson = new Poisson({
            cellScale: this.cellScale,
            boundarySpace: this.boundarySpace,
            src: this.fbos.div,//入力
            dst: this.fbos.pressure_1,//出力
            dst_: this.fbos.pressure_0,//出力
        });

        //圧力
        this.pressure = new Pressure({
            cellScale: this.cellScale,
            boundarySpace: this.boundarySpace,
            src_p: this.fbos.pressure_0,
            src_v: this.fbos.vel_viscous0,
            dst: this.fbos.vel_0,//vel_0最初にもどる！
            dt: this.options.dt,
        });

    }

    calcSize(){
        const width = Math.round(this.options.resolution * Common.width);
        const height = Math.round(this.options.resolution * Common.height);

        const px_x = 1.0 / width;
        const px_y = 1.0 / height;

        this.cellScale.set(px_x, px_y);
        this.fboSize.set(width, height);
    }

    resize(){
        this.calcSize();

        for(let key in this.fbos){
            this.fbos[key].setSize(this.fboSize.x, this.fboSize.y);
        }
    }


    update(){

        //console.log("simu update");

        if(this.options.isBounce){
            this.boundarySpace.set(0, 0);
        } else {
            this.boundarySpace.copy(this.cellScale);
        }

        this.advection.update(
            this.options.dt,
            this.options.isBounce,
            this.options.BFECC
        );

        this.externalForce.update({
            cursor_size: this.options.cursor_size,
            mouse_force: this.options.mouse_force,
            cellScale: this.cellScale
        });

        let vel = this.fbos.vel_1;

        if(this.options.isViscous){
            vel = this.viscous.update(
                this.options.viscous,
                this.options.iterations_viscous,
                this.options.dt
            );
        }

        this.divergence.update(vel);

        const pressure = this.poisson.update(
            this.options.iterations_poisson
        );

        this.pressure.update(vel,pressure);
    }


}