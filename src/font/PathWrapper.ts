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

    // shoelace formula: sign tells winding direction (CW vs CCW), magnitude is used to find the outermost contour
    private signedArea(pts:number[][]):number{
        let area = 0;
        for(let i=0;i<pts.length;i++){
            const [x1,y1] = pts[i];
            const [x2,y2] = pts[(i+1)%pts.length];
            area += x1*y2 - x2*y1;
        }
        return area/2;
    }

    // ray casting point-in-polygon test, used to find which outer contour a hole belongs to
    private pointInPolygon(pt:number[], poly:number[][]):boolean{
        let inside = false;
        for(let i=0, j=poly.length-1; i<poly.length; j=i++){
            const [xi,yi] = poly[i];
            const [xj,yj] = poly[j];
            const intersect = ((yi>pt[1]) !== (yj>pt[1])) && (pt[0] < (xj-xi)*(pt[1]-yi)/(yj-yi)+xi);
            if(intersect) inside = !inside;
        }
        return inside;
    }

    draw(p5:p5|p5.Graphics,width:number,height:number,scale:number=1,ox:number=0,oy:number=0,tgtStroke:number=-1){

        let s = this.getStrokes();
        let scl = scale;
        let rect = this.getRect();
        let lim = 400;

        const sample = (idx:number):number[][] => {
            const pts:number[][] = [];
            for(let j=0;j<=lim;j++){
                let p = s[idx].pointAt(j/lim);
                let xx = (p.x-rect.x - rect.width/2)*scl + width/2+ox;
                let yy = (p.y-rect.y - rect.height/2)*scl + height/2+oy;
                pts.push([xx,yy]);
            }
            return pts;
        };

        // a single requested stroke: draw it as-is, no outer/hole grouping needed
        if(tgtStroke != -1){
            if(!s[tgtStroke]) return;
            p5.beginShape();
            for(const [xx,yy] of sample(tgtStroke)) p5.vertex(xx,yy);
            p5.endShape();
            return;
        }

        const data = s.map((_,i)=>sample(i));

        // like a font outline: contours winding the same way as the biggest one are outer boundaries,
        // contours winding the opposite way are holes cut out of an outer boundary
        const areas = data.map(pts => this.signedArea(pts));
        let refIdx = 0;
        for(let i=1;i<areas.length;i++){
            if(Math.abs(areas[i]) > Math.abs(areas[refIdx])) refIdx = i;
        }
        const refSign = Math.sign(areas[refIdx]) || 1;
        const isHole = areas.map(a => a !== 0 && Math.sign(a) !== refSign);

        const outerIdx = data.map((_,i)=>i).filter(i=>!isHole[i]);
        const holesOf:number[][] = outerIdx.map(()=>[]);

        for(let i=0;i<data.length;i++){
            if(!isHole[i]) continue;

            // assign the hole to the smallest outer contour that contains it
            let parent = -1;
            let parentArea = Infinity;
            for(const oIdx of outerIdx){
                const a = Math.abs(areas[oIdx]);
                if(a < parentArea && this.pointInPolygon(data[i][0], data[oIdx])){
                    parent = oIdx;
                    parentArea = a;
                }
            }

            if(parent === -1){
                // no enclosing contour found (shouldn't normally happen) - draw it as its own shape
                outerIdx.push(i);
                holesOf.push([]);
            }else{
                holesOf[outerIdx.indexOf(parent)].push(i);
            }
        }

        for(let k=0;k<outerIdx.length;k++){
            p5.beginShape();
            for(const [xx,yy] of data[outerIdx[k]]) p5.vertex(xx,yy);
            for(const hIdx of holesOf[k]){
                p5.beginContour();
                for(const [xx,yy] of data[hIdx]) p5.vertex(xx,yy);
                p5.endContour();
            }
            p5.endShape(p5.CLOSE);
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