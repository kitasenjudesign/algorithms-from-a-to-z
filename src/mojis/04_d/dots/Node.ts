import p5 from "p5";
import { DifferentialGrothP5 } from "../DifferentialGrothP5";
import { Params } from "../../../data/Params";

//import { p5Main } from "../p5Main";
//import { Params } from "../data/Params";


export class Node {

    position    : p5.Vector;
    velocity    : p5.Vector;
    acceleration: p5.Vector;
    basePos     : p5.Vector;
    separationDistance: number = 20; // 離れる距離

    maxSpeed    : number;
    maxForce    : number;

    connected:boolean=true;
    
    counter:number = 0;
    depth:number = 0; // 深さを保存
    seed:number = 0; // シード値を保存
    numNeighbors:number = 0; // 隣接ノードの数を保存
    nodeIndex:number = -1; // ノードのインデックスを保存
    skip:boolean = false; // スキップフラグ
    p5: p5;

    radius: number = 5; // ノードの半径
    isOriginal:boolean = false; // オリジナルノードかどうか


    constructor(
      p5:p5, x:number, y:number,
      connected:boolean = true, nodeIndex:number = -1, isOriginal:boolean=true
    ) {


        this.isOriginal = isOriginal;
        this.nodeIndex = nodeIndex; // ノードのインデックスを保存
        this.connected = connected;

        //console.log(p5);
        this.p5 = p5;
        //this.p5         = DifferentialGrothP5._p5; // p5インスタンスを取得
        this.position   = this.p5.createVector(x, y);
        this.basePos    = this.p5.createVector(x, y);
        this.velocity   = this.p5.createVector(0, 0);
        this.acceleration = this.p5.createVector(0, 0);
      
        this.maxSpeed = Params.maxSpeed;//Math.random();
        this.maxForce = Params.maxForce;//Math.random();

        this.counter = 0;//Math.floor(Math.random()*50);
        this.radius = 5 + 20 * Math.random(); // ランダムな半径を設定

        this.seed = Math.floor(Math.random() * 1000); // ランダムなシード値を設定
        //this.skip = Math.random() < 0.9; // 10%の確率でスキップフラグを立てる
    }
    
    /**
     * ここで計算
     * @param nodes 
     * @param neighbors 
     */
        update(nodes:Node[], neighbors:Node[], sameIndexNodes:Node[]) {

          let detail = Params.randomness;
          let amp     = Params.randomStrength 
            * this.p5.noise(this.position.x * detail, this.position.y * detail,199);
          let rad     = 4*3.14*this.p5.noise(this.position.y * detail,
              this.position.x * detail,999);
          let vx = amp * Math.cos(rad);
          let vy = amp * Math.sin(rad);            
          
          
          this.position.x += vx;
          this.position.y += vy;
          
        
          this.counter++;

          let separation = this.separation(neighbors);//離れる
          let cohesion = this.cohesion(sameIndexNodes);//集まる!!!!

          this.acceleration.add(separation);//離れる
          this.acceleration.add(cohesion);//近づく
  
          //this.checkBorders();
          this.velocity.add(this.acceleration);
          this.velocity.limit(this.maxSpeed);
          this.position.add(this.velocity);
          this.acceleration.mult(0);

          

        }


    //集まる
    cohesion(nodes:Node[]) {

      let steering = this.p5.createVector();
      let total = 0;
      
      //前後のドットが繋がる
      let thisIndex = nodes.indexOf(this);
      let nextIndex = (thisIndex + 1);
      let prevIndex = (thisIndex - 1);

      nextIndex = nextIndex % nodes.length; // 次のノードのインデックス
      prevIndex = (prevIndex + nodes.length) % nodes.length; // 前のノ

      //if(nodes[nextIndex].connected){
        steering.add(nodes[nextIndex].position);//前
        total += 1;
      //}
      //if(nodes[prevIndex].connected){
        steering.add(nodes[prevIndex].position);//次
        total += 1;
      //}
      
      if (total > 0) {
        steering.div(total);
        steering.sub(this.position);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
      }
      
      return steering;
      
    }
    

    //離れる
    separation(neighbors:Node[]) {
      let steering = this.p5.createVector();
      let total = 0;
      
      //近所で
      for (let i=0; i<neighbors.length; i++) {
        let distance = this.p5.dist(this.position.x, this.position.y, neighbors[i].position.x, neighbors[i].position.y); 
        
        
        //ある距離より近かったら離れる
        if (this != neighbors[i] && distance < this.separationDistance) {
          let diff = p5.Vector.sub(this.position, neighbors[i].position);
          diff.div(distance * distance);
          steering.add(diff);
          total += 1;
        }
      }
      this.numNeighbors = total; // 隣接ノードの数を更新
      
      if (total > 0) {
        steering.div(total);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
      }
      
      return steering;
    }
    
    checkBorders() {
      
        //check

    let margin = 5;
      let left = margin;
      let right = this.p5.width - margin;
      let top = margin;
      let bottom = this.p5.height - margin;
      
      if (this.position.x > right) {
        this.position.x = right;
        this.velocity.x *= -1;
      } else if (this.position.x < left) {
        this.position.x = left;
        this.velocity.x *= -1;
      }
      
      if (this.position.y > bottom) {
        this.position.y = bottom;
        this.velocity.y *= -1;
      } else if (this.position.y < top) {
        this.position.y = top;
        this.velocity.y *= -1;
      }
    }
    
    
    
    display() {
        //let p5 = DifferentialGrothP5._p5;
        //p5.fill(0);
        //p5.ellipse(this.position.x, this.position.y, this.radius, this.radius);
    }
  }