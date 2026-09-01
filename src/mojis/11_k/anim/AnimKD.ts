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
    private _sprite!: p5.Graphics;
    //private _tree:KDTree;
    private _strokeColor:string = "#fff";
    private _bgColor:string = "#000";

    constructor(p5:p5){
       this._p5 = p5;
       this._graphics = p5.createGraphics(this._p5.width,this._p5.height);
       this._graphics.noSmooth();
    }

    start(font:p5.Font, letter:string){

        console.log("kdtree");

            this._sprite = this.createTextSprite(font, letter);

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

            this.update();

            this.setCol();
 
            this.animLoop();

            if(Params.debug){
                Params.gui.add(this,"test1");
                Params.gui.add(this,"test2");
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
                ease: flag ? "elastic.out(1,0.4)" : "linear"
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
  

    

    //フォントから文字の形をぴったりのサイズの小さいグラフィックに焼き込み、
    //あとで画面いっぱいに拡大して貼る(noSmoothなのでkd.pngの時と同じくブロック状に荒れる)
    private createTextSprite(font:p5.Font, letter:string): p5.Graphics{

        const size = 8;
        const bounds = font.textBounds(letter, 0, 0, size) as {x:number,y:number,w:number,h:number};

        const w = Math.max(1, Math.ceil(bounds.w));
        const h = Math.max(1, Math.ceil(bounds.h));

        const g = this._p5.createGraphics(w, h);
        g.noSmooth();
        g.background(0);
        g.noStroke();
        g.fill(255);
        g.textFont(font);
        g.textSize(size);
        g.text(letter, -bounds.x, -bounds.y);

        return g;

    }

    update(){

        this._graphics.image(this._sprite,0,0,this._p5.width,this._p5.height);

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
