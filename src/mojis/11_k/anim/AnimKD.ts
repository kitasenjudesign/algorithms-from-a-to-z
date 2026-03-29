import p5 from "p5";
import { KDTree } from "../kdtree/KDTree";
import gsap, { Power2 } from "gsap";
//import { SoundManager } from "../sound/SoundManager";
import { Colors } from "../data/Colors";
import { Params } from "../../../data/Params";

export class AnimKD{

    private _kdTree: KDTree;
    private _p5: p5;
    private flag:boolean = false;
    private _graphics: p5.Graphics;
    //private _tree:KDTree;
    private _strokeColor:string = "#fff";
    private _bgColor:string = "#000";

    constructor(p5:p5){
       this._p5 = p5;
       this._graphics = p5.createGraphics(this._p5.width,this._p5.height);
       this._graphics.noSmooth();
    }

    start(img:p5.Image){

        console.log("kdtree");

            //SoundManager.instance.play(32); 
            this._kdTree = new KDTree(8);        
            this._kdTree.setRandomBottom();

            let list = this._kdTree._tree.getAllChildren();
            for(let i=0;i<list.length;i++){
                let child = list[i];
                child.topdown=false;
                child.weight=0.5;
                child.topdown = false;
            }   

            this.update(img);

            this.setCol();
 
            this.animLoop();

            if(Params.debug){
                Params.gui.add(this,"test1");
                Params.gui.add(this,"test2");
                Params.gui.add(this,"test3");
                Params.gui.add(this,"test4");
                Params.gui.add(this,"setCol");
            }

        

    }

    animLoop(){
        
           gsap.delayedCall(1,()=>{
                this.test1();
            });
            /*
            gsap.delayedCall(3,()=>{
                this.test2();
            });
            */
            gsap.delayedCall(5,()=>{
                this.changeToBigSize();
            });
            gsap.delayedCall(9,()=>{
                this.changeToBaseSize();
            });
            gsap.delayedCall(10,()=>{
                this.animLoop();
            });
    }

    setCol(){

        let list = this._kdTree._tree.getAllChildren();
        for(let i=0;i<list.length;i++){
            let child = list[i];
            child.setColor(this._graphics);
        }

    }

    test1(){
        
        let bottoms = this._kdTree._tree.getAllBottoms();
        for(let i=0;i<bottoms.length;i++){

            gsap.to(bottoms[i],{
                delay: i*0.005+Math.random(),
                weight:Math.random()<0.1 ? 5+Math.random() : 0.2+0.2*Math.random(),//ww*0.1,//bottoms[i].weight,
                duration: 1+0.2*Math.random(),
                
                ease: "elastic.out(1,0.8)"
            });

        }

    }

    test2(){
        let bottoms = this._kdTree._tree.getAllBottoms();
        for(let i=0;i<bottoms.length;i++){
            gsap.to(bottoms[i],{
                delay: Math.random(),
                weight:Math.random()<0.1 ? 10 : 3*Math.random(),//ww*0.1,//bottoms[i].weight,
                duration: 0.5,
                ease: "linear",
                
            });
        }
    }    

    changeToBaseSize(){
        let bottoms = this._kdTree._tree.getAllBottoms();
        for(let i=0;i<bottoms.length;i++){
            gsap.to(bottoms[i],{
                delay: 0.2*Math.random(),
                weight:1,//ww*0.1,//bottoms[i].weight,
                duration: 1,
                ease: "elastic.out(1,0.8)"
            });
        }
    }       

    changeToBigSize(){
        let bottoms = this._kdTree._tree.getAllBottoms();


        for(let i=0;i<bottoms.length;i++){
        
            let size:number = 1+Math.random();
            let flag:boolean = false;
            if(bottoms[i].bb>128){
                flag=true;
                size = 5+5*Math.random();
            }
            gsap.to(bottoms[i],{
                delay: i*0.01+Math.random(),
                weight:size,//ww*0.1,//bottoms[i].weight,
                duration: 1,
                ease: flag ? "elastic.out(1,0.5)" : "linear"
            });

        }
    }       





    reset(){
        let bottoms = this._kdTree._tree.getAllBottoms();

        for(let i=0;i<bottoms.length;i++){
            let child = bottoms[i];
            //child.fill=1;
            gsap.to(child,{
                weight:0.5,
                duration:1
            })
        }
    }
  

    

    update(img:p5.Image){

        this._graphics.image(img,0,0,this._p5.width,this._p5.height);

        this._p5.textAlign(this._p5.CENTER,this._p5.CENTER);
        this._p5.textSize(10);
        this._p5.fill(255,255,255,255);
        this._p5.stroke(255/2);
        this._p5.rect(0,0,this._p5.width,this._p5.height);
        this._kdTree.draw(0,0,this._p5.width,this._p5.height,this._p5);

        if(Params.debug){
            this._p5.image(this._graphics,0,100,50,50);
        }
       
    }

}
