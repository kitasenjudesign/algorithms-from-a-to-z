import { GUI } from 'lil-gui'
import { Params } from '../../../data/Params';

export class Controls{

    params:any;
    gui:GUI;
    url:string="https://github.com/mnmxmx/fluid-three"

    constructor(params:any){
        this.params = params;
        this.init();
    }

    init(){

        if(Params.debug){
            this.gui = new GUI({width: 300});
            //this.gui.add(this,"url");

            this.gui.add(this.params, "mouse_force",2, 800);
            this.gui.add(this.params, "cursor_size", 1, 120);
            this.gui.add(this.params, "isViscous");
            this.gui.add(this.params, "viscous", 0, 1500);
            this.gui.add(this.params, "iterations_viscous", 1, 32);
            this.gui.add(this.params, "iterations_poisson", 1, 32);
            this.gui.add(this.params, "dt", 1/200, 1/30);
            this.gui.add(this.params, 'BFECC');
            this.gui.close();
        }
        
    }



}