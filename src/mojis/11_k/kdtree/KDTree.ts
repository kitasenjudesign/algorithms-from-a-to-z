import p5 from "p5";
import { KDTreeData } from "./KDTreeData";
import gsap, { Power2, Power4 } from "gsap";
import { Stage } from "../../../data/Stage";

export class KDTree{

    public static WIDTH:number = 960;
    public static HEIGHT:number = 540;

    public _tree:KDTreeData = null;
    private tgt:number = 0;
    private count:number = 0;
    public static maxDepth:number = 15;

    constructor(maxDepth:number=15,data:KDTreeData=null){

        KDTree.maxDepth = maxDepth;
        KDTree.WIDTH = Stage.width;
        KDTree.HEIGHT = Stage.height;

        if(data==null){
            this._tree = new KDTreeData(null);
        }else{
            this._tree = data;//new KDTreeData(null);
        } 
                   
    }

   


    /**
     * topから下に向かって、ランダムに分割していく
     * @param tgt 
     */
    tweenRectsFromTop(tgt:KDTreeData=null,duration:number=1,delay:number=1){

        if(tgt==null){
            tgt = this._tree;            
            let list = tgt.getAllChildren();
            for(let i=0;i<list.length;i++){
                let child = list[i];
                child.topdown = true;
                child.ratio = Math.random()>0.5?1:0;
                
                child.ox = (Math.random()-0.5)*50;
                child.oy = (Math.random()-0.5)*50;
            }
        }

        //動き
        gsap.to(tgt,{
            ratio:Math.random()*0.5+0.25,//tgt
            duration: duration
        });

        //おくれて
        gsap.delayedCall(delay,()=>{
            if(tgt.children && tgt.children.length==2){
                if(tgt.depth>3 && Math.random()<0.7){
                    if(Math.random()<0.5){
                        this.tweenRectsFromTop(tgt.children[0],duration,duration*3);
                        //tgt.children[1].isLast = true;
                    }else{
                        this.tweenRectsFromTop(tgt.children[1],duration,duration);
                        //tgt.children[0].isLast = true
                    }    
                }else{
                    if(tgt.depth<=3 || Math.random()<0.2){
                        this.tweenRectsFromTop(tgt.children[0],duration);
                        this.tweenRectsFromTop(tgt.children[1],duration);    
                    }else{
                        this.tweenRectsFromTop(tgt.children[0],duration,duration*2);
                        this.tweenRectsFromTop(tgt.children[1],duration,duration*3);    
                    }
                }
            }
        });
        
    }

    setColor(rr:number, gg:number, bb:number, aa:number){

        let list = this._tree.getAllChildren();
        for(let i=0;i<list.length;i++){
            let child = list[i];
            child.rr = rr;
            child.gg = gg;
            child.bb = bb;
            child.aa = aa;
        }

    }

    blinkRects(duration:number=1){
        let list = this._tree.getAllBottoms();
        for(let i=0;i<list.length;i++){
            let child = list[i];
            
            gsap.delayedCall(duration*Math.random(),()=>{
                let rr = child.rr;
                let gg = child.gg;
                let bb = child.bb;
                child.rr = 255;
                child.gg = 255;
                child.bb = 255;
                gsap.to(child,{
                    rr:rr,
                    gg:gg,
                    bb:bb,
                    duration: 0.5,
                    ease: "power2.inOut"
                });
    
            });
        }
    }

    breakRects(){

        console.log("breakRects");
        let list = this._tree.getAllBottoms();
        for(let i=0;i<list.length;i++){
            let child = list[i];

            gsap.to(child,{
                oy:child.oy-KDTree.HEIGHT-200,
                or:4*Math.PI*(Math.random()-0.5),
                delay: Math.random()*6,
                duration: 4,
                ease: "power2.inOut"
            });
        }

    }


    setRandomBottom(){
        let list = this._tree.getAllChildren();
        for(let i=0;i<list.length;i++){
            let child = list[i];
            child.topdown = true;
            child.ratio=Math.random();
        }
        this._tree.setRandomBottom();
        
    }

    calcWeight(){
        let list = this._tree.getAllChildren();
        for(let i=0;i<list.length;i++){
            let child = list[i];
            child.calcWeight();//calc
        }
    }

    flag:boolean = false;

    addImpuse2(){

        console.log("addImpuse2");
        let list = this._tree.getAllChildren();
        for(let i=0;i<list.length;i++){
            let child = list[i];
            child.topdown = false;
        }

        let bottoms = this._tree.getAllBottoms();
        let tgt = Math.floor(bottoms.length*Math.random());


        this.flag=!this.flag;//Math.random()>0.5;


        for(let i=0;i<bottoms.length;i++){
            //bottoms[i].or = Math.PI*(Math.random()-0.5);
            //bottoms[i].oy = 1100*(Math.random()-0.5);
            bottoms[i].topdown = false;
        
            let ww =bottoms[i].weight2;
//            console.log("ww",bottoms[i].weight2,ww);
            //bottoms[i].or = 0.5*Math.PI*(Math.random()-0.5);

            if(i==tgt){
                
                let rrr = 255;//bottoms[i].rr;
                let ggg = 0;//bottoms[i].gg;
                let bbb = 0;//bottoms[i].bb;
                
                bottoms[i].rr = 255;
                bottoms[i].gg = 0;
                bottoms[i].bb = 0;
                bottoms[i].fill = 0;
                
                gsap.to(bottoms[i],{
                    //rr:rrr,
                    //gg:ggg,
                    //bb:bbb,
                    fill:1,
                    duration: 1,
                    ease: Power2.easeInOut
                });
                gsap.to(bottoms[i],{
                    oy:0,
                    or:0,
                    weight:11,
                    duration: 2
                });        
            }else{
                /*
                let www = Math.random()<0.5 ? 0.01 : 0.05;
                gsap.to(bottoms[i],{
                    oy:0,
                    or:0,
                    weight:www,//0.05*Math.random(),//ww*0.1,//bottoms[i].weight,
                    duration: 1+Math.random()
                });*/
            }

        }

    }


    //addImpulse2(power:number,rr:number, gg:number, bb:number):KDTreeData{
    addRandom(){

        let bottoms = this._tree.getAllBottoms();
        this.count++

        if(this.count%2==0){
            for(let i=0;i<bottoms.length;i++){
                let child = bottoms[i];
                let ww = i%16==0 ? 1 : 0;
                gsap.to(child,{
                    weight:ww,
                    duration: 0.25+0.25*Math.random(),
                    ease: "power2.inOut"
                });
            }   
        }else{
            for(let i=0;i<bottoms.length;i++){
                let child = bottoms[i];
                let ww = Math.random()<0.2 ? 1 : 0;
                gsap.to(child,{
                    weight:ww,
                    duration: 0.25+0.25*Math.random(),
                    ease: "power2.inOut"
                });
            }   
        }
 


    }

    //}
    addImpulse(
        power:number,rr:number, gg:number, bb:number,changeW:boolean=false):KDTreeData{  

        //this.tgt+=Math.floor(1+10* Math.random());
        let bottoms = this._tree.getAllBottoms();
        //this.tgt%=KDTreeData.deepChildren.length;//Math.floor(KDTreeData.deepChildren.length*Math.random());
        this.tgt=Math.floor(bottoms.length*Math.random());
        bottoms[this.tgt].rr=rr;
        bottoms[this.tgt].gg=gg;
        bottoms[this.tgt].bb=bb;
        bottoms[this.tgt].fill = 0;
        

        if(changeW){
            gsap.to(bottoms[this.tgt],{
                weight:bottoms[this.tgt].weight+0.5+power*Math.random(),
                duration: 0.2
            });
            /*
            gsap.to(KDTreeData.deepChildren[this.tgt],{
                weight:0.5,
                duration: 0.5,
                delay: 0.21
            }); */         
        }

        /*
            gsap.to(bottoms[this.tgt],{
                //weight:0.5,
                delay: 0.3,
                rr:0,
                gg:0,
                bb:0,            
                duration: 1
            });*/

        //}

        return bottoms[this.tgt];

    }


    draw(x:number, y:number, w:number, h:number, p5:p5){

        this._tree.draw(x, y, w, h, p5);
        
    }



}