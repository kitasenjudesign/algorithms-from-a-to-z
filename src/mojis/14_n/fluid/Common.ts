import { Clock, WebGLRenderer } from 'three';
import { Stage } from '../../../data/Stage';

export class Common{

    public static width:number = 960;
    public static height:number = 540;
    public static aspect:number = 0;// = this.width / this.height;
    public static isMobile:boolean = false;
    public static breakpoint:number = 768;

    public static fboWidth:number = null;
    public static fboHeight:number = null;

    public static pixelRatio:number = 1;
    //this.resizeFunc = this.resize.bind(this);

    public static time:number = 0;
    public static delta:number = 0;
    public static renderer:WebGLRenderer;
    public static clock:Clock;

    public static init(){
        this.pixelRatio = 0.75;//window.devicePixelRatio;

        this.resize();

        this.renderer = new WebGLRenderer( {
            antialias: true,
            alpha: false,
        });
        this.renderer.autoClear = false;
        this.renderer.setSize( Stage.width, Stage.height );
        this.renderer.setClearColor( 0x000000 );
        this.renderer.setPixelRatio(this.pixelRatio);

        document.body.append(this.renderer.domElement);

        this.clock = new Clock();
        this.clock.start();
    }


    public static resize(){
        this.width = Stage.width; // document.body.clientWidth;
        this.height = Stage.height;

        this.aspect = this.width / this.height;

        if(this.renderer) this.renderer.setSize(this.width, this.height);
    }


    public static update(){
        this.delta = this.clock.getDelta(); // Math.min(0.01, this.clock.getDelta());
        this.time += this.delta;
    }

}