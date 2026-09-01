
import p5 from "p5";
import { Circle } from "../04_d/dots/Circle";
import { Point } from "../04_d/dots/Point";
import { QuadTree } from "../04_d/dots/Quadtree";
import { Rect } from "../04_d/dots/Rect";
import { Boid } from "./Boid";
import { p5Base } from "../00_base/p5Base";
import { Params } from "../../data/Params";
import { TitleView } from "../../html/TitleView";
import { Stage } from "../../data/Stage";
import { InfoView } from "../../html/InfoView";


export class BoidsP5 extends p5Base{

    private _boids      :Boid[] = [];
    private _boidCount  :number = 300;
    private _qtCapacity:number = 8;
    
    private _ox:number = 0;
    private _oy:number = 0;
    private _os:number = 0;

    public strokeColor:string = "#ffffffbb";
    public bgColor:string = "#000000";



    constructor(){
        super();
    }

    start(callback:()=>void){
        
        if(Params.color){
            this.strokeColor = "#ffbf00bb"
            this.bgColor = "#180321ff";
        }

        this._callback=callback;
         

        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                this._p5 = p;
                let letter = Params.alphabet;
                if(letter=="") letter = "B";

                console.log("letter = ",letter);
                this.loadFont(letter,()=>{
                    this.setUp(p);
                    
                });
                this._callback();
                
            }
            /** フレームごとの描画処理 */
            p.draw = ()=> {
                this.draw();
            }

            p.mouseClicked = ()=>{
                //this.click();
            }

            p.windowResized = ()=>{
                this.resize();
            }
            
        };
        
        new p5(sketch, document.body);
    }


    setUp(p: p5){
        
       this._p5.createCanvas(
            Stage.width,
            Stage.height
        );
        this._p5.pixelDensity(1);
        this._p5.frameRate(30);
        this._isInitialized=true;
        this.reset();

    }

    onLoad(){


    }

    click(){
        //this.reset();
    }

    reset(){

        this._p5.background(this.bgColor);

        this._boids = [];

        this._ox = (Math.random()-0.5)*300;
        this._oy = (Math.random()-0.5)*300;
        this._os = 7+Math.random()*4;//大きさ
        this._os *= Stage.width/1920;

       let points = this._path.getPoints(
           this._p5.width, this._p5.height, this._os, this._ox, this._oy
       );

        for (let i = 0; i < this._boidCount; i++) {
            //開始位置

            let ppp = points[Math.floor(this._p5.random(points.length))];
            let pp = ppp[Math.floor(this._p5.random(ppp.length))];
            const x = pp[0];
            const y = pp[1];

            this._boids.push(new Boid(this._p5, x, y));
        }

        Params.mojiCenterX = this._ox;
        Params.mojiCenterY = this._oy;

        if(!InfoView.showing){
            TitleView.setCenter(this._ox, this._oy);
        }

    }

    draw(){

        if(!this._isInitialized)return;


        //this._p5.noFill();
        //this._p5.stroke(this.strokeColor);
        //this._p5.fill(255,255,255)

        //開始を遅らせる
        if(this._p5.frameCount>30){        
            this.drawBoids();
        }
        
        this._p5.noFill();
        this._p5.stroke(this.strokeColor);


        if(this._boids[0].count<=1){
            this.drawFont(
                this._p5.width,
                this._p5.height,
                this._os,
                this._ox,
                this._oy
            );
        }
        if(this._boids[0].count>30*11){
            //this.reset();
        }

    }

    drawBoids(){
        


        const boundary = new Rect(
            this._p5.width / 2,
            this._p5.height / 2,
            this._p5.width / 2,
            this._p5.height / 2
        );
        const quadTree = new QuadTree(boundary, this._qtCapacity);
        for (let i = 0; i < this._boids.length; i++) {
            const boid = this._boids[i];
            quadTree.insert(new Point(boid.position.x, boid.position.y, boid));
        }

        for (let i = 0; i < this._boids.length; i++) {
            const boid = this._boids[i];
            const range = new Circle(boid.position.x, boid.position.y, boid.perceptionRadius);
            const neighbors: Boid[] = [];
            quadTree.query(range, neighbors as unknown as any[]);
            boid.flock(neighbors);
        }

        for (let i = 0; i < this._boids.length; i++) {
            const boid = this._boids[i];
            boid.update();
            boid.edges(this._p5.width, this._p5.height);
            boid.draw();
        }        
    }

    resize(){

        if (!this._p5) {
            return;
        }
        this._p5.resizeCanvas(Stage.width, Stage.height);

    }
    
}
