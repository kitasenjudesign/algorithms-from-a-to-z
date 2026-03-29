import p5 from "p5";
import { QuadTree } from "./Quadtree";
//import { p5Main } from "../p5Main";
import { Node } from "./Node";
import { Circle } from "./Circle";
import { Rect } from "./Rect";
import { Point } from "./Point";
import { Params } from "../../../data/Params";
import { DifferentialGrothP5 } from "../DifferentialGrothP5";
//import { Params } from "../data/Params";

export class DotsMain {


    nodes:Node[] = [];
    nodesList:Node[][] = [];

    num:number = 10;
    r:number = 100;
    insertDistance:number = 5;//5; 
    separationDistance:number = 15;//10;//5//10 * 2;
    margin:number = 30;
    MAX_POINTS:number = 15000;
    
    quadtree: QuadTree;
    boundary: Rect; 
    capacity:number = 10;

    pastX:number = 0;
    pastY:number = 0;
    isUpdate:boolean = true;
    isFill:boolean = true;

    frameCount:number = 0;

    p5: p5;
    //https://lil-gui.georgealways.com/#

    public colors:string[] = [
        '#ffffff',
        '#000000',
    ];


//以下でいけた


    constructor(){

    }

    init(p5:p5) {
      
        console.log("init");

        this.p5 = p5;

        this.boundary = new Rect(
            this.p5.width/2, this.p5.height/2, this.p5.width/2, this.p5.height/2
        );
        this.quadtree = new QuadTree(
            this.boundary, this.capacity
        );
      
        Params.gui.add(this,"insertDistance",5,30).listen();
        Params.gui.add(this,"separationDistance",5,30).listen();

        Params.gui.add(this,"isUpdate").listen();
        Params.gui.add(this,"isFill").listen();
        //Params.gui.add(this.nodes,"length").listen();

        Params.gui.addColor(this.colors,"0").listen();
        Params.gui.addColor(this.colors,"1").listen();
    }
    
    reset(){
        this.nodes.length = 0;
        this.nodesList.length = 0;
        this.pastX = 0;
        this.pastY = 0;
        this.quadtree.clearQuadtree();
        this.quadtree.boundary = new Rect(
            this.p5.width/2, this.p5.height/2, this.p5.width/2, this.p5.height/2
        );
        
        console.log("reset");
    }

    update(){
      
        this.frameCount++;

        //this.p5.stroke(255);
        
        if(this.p5.mouseIsPressed) {
            //this.p5.fill(255, 255, 255, 255);
        }else{
            this.p5.noFill();
        }        
        
        if(!Params.mouseMode) this.p5.circle(this.p5.mouseX, this.p5.mouseY, Params.mouseDistance*2);
        
        this.prepareQuadtree();  
        this.drawLines();       //表示のみ
        this.updateNodeList();  

        if(this.isUpdate ) {
            if(Params.mouseMode || this.p5.mouseIsPressed){
                this.updateMotion(
                    this.p5.mouseX,
                    this.p5.mouseY
                );    
            }
        }

        //this.p5.text("l="+this.nodes.length,20,20);
    }   
    
    addNode(x:number, y:number,connected:boolean,nodeIndex:number) {

        if (this.nodes.length < this.MAX_POINTS) {

            let distance = this.p5.dist(x, y, this.pastX, this.pastY);
            if (distance > this.insertDistance) {
                this.nodes.push(
                    new Node(this.p5,x, y, connected, nodeIndex)
                );
                this.pastX = x;
                this.pastY = y;    
                //console.log("addNode",this.nodes.length);
            }
           
        } else {
            console.log("Max Points Reached");
        }

    }


    removeNode(index:number=-1) {

        if(this.nodes.length==0)return;

        if(index==-1){

            let idx = Math.floor(Math.random() * this.nodes.length);
            this.nodes.splice(idx, 1);
            
        }else{
            this.nodes.splice(index, 1);

        }

    }

    setRandom(){

        for(let i=0;i<this.nodes.length;i++){
            let node = this.nodes[i];

            
//            node.position.x = Math.floor(node.position.x / 10)*10;
//            node.position.y = Math.floor(node.position.y / 10)*10;

            let dx =             this.p5.noise(
                node.position.x * 0.01, 
                node.position.y * 0.01,
                999+this.frameCount
            );
            let dy =             this.p5.noise(
                node.position.x * 0.01, 
                node.position.y * 0.01,
                1999+this.frameCount
            );

            if(dx>0.5){
                node.position.x += 300*(dx-0.5);
                node.position.y += 300*(dy-0.5);
                node.skip = true; // スキップフラグを立てる
            }

        }

    }

    //nodeごとにセットする
    updateNodeList(){

        this.nodesList = [];
        for(let i=0; i<this.nodes.length; i++) {
            let nodeIndex = this.nodes[i].nodeIndex;
            if(this.nodesList[nodeIndex]==null){
                this.nodesList[nodeIndex] = []
            }
            this.nodesList[nodeIndex].push(
                this.nodes[i]
            );
        }
        for(let i=0; i<this.nodesList.length; i++) {
            let list = this.nodesList[i];
            if(list==null)continue;
            for(let j=0; j<list.length; j++) {
                list[j].connected = j==list.length - 1 ? false : true;
            }
                
        }


    }

    

    prepareQuadtree(){
        this.quadtree.clearQuadtree();        
        for (let i=0; i<this.nodes.length; i++) {
          let p = new Point(
              this.nodes[i].position.x,this.nodes[i].position.y,this.nodes[i]
          );
          this.quadtree.insert(p);
        }

    }

    drawLines(){

        if(this.isFill){
            
            let colors = [
                100
                //this.p5.color(this.colors[0]),
                //this.p5.color(this.colors[1])                   
            ];

//            this.p5.noStroke();
            this.p5.stroke(DifferentialGrothP5.strokeColor);
            this.p5.fill(DifferentialGrothP5.fillColor);
            let skip = 2;
            //this.p5.stroke(255,255,255);//this.p5.color(this.colors[1])); // 線の色
            for (let i=0; i<this.nodesList.length; i++) {
                let list = this.nodesList[i];//
                if(list==null)continue;

                //this.p5.beginShape(); // 領域の描画開始
                //this.p5.fill(colors[i % colors.length]); // 塗りつぶしの色を設定
                for (let j=0; j<list.length; j+=skip) {
                    let n1 = list[j].position;                
//                    this.p5.vertex(n1.x, n1.y);
                    //this.p5.curveVertex(n1.x,n1.y);
                    
                    this.p5.circle(n1.x,n1.y,this.separationDistance/2);
                    //if(j==list.length-1) this.p5.circle(n1.x, n1.y, 15);
//                    if( !list[j].connected ) this.p5.ellipse(n1.x, n1.y, 15,15);


                    if(Params.debugText){
                        //this.p5.text(""+list[j].nodeIndex, n1.x, n1.y);
                    }
                }
                //this.p5.endShape(); // 領域を閉じて描画終了

                //this.p5.endShape(this.p5.CLOSE); // 領域を閉じて描画終了

            }

        }
        
        //塗りに変えよう


        
        for (let i=0; i<this.nodesList.length; i++) {
            let list = this.nodesList[i];
            if(list==null)continue;

            //if(i==0) this.p5.stroke(0, 0, 0, 255); // 線の色 (RGBA)
            //else this.p5.stroke(0, 0, 255, 255); // 線の色 (RGBA)                

            for (let j=0; j<list.length; j++) {
                let n1 = list[j].position;
                let n2 = list[(j+1) % list.length].position;
                                
                //this.p5.line(n1.x, n1.y, n2.x, n2.y);
                if(Params.debugText){
                    if(j%4==0)this.p5.text(""+list[j].nodeIndex, n1.x, n1.y);
                }
            }
        }

    }

    updateMotion(mouseX:number, mouseY:number) {

        for (let i=0; i<this.nodes.length; i++) {

            let dx = mouseX - this.nodes[i].position.x;
            let dy = mouseY - this.nodes[i].position.y;
            let dist = (dx * dx + dy * dy);
            
            if(!Params.mouseMode && dist > Params.mouseDistance * Params.mouseDistance){
                continue;
            }

            //近所を取得する
            let range = new Circle(
                this.nodes[i].position.x,
                this.nodes[i].position.y,
                this.separationDistance
            );
            let neighbors:Node[] = [];
            this.quadtree.query(range, neighbors);
            this.nodes[i].update(
                this.nodes,
                neighbors,
                this.nodesList[this.nodes[i].nodeIndex]
            );
        }

        if (this.nodes.length < this.MAX_POINTS) {

            if(this.p5.frameCount%2==0)this.insert();

        } else {
            
            //this.p5.noLoop();
            //console.log("Max Points Reached");
        }

    }



    //insertチェック
    insert() {

        //indexで、
        for (let i=0; i<this.nodes.length; i++) {

            let n1 = this.nodes[i].position;//N1
            
            if(this.nodes[i].skip ) continue; // スキップフラグが立っている場合はスキップ
            if(i+1>= this.nodes.length)return;
            if(this.nodes[i+1].skip ) continue; // スキップフラグが立っている場合はスキップ
            
            if(this.nodes[i+1].connected == false) continue;
            if(this.nodes[i].connected == false) continue;

            let n2 = this.nodes[i+1].position;//N2
            let diff = p5.Vector.sub(n2, n1);

            
            if (diff.mag() > this.insertDistance) {
                diff.mult(0.5);                    
                let insertIndex = (i+1) % this.nodes.length;
                let node = new Node(
                    this.p5,n1.x + diff.x, n1.y + diff.y,true,-1,false
                );//new 
                //node.counter=this.nodes[i].counter;
                node.seed = this.nodes[i].seed;
                node.nodeIndex = this.nodes[i].nodeIndex;
                //node.velocity.x = 0.5*(this.nodes[i].velocity.x+this.nodes[i+1].velocity.x);
                //node.velocity.y = 0.5*(this.nodes[i].velocity.y+this.nodes[i+1].velocity.y);

                this.nodes.splice(
                    insertIndex, 0, node
                );   
            }
    
            
        }
    }


}