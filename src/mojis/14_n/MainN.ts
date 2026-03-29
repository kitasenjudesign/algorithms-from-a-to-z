import { Common } from './fluid/Common';
import { Mouse } from './fluid/Mouse';
import { Output } from './fluid/Output';

export class MainN{

    output:Output;

    init(){
        //this.props.$wrapper.prepend(Common.renderer.domElement);
        Common.init();
        Mouse.init();

        this.output = new Output();
        this.loop();
    }

    resize(){
        Common.resize();
        this.output.resize();
    }

    render(){
        //console.log("render")
        Mouse.update();
        Common.update();
        this.output.update();
    }

    loop(){
        this.render();
        
        setTimeout(()=>{
            this.loop();
        },1000/60);
        
        //requestAnimationFrame(this.loop.bind(this));

    }

}