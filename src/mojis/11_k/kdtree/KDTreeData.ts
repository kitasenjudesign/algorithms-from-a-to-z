import p5 from "p5";
import { KDTree } from "./KDTree";
import { Colors } from "../data/Colors";

export class KDTreeData{

    parent:KDTreeData = null;
    children:KDTreeData[] = [];
    weight:number = 0.5;
    weight2:number = 0.5;
    
    depth:number = 0;
    //public static deepChildren:KDTreeData[] = [];

    ratio:number = 0;
    isLast:boolean = false; // Indicates if this node is a leaf node
    topdown:boolean = false;
    rr: number = 235;
    gg: number = 235;
    bb: number = 235;
    aa: number = 0;

    rr2:number = 255;
    gg2:number = 0;
    bb2:number = 255;
    aa2:number = 0;

    ox:number = 0;
    oy:number = 0;
    or:number = 0;

    x:number = 0;
    y:number = 0;
    w:number = 0;
    h:number = 0;

    fill:number = 1;
    offsetColor:number = 0;
    
    constructor(parent:KDTreeData,depth:number = 0){


        //this.ox = (Math.random()-0.5)*100;
        //this.oy = (Math.random()-0.5)*100;

        this.ratio = Math.random() ? 1 : 0; // Randomly set ratio to either 0 or 1

        let colors = Colors.getRandomColor();
        this.rr = colors[0];
        this.gg = colors[1];
        this.bb = colors[2];
        this.aa = colors[3];
        
        colors = Colors.getRandomColor();        
        this.rr2 = colors[0];
        this.gg2 = colors[1];
        this.bb2 = colors[2];
        this.aa2 = colors[3];

        this.parent = parent;
        this.children = [];
        this.weight = 0.5;//Math.random();
        this.depth = depth;
        this.init(depth);

    }

    //無条件に分割する
    init(depth:number){

        if(depth < KDTree.maxDepth){ // Arbitrary depth limit for splitting
            
            let leftChild = this.makeNewTreeData(this,depth+1);//new KDTreeData(this, depth + 1);
            leftChild.parent = this;
            this.children.push(leftChild);

            let rightChild = this.makeNewTreeData(this,depth+1);//new KDTreeData(this, depth + 1);
            rightChild.parent = this;
            this.children.push(rightChild);

        }else{
            
            //KDTreeData.deepChildren.push(this);

        }

    }

    makeNewTreeData(parent:KDTreeData,depth:number):KDTreeData{
        return new KDTreeData(parent, depth);
    }


    calcWeight(){
        this.weight = (this.w * this.h) / (KDTree.WIDTH * KDTree.HEIGHT);
        this.weight2 = (this.w * this.h) / (KDTree.WIDTH * KDTree.HEIGHT);
        console.log("calc" + this.weight2);
        return this.weight;
    }

    getAllChildren():KDTreeData[]{

        let allChildren:KDTreeData[] = [];
        allChildren.push(this);
        if(this.children && this.children.length > 0 || !this.isLast) {
            for(let child of this.children){
                allChildren = allChildren.concat(child.getAllChildren());
            }
        }
        return allChildren;
    }

    getAllBottoms():KDTreeData[]{

        //全部の子供を取得
        let bottoms:KDTreeData[] = [];
        if(!this.children || this.children.length === 0 || this.isLast) {
            bottoms.push(this); // If this node has no children, it is a bottom node
            return bottoms;
        }
        for(let child of this.children){
            bottoms = bottoms.concat(child.getAllBottoms());
        }

        return bottoms; 

    }


    setRandomBottom(tgt:KDTreeData=null):void{

        if(!tgt){
            tgt = this;
        }
        
        if(!tgt.children || tgt.children.length == 0){
            return;
        }

        if(tgt.depth>=3){
            /*
                if(Math.random()<0.5){
                    this.setRandomBottom(tgt.children[0]);
                    tgt.children[0].isLast = false;
                    tgt.children[1].isLast = true;
                }else{
                    this.setRandomBottom(tgt.children[1]);
                    tgt.children[0].isLast = true
                    tgt.children[1].isLast = false;
                }    */
            tgt.children[0].isLast = false;
            tgt.children[1].isLast = false;
            this.setRandomBottom(tgt.children[0]);
            this.setRandomBottom(tgt.children[1]);
            
        }else{
            tgt.children[0].isLast = false;
            tgt.children[1].isLast = false;
            this.setRandomBottom(tgt.children[0]);
            this.setRandomBottom(tgt.children[1]);
        }


    }



    //一番子供の重みを取得する
    getWeight():number{

        if(!this.children || this.children.length === 0 || this.isLast) {
            return this.weight; // Return the weight of this node if it has no children
        }

        let leftWeight = this.children[0].getWeight();
        let rightWeight = this.children[1].getWeight();

        return leftWeight + rightWeight;

    }

    hasChildren():boolean{
        return this.children && this.children.length > 0;
    }


    setMode(topDownMode:boolean){
        this.topdown = topDownMode;
    }

    
    draw(x:number,y:number,w:number,h:number,p5:p5){

        if(!this.hasChildren() || this.isLast){

            /*
            p5.fill(
                this.rr,
                this.gg,
                this.bb,
                128
//                this.aa
            );*/
            
            if(w*h>=1){
                p5.push(); // 現在の座標系を保存

                // 回転の中心を設定
                p5.translate(x + w / 2+this.ox, y + h / 2+this.oy);
        
                // 回転角度を設定 (例: フレーム数に基づいて回転)
                p5.rotate(this.or); // ラジアンで指定
        
                // 色を設定
                //this.fill=0.5
                p5.fill(
                    this.rr+this.offsetColor,
                    this.gg+this.offsetColor,
                    this.bb+this.offsetColor,
                    this.aa
                );//this.aa);
        
                // rect を描画 (中心を基準に描画)
                p5.rect(-w / 2, -h / 2, w* this.fill, h);

                p5.fill(this.rr2, this.gg2, this.bb2, this.aa2);//this.aa);
                p5.rect(
                    -w / 2 + w*this.fill,
                    -h / 2, 
                    w*(1-this.fill), 
                    h
                );
                
                p5.noFill();
                p5.fill(0);
                p5.text(
                    ""+Math.floor(this.w*this.h/1000),
                    0,
                    0
                );
        
                p5.pop(); // 座標系を元に戻す

                
            }

            this.x = x;// + w / 2;
            this.y = y;// + h / 2;
            this.w = w;
            this.h = h;
            
            //console.log("aaaaa")
            //p5.fill(0,0,0,255);
            //p5.textSize(10);
            /*p5.text(
                "L"+this.children.length + " W"+this.weight.toFixed(2),
                
                this.x+this.w/2,this.y+this.h/2);*/
            return;
        }
        
        //weightによって
        let weight1 = this.children[0].getWeight();
        let weight2 = this.children[1].getWeight();
        let ratio = weight1 / (weight1 + weight2);

        if(this.topdown){

            ratio = this.ratio;

        }


        if(this.depth % 2 == 0){
            //横分割
            this.children[0].draw(
                x, 
                y,
                w*ratio,
                h,
                p5
            );
            this.children[1].draw(
                x + w*ratio,
                y, 
                w * (1 - ratio), 
                h, 
                p5
            );            
        }else{
            //縦分割
            this.children[0].draw(
                x, 
                y,
                w,
                h*ratio,
                p5
            );
            this.children[1].draw(
                x,
                y + h*ratio, 
                w, 
                h * (1 - ratio), 
                p5
            );   
            

        }

    }

    setColor(p5:p5.Graphics){

        let color = p5.get(
            this.x+this.w/2,
            this.y+this.h/2
        );
        this.rr = color[0]>50 ? 255 : 0;
        this.gg = color[1]>50 ? 255 : 0;
        this.bb = color[2]>50 ? 255 : 0;
        this.aa = color[3]>50 ? 255 : 0;

    }

    blink(){

        this.offsetColor = 15;
        gsap.to(this,{
            offsetColor:0,
            duration:0.2
        });

    }
    

}