import p5 from "p5";
import { Stroke } from "./Stroke";

export class PathWrapper{

    private path: opentype.Path;
    private strokes: Array<Stroke> = [];

    constructor(path:opentype.Path){
        this.path = path;
        this.splitToStrokes();
    }

    // Split the opentype.Path into continuous strokes.
    // A new Stroke starts at a moveTo ('M') command. All subsequent commands
    // until the next moveTo belong to that stroke. If the first command isn't
    // a moveTo we start a stroke implicitly.
    splitToStrokes(): Stroke[]{
        this.strokes = [];

        console.log("splitToStrokes", this.path);

        const cmds = (this.path as any).commands as Array<any>;
        if(!cmds || cmds.length === 0) return this.strokes;

        let current: Stroke | null = null;

        for(const c of cmds){
            // opentype.js command types use single-letter type like 'M','L','Q','C','Z'
            const t = (c.type || c.cmd || '').toString();

            if(t === 'M' || t === 'm'){
                // start a new stroke
                current = new Stroke([c]);
                this.strokes.push(current);
            } else {
                if(!current){
                    // implicit stroke at beginning
                    current = new Stroke();
                    this.strokes.push(current);
                }
                current.push(c);
            }
        }

        return this.strokes;
    }

    draw(p5:p5|p5.Graphics,width:number,height:number,scale:number=1,ox:number=0,oy:number=0,tgtStroke:number=-1){

        let s = this.getStrokes();
        let scl = scale;
        let rect = this.getRect();

        let data:number[][][] = [];

        let len = s.length;
        for(let i=0;i<len;i++){
            data[i] = [];

            if(tgtStroke != -1 && i != tgtStroke) continue;

            
            p5.beginShape();
            let lim = 400;
            for(let j=0;j<=lim;j++){
                let p = s[i].pointAt(j/lim);
                let xx = (p.x-rect.x - rect.width/2)*scl;
                let yy = (p.y-rect.y - rect.height/2)*scl;
                xx+=width/2+ox;
                yy+=height/2+oy;
                data[i].push([xx,yy]);
                p5.vertex(xx,yy);
            }
            p5.endShape();
            
        }
        

    }

    getPoints(width:number,height:number,scale:number=1,ox:number=0,oy:number=0,numLim:number=100): number[][][]{
       

        let output:{x:number,y:number}[] = []

        let s = this.getStrokes();
        let scl = scale;
        let rect = this.getRect();

        let data:number[][][] = [];
        for(let i=0;i<s.length;i++){

            data[i] = [];
            let lim = numLim;
            for(let j=0;j<=lim;j++){
                let p = s[i].pointAt(j/lim);
                let xx = (p.x-rect.x - rect.width/2)*scl;
                let yy = (p.y-rect.y - rect.height/2)*scl;
                xx+=width/2+ox;
                yy+=height/2+oy;
                data[i].push([xx,yy]);
            }
        }

        return data;

    }

    getPoints2(): {x:number,y:number}[][]{

        let output:{x:number,y:number}[][] = []

        let s = this.getStrokes();
        for(let i=0;i<s.length;i++){
            output.push(s[i].getPoints(2));
        }
        return output;

    }

    getStrokes(): Stroke[]{
        
        return this.strokes.slice();

    }

    getBoundingBox(): {xMin:number, yMin:number, xMax:number, yMax:number}{


        let b = this.path.getBoundingBox();

        return {
            xMin: b.x1,
            yMin: b.y1,
            xMax: b.x2,
            yMax: b.y2
        };

    }

    getRect():{x:number,y:number,width:number,height:number}{

        let b = this.path.getBoundingBox();

        return {
            x: b.x1,
            y: b.y1,
            width: b.x2 - b.x1,
            height: b.y2 - b.y1
        };

    }

    

}