import type { PathCommand } from 'opentype.js';

export class Stroke{

    // commands that belong to this continuous stroke
    commands: PathCommand[] = [];

    constructor(commands?: PathCommand[]){
        if(commands) this.commands = commands.slice();
    }

    push(cmd: PathCommand){
        this.commands.push(cmd);
    }

    // Euclidean distance
    private static dist(a:{x:number,y:number}, b:{x:number,y:number}){
        const dx = a.x-b.x; const dy = a.y-b.y;
        return Math.hypot(dx,dy);
    }

    // Evaluate linear interpolation
    private static lerp(a:number,b:number,t:number){ return a + (b-a)*t; }

    // Evaluate cubic Bezier at t (given 4 points)
    private static cubicAt(p0:number,p1:number,p2:number,p3:number,t:number){
        const u = 1-t;
        return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3;
    }

    // Evaluate quadratic Bezier at t (given 3 points)
    private static quadAt(p0:number,p1:number,p2:number,t:number){
        const u = 1-t;
        return u*u*p0 + 2*u*t*p1 + t*t*p2;
    }

    // Approximate length of a bezier curve by recursive subdivision
    private static approxCurveLength(points: {x:number,y:number}[], tol = 0.5){
        // flatness check using chord vs control net
        function recurse(pts:{x:number,y:number}[]): number{
            // chord length
            const chord = Stroke.dist(pts[0], pts[pts.length-1]);
            // control net length
            let net = 0;
            for(let i=0;i<pts.length-1;i++) net += Stroke.dist(pts[i], pts[i+1]);
            if(net - chord <= tol) return (net + chord) / 2;
            // subdivide
            const left: {x:number,y:number}[] = [];
            const right: {x:number,y:number}[] = [];

            // de Casteljau subdivision
            if(pts.length === 3){
                const a = pts[0];
                const b = pts[1];
                const c = pts[2];
                const ab = {x:(a.x+b.x)/2, y:(a.y+b.y)/2};
                const bc = {x:(b.x+c.x)/2, y:(b.y+c.y)/2};
                const abc = {x:(ab.x+bc.x)/2, y:(ab.y+bc.y)/2};
                left.push(a, ab, abc);
                right.push(abc, bc, c);
            } else if(pts.length === 4){
                const a = pts[0], b = pts[1], c = pts[2], d = pts[3];
                const ab = {x:(a.x+b.x)/2, y:(a.y+b.y)/2};
                const bc = {x:(b.x+c.x)/2, y:(b.y+c.y)/2};
                const cd = {x:(c.x+d.x)/2, y:(c.y+d.y)/2};
                const abc = {x:(ab.x+bc.x)/2, y:(ab.y+bc.y)/2};
                const bcd = {x:(bc.x+cd.x)/2, y:(bc.y+cd.y)/2};
                const abcd = {x:(abc.x+bcd.x)/2, y:(abc.y+bcd.y)/2};
                left.push(a, ab, abc, abcd);
                right.push(abcd, bcd, cd, d);
            } else return 0;

            return recurse(left) + recurse(right);
        }

        return recurse(points);
    }

    // returns total length of this stroke (sum of segment lengths)
    length(): number{
        let len = 0;
        let cursor = {x:0,y:0};
        let start = {x:0,y:0};

        for(const c of this.commands){
            const ci: any = c;
            const t = (ci.type || ci.cmd || '').toString();
            if(t === 'M' || t === 'm'){
                cursor = {x: ci.x, y: ci.y};
                start = {x: ci.x, y: ci.y};
            } else if(t === 'L' || t === 'l'){
                const to = {x: ci.x, y: ci.y};
                len += Stroke.dist(cursor, to);
                cursor = to;
            } else if(t === 'Q' || t === 'q'){
                const p1 = {x: ci.x1, y: ci.y1};
                const p2 = {x: ci.x, y: ci.y};
                const pts = [cursor, p1, p2];
                len += Stroke.approxCurveLength(pts);
                cursor = p2;
            } else if(t === 'C' || t === 'c'){
                const p1 = {x: ci.x1, y: ci.y1};
                const p2 = {x: ci.x2, y: ci.y2};
                const p3 = {x: ci.x, y: ci.y};
                const pts = [cursor, p1, p2, p3];
                len += Stroke.approxCurveLength(pts);
                cursor = p3;
            } else if(t === 'Z' || t === 'z'){
                const to = start;
                len += Stroke.dist(cursor, to);
                cursor = to;
            } else {
                // unknown command - ignore
            }
        }

        return len;
    }

    /**
     * Return sampled points every `step` pixels along the stroke.
     * Always includes the original start and end points.
     * If step <= 0, returns only start and end.
     */
    getPoints(step = 2): {x:number,y:number}[] {
        const out: {x:number,y:number}[] = [];
        const total = this.length();
        // helper to push avoiding duplicate consecutive points
        const pushUnique = (p:{x:number,y:number})=>{
            if(out.length === 0) { out.push(p); return; }
            const last = out[out.length-1];
            if(Math.hypot(last.x - p.x, last.y - p.y) > 1e-6) out.push(p);
        };

        // if no length, try to return any explicit move point or empty
        if (total === 0) {
            for (const c of this.commands) {
                const ci: any = c;
                const t = (ci.type || ci.cmd || '').toString();
                if (t === 'M' || t === 'm') {
                    pushUnique({ x: ci.x, y: ci.y });
                    break;
                }
            }
            return out;
        }

        // always include start
        pushUnique(this.pointAt(0));

        if (step <= 0) {
            // only start and end
            pushUnique(this.pointAt(1));
            return out;
        }

        // sample at each multiple of step
        let s = step;
        while (s < total) {
            const ratio = s / total;
            pushUnique(this.pointAt(ratio));
            s += step;
        }

        // always include end
        pushUnique(this.pointAt(1));

        return out;
    }


    


    // returns point {x,y} at ratio along stroke (0..1). Clamps outside values.
    pointAt(ratio:number): {x:number,y:number}{
        if(this.commands.length === 0) return {x:0,y:0};
        const target = Math.max(0, Math.min(1, ratio)) * this.length();

        let acc = 0;
        let cursor = {x:0,y:0};
        let start = {x:0,y:0};

        for(const c of this.commands){
            const ci: any = c;
            const t = (ci.type || ci.cmd || '').toString();
            if(t === 'M' || t === 'm'){
                cursor = {x: ci.x, y: ci.y};
                start = {x: ci.x, y: ci.y};
                if(acc >= target) return cursor;
            } else if(t === 'L' || t === 'l'){
                const to = {x: ci.x, y: ci.y};
                const segLen = Stroke.dist(cursor, to);
                if(acc + segLen >= target){
                    const remain = target - acc;
                    const tparam = segLen === 0 ? 0 : (remain / segLen);
                    return {x: Stroke.lerp(cursor.x, to.x, tparam), y: Stroke.lerp(cursor.y, to.y, tparam)};
                }
                acc += segLen;
                cursor = to;
            } else if(t === 'Q' || t === 'q'){
                const p1 = {x: ci.x1, y: ci.y1};
                const p2 = {x: ci.x, y: ci.y};
                const pts = [cursor, p1, p2];
                const segLen = Stroke.approxCurveLength(pts);
                if(acc + segLen >= target){
                    const need = target - acc;
                    const tt = need / segLen;
                    // find t param by binary search along t in [0,1] matching arc length
                    let lo = 0, hi = 1, mid = 0;
                    for(let i=0;i<24;i++){
                        mid = (lo+hi)/2;
                        // approximate length from 0..mid
                        const sub = Stroke.approxCurveLength([cursor,
                            {x: Stroke.lerp(cursor.x, p1.x, mid), y: Stroke.lerp(cursor.y, p1.y, mid)},
                            {x: Stroke.quadAt(cursor.x, p1.x, p2.x, mid), y: Stroke.quadAt(cursor.y, p1.y, p2.y, mid)}
                        ]);
                        if(sub < need) lo = mid; else hi = mid;
                    }
                    const tparam = mid;
                    const x = Stroke.quadAt(cursor.x, p1.x, p2.x, tparam);
                    const y = Stroke.quadAt(cursor.y, p1.y, p2.y, tparam);
                    return {x,y};
                }
                acc += segLen;
                cursor = p2;
            } else if(t === 'C' || t === 'c'){
                const p1 = {x: ci.x1, y: ci.y1};
                const p2 = {x: ci.x2, y: ci.y2};
                const p3 = {x: ci.x, y: ci.y};
                const pts = [cursor, p1, p2, p3];
                const segLen = Stroke.approxCurveLength(pts);
                if(acc + segLen >= target){
                    const need = target - acc;
                    let lo = 0, hi = 1, mid = 0;
                    for(let i=0;i<24;i++){
                        mid = (lo+hi)/2;
                        // approximate length from 0..mid by subdividing the curve at mid
                        // build left control points via de Casteljau
                        const a = {x: Stroke.lerp(cursor.x, p1.x, mid), y: Stroke.lerp(cursor.y, p1.y, mid)};
                        const b = {x: Stroke.lerp(p1.x, p2.x, mid), y: Stroke.lerp(p1.y, p2.y, mid)};
                        const c2 = {x: Stroke.lerp(p2.x, p3.x, mid), y: Stroke.lerp(p2.y, p3.y, mid)};
                        const aa = {x: Stroke.lerp(a.x, b.x, mid), y: Stroke.lerp(a.y, b.y, mid)};
                        const bb = {x: Stroke.lerp(b.x, c2.x, mid), y: Stroke.lerp(b.y, c2.y, mid)};
                        const ab = {x: Stroke.lerp(aa.x, bb.x, mid), y: Stroke.lerp(aa.y, bb.y, mid)};
                        const subLen = Stroke.approxCurveLength([cursor, a, aa, ab]);
                        if(subLen < need) lo = mid; else hi = mid;
                    }
                    const tparam = mid;
                    const x = Stroke.cubicAt(cursor.x, p1.x, p2.x, p3.x, tparam);
                    const y = Stroke.cubicAt(cursor.y, p1.y, p2.y, p3.y, tparam);
                    return {x,y};
                }
                acc += segLen;
                cursor = p3;
            } else if(t === 'Z' || t === 'z'){
                const to = start;
                const segLen = Stroke.dist(cursor, to);
                if(acc + segLen >= target){
                    const remain = target - acc;
                    const tparam = segLen === 0 ? 0 : (remain / segLen);
                    return {x: Stroke.lerp(cursor.x, to.x, tparam), y: Stroke.lerp(cursor.y, to.y, tparam)};
                }
                acc += segLen;
                cursor = to;
            }
        }

        // if we reach here, return last cursor
        return cursor;
    }

}