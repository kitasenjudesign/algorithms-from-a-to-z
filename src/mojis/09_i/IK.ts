import p5 from "p5";
import { WorkBase } from "../00_base/WorkBase";
import gsap from "gsap";
import { Stage } from "../../data/Stage";

export class IK {

    private _points: { x: number, y: number }[] = [];
    private _currentPos: { x: number, y: number }[] = [];
    private _basePos : { x: number, y: number }[] = [];
    private _lengths: number[] = [];
    private _totalLength: number = 0;
    private _fixBase: boolean = true; // whether joint 0 is fixed

    private _targetX: number = 0;
    private _targetY: number = 0;
    private _isIk:boolean=false;
    private _delay:number = 0;

    constructor() {
          
    }

    init(points:{x:number, y:number}[], fixBase: boolean = true){
        if(!points || points.length === 0) return;
        // clone
        this._points = points.map(p=>({x:p.x,y:p.y}));
        this._fixBase = fixBase;
    // compute segment lengths
        this._lengths = [];
        this._totalLength = 0;
        for(let i=0;i<this._points.length-1;i++){
            const a = this._points[i];
            const b = this._points[i+1];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const L = Math.hypot(dx,dy);
            this._lengths.push(L);
            this._totalLength += L;
        }

        this._targetX=Stage.width*Math.random();
        this._targetY=Stage.height*Math.random();

        this._currentPos=[];
        this._basePos=[];
        for(let i=0;i<this._points.length;i++){
            this._currentPos.push({x:this._points[i].x,y:this._points[i].y});
            this._basePos.push({x:this._points[i].x,y:this._points[i].y});
        }
    // no fixed base: leave points as given

    }

    startMove(delay:number=-1){

        if(delay!=-1)this._delay=delay;

        this._targetX=this._points[this._points.length-1].x;
        this._targetY=this._points[this._points.length-1].y;

        gsap.delayedCall(1,()=>{
            this._isIk=true;
        });
        
        for(let i=0;i<2;i++){
            gsap.to(this,{
                delay:1+delay+i*2,
                duration:1,
                _targetX:Stage.width*Math.random(),
                _targetY:Stage.height*Math.random(),            
            });
        }

        gsap.to(this,{
            delay:6+delay,
            duration:1,
            _targetX:this._basePos[this._basePos.length-1].x,
            _targetY:this._basePos[this._basePos.length-1].y           
        });

        
        for(let i=0;i<this._points.length;i++){
            gsap.to(this._points[i],{
                duration:1,
                delay:delay+7+i*0.02,
                x:this._basePos[i].x,
                y:this._basePos[i].y,
                onStart:()=>{
                    this._isIk=false;
                }
            });
        }

        
        gsap.delayedCall(10,()=>{
            this.startMove(this._delay);
        })

    }

    draw(p5:p5){

        if(!p5) return;
        if(!this._points || this._points.length < 2) return;

        // run FABRIK solver to move chain toward target while keeping base fixed
        if(this._isIk){
            this.solveFABRIK({x:this._targetX,y:this._targetY}, 10, 0.5);
        }

        for(let i=0;i<this._currentPos.length;i++){

            this._currentPos[i].x+=(this._points[i].x - this._currentPos[i].x) / 2.5;
            this._currentPos[i].y+=(this._points[i].y - this._currentPos[i].y) / 2.5;

        }

        // draw chain
        p5.push();
        p5.stroke(255);
        //p5.strokeWeight(2);

        for(let i=0;i<this._currentPos.length-1;i++){
            const a = this._currentPos[i];
            const b = this._currentPos[i+1];
            p5.line(a.x, a.y, b.x, b.y);
        }
        // joints
        p5.fill(255,0,0);
        for(let i=0;i<this._currentPos.length;i++){
            const p = this._currentPos[i];
            if(i===0) p5.fill(0,255,0);
            else p5.fill(255,0,0);
            p5.noStroke();
            //p5.circle(p.x, p.y, 6);
        }
        p5.pop();

    }


    private solveFABRIK(target:{x:number,y:number}, maxIter:number=10, tol:number=0.5){
        const pts = this._points;
        const n = pts.length;
        if(n < 2) return;
        // check reachability relative to first joint (fixed or current)
        const origin = this._fixBase ? { x: this._basePos[0].x, y: this._basePos[0].y } : { x: pts[0].x, y: pts[0].y };

        // iterative forward-backward
        let b0x = pts[0].x, b0y = pts[0].y;
        let diff = Math.hypot(pts[n-1].x - target.x, pts[n-1].y - target.y);
        let iter = 0;
        while(diff > tol && iter < maxIter){
            // backward: set end to target
            pts[n-1].x = target.x; pts[n-1].y = target.y;
            for(let i=n-2;i>=0;i--){
                const r = Math.hypot(pts[i+1].x - pts[i].x, pts[i+1].y - pts[i].y);
                if(r === 0) continue;
                const lambda = this._lengths[i] / r;
                pts[i].x = (1 - lambda) * pts[i+1].x + lambda * pts[i].x;
                pts[i].y = (1 - lambda) * pts[i+1].y + lambda * pts[i].y;
            }
            // forward: if base is fixed, restore it first
            if(this._fixBase){
                pts[0].x = this._basePos[0].x; pts[0].y = this._basePos[0].y;
            }
            for(let i=0;i<n-1;i++){
                const r = Math.hypot(pts[i+1].x - pts[i].x, pts[i+1].y - pts[i].y);
                if(r === 0) continue;
                const lambda = this._lengths[i] / r;
                pts[i+1].x = (1 - lambda) * pts[i].x + lambda * pts[i+1].x;
                pts[i+1].y = (1 - lambda) * pts[i].y + lambda * pts[i+1].y;
            }

            diff = Math.hypot(pts[n-1].x - target.x, pts[n-1].y - target.y);
            iter++;
        }
        // no fixed base: leave pts[0] as is
    }

    getPoints(): {x:number,y:number}[]{
        return this._points.map(p=>({x:p.x,y:p.y}));
    }

}