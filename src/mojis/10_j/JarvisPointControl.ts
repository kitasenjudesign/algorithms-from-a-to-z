import gsap from "gsap";
import { Params } from "../../data/Params";
import { JavisPoint } from "./JarvisPoint";
import { JarvisMarchP5 } from "./JarvisMarchP5";

export class JavisPointControl{

    private _points: JavisPoint[] = [];
    private _main: JarvisMarchP5;
    private _flag:boolean = true;
    //public _noiseAmp:number = 0;

    constructor(main:JarvisMarchP5){
        this._main = main;
    

        Params.gui.add(this,"playA");
        Params.gui.add(this,"playB");
        Params.gui.add(this,"playC");
        Params.gui.add(this,"playD");


    }

    public playLoop(){
        //this.playA();
    }

    public setMotion(){

    }

    public setPoints(points: JavisPoint[]) {
        this._points = points;
        
    }

    public loopA(){
        this._flag = !this._flag;
        this.playA();

        gsap.delayedCall(1, () => {
            this.playB();
            
        });

        if(this._flag){
            gsap.delayedCall(3, () => {
                this._main.setFreeMode(true);
            });
        }


        gsap.delayedCall(5, () => {
            
            this.playD();
        });

        if(this._flag){
            gsap.delayedCall(6, () => {
                this._main.setFreeMode(false);
            });
        }

        gsap.delayedCall(8, () => {
            this.playA();

        });        

        gsap.delayedCall(11, () => {
            this.loopA();
        });
    }


    //量を変える
    public playA(){

        console.log("playA");
        
        //this._main.setBlink(255);

        //this._main._noiseAmp = 0;
        gsap.to(this._main, { duration: 1, _noiseAmp: 50 });
        //gsap.to(this._main, { duration: 1, _noiseAmp: 0, delay: 1 });

        for(let i=0;i<this._points.length;i++){
            gsap.to(this._points[i], {
                duration: 2,
                ratio: i%2==0 ? 0.5 : 0,
                ease: "power2.inOut"
            });
        }

    }

    public playB(){
    
        //this._main._noiseAmp = 0;
        //gsap.to(this._main, { duration: 1, _noiseAmp: 50 });
        //gsap.to(this._main, { duration: 1, _noiseAmp: 0, delay: 1 });  
        this._main.setBlink(255);
        let nn = 3;//Math.floor(Math.random()*3+2);

        for(let i=0;i<this._points.length;i++){
            gsap.to(this._points[i], {
                duration: 2,
                ratio: i%nn==0 ? i/this._points.length : 0,
                ease: "power2.inOut"
            });
        }

    }

    public playC(){
        
        this._main.setBlink(255);
        for(let i=0;i<this._points.length;i++){
            gsap.to(this._points[i], {
                duration: 2,
                ratio: i%3==0 ? i/this._points.length : 0,
                ease: "power2.inOut"
            });
        }

    }

    public playD(){

        //this._main.setBlink(255);
        let num = 5;
        let targets:number[] = [];
        for(let i=0;i<num;i++){
            targets.push(i/num);
        }

        for(let i=0;i<this._points.length;i++){
            gsap.to(this._points[i], {
                duration: 2,
                ratio: targets[i%targets.length],
                ease: "power2.inOut"
            });
        }

    }

}