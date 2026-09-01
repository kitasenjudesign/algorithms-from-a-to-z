import { Vector3 } from "three";
import { VMaker } from "./VMaker";
import { VStick } from "./VStick";
import p5 from "p5";
import { VPoint } from "./VPoint";
import { VStickControl } from "./VStickControl";
import { p5MainV } from "../p5MainV";

export class VMain{

    public sticks   :VStick[]=[];
    public sticksList: VStickControl[] = [];
    public points   :VPoint[]=[];
    public currentPoints:VPoint[];
    public isRec:boolean=false;
    private _pastX:number=0;
    private _pastY:number=0;
    public lengthRatio:number = 1;
    public nobi:number = 0.2;
    public mouse:boolean=true;


    constructor(){
        
        /*
        Params.gui.add(this,"lengthRatio",0.1,5).listen();
        Params.gui.add(this,"nobi",0.1,0.5).listen();
        Params.gui.add(this,"mouse").listen();
        */

    }


    startRec(){
        //rec開始
        this.currentPoints = [];
        this.isRec=true;
        
    }

    updateRec(xx:number,yy:number){    
        let p = new VPoint();
        this.points.push(p);
        p.setPosition(
            xx,yy,0
        );
        p._basePos = new Vector3(
            xx,yy,0
        )
        p.setVelocity(0,0,0);
        
        this.points.push(p);
        this.currentPoints.push(p);
    }

    endRec(){
        
        //rec終了
        this.isRec=false;
        //console.log("len="+this.currentPoint)

        if(!this.currentPoints){
            return;
        }
        if(this.currentPoints.length==0){
            return;
        }


        //let a = new VSticks(this.currentPoints);
        //this.sticksList.push(a);

        //ここで固定
        this.currentPoints[0]._fixed=true;
        this.currentPoints[this.currentPoints.length-1]._fixed=true;

        //一気にstickを生成する
        for(let i=0;i<this.currentPoints.length-1;i++){

            let idxA = i;
            let idxB = i+1;

            if(idxA==idxB) continue;

            var hardness:number = 0.7;// + 0.82 * Math.random();
            var stick:VStick = new VStick( 
                this.currentPoints[idxA], //
                this.currentPoints[idxB],
                hardness
            );
            //add(stick);
            this.sticks.push(stick);

        }


    }

    public makeLines(){

        for(let j=0;j<50;j++){

            let ratio1 = Math.random();
            let ratio2 = Math.random();
            
            let p1 = p5MainV.instance.getPosition(ratio1, j);
            let p2 = p5MainV.instance.getPosition(ratio2, j);
            
            this.currentPoints = [];
            this.isRec=true;

            let num = 30;//２０分割する
                        
            for(let i=0;i<num;i++){
                let r1 = i/(num-1);
                let r2 = 1 - r1;
                let xx = p1.x*r1+p2.x*r2+1*Math.random();
                let yy = p1.y*r1+p2.y*r2+1*Math.random();
                
                let p = new VPoint();
                this.points.push(p);
                p.setPosition(
                    xx,yy,0
                );
                p._basePos = new Vector3(
                    xx,yy,0
                )
                p.setVelocity(0,0,0);
                
                this.points.push(p);
                this.currentPoints.push(p);
            }
            
            this.currentPoints[0]._fixed=true;
            this.currentPoints[this.currentPoints.length-1]._fixed=true;

            let control = new VStickControl(this.currentPoints,ratio1,ratio2);
            this.sticksList.push(control);

            //一気にstickを生成する
            for(let i=0;i<this.currentPoints.length-1;i++){

                let idxA = i;
                let idxB = i+1;

                if(idxA==idxB) continue;

                var hardness:number = 0.7;// + 0.82 * Math.random();
                var stick:VStick = new VStick( 
                    this.currentPoints[idxA], //
                    this.currentPoints[idxB],
                    hardness
                );
                //add(stick);
                this.sticks.push(stick);

            }

        }
       

    }

    


    update(pp:p5){


        if(!this.sticks)return;

        //pp.stroke(0,0,0,128)
        pp.strokeWeight(1);

        for(let i=0;i<this.sticksList.length;i++){
            this.sticksList[i].update(pp,i);
        }

    
        //描画
        for(let i=0;i<this.sticks.length;i++){

            let p1 = this.sticks[i]._p1;
            let p2 = this.sticks[i]._p2;
            
            if(this.sticks[i].visible){
                pp.line(
                    p1.position.x,
                    p1.position.y,
                    p2.position.x,
                    p2.position.y
                );
    
            }
            
        }

        //pp.circle(pp.mouseX,pp.mouseY,110);

        //座標のアップデート
		for (let i=0;i<this.points.length; i++){
				
			var p:VPoint = this.points[i];
			p.update();
			
			var vx:number = p.getVelocityX();
			var vy:number = p.getVelocityY();
			var vz:number = p.getVelocityZ();
			
			var dx	= p._basePos.x - p.position.x;
			var dy	= p._basePos.y - p.position.y;
			var amp	= Math.sqrt(dx*dx+dy*dy);
			

			if(true){
				
                let dx = pp.mouseX-p.position.x;
                let dy = pp.mouseY-p.position.y;
                let dist2 = dx*dx+dy*dy;
                let limit2 = 50*50;
                if(dist2<limit2 && this.mouse){

                    let s = (limit2-dist2)/limit2;
                    p.setVelocity(
                        vx-dx*s*0.1,
                        vy-dy*s*0.1,
                        vz
                    )
                }else{
                    
                    p.setVelocity(
                        vx*0.99,
                        vy*0.99,
                        vz
                    )
                }
                
			}else{
				p.setVelocity(
					vx,
					vy,
					vz
				)
			}
			
		}
		
		for (let i=0;i<this.sticks.length;i++){
			
			this.sticks[i].lengthRatio=this.lengthRatio
			this.sticks[i].update(this.nobi);
			
		}

        for(let i=0;i<this.sticksList.length;i++){
            this.sticksList[i].draw(pp);
        }

		
    }

    reset(){

        this.sticks = [];
        this.points = [];

    }

}