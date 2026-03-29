import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { PathWrapper } from "../../font/PathWrapper";

export class GiftWrapping{

    constructor(){

    }

    public static getWrappedPoints(points: {x: number, y: number}[]): {x: number, y: number}[] {
        // remove duplicates
        const seen = new Set<string>();
        const pts: {x:number,y:number}[] = [];
        for (const p of points) {
            const k = `${p.x},${p.y}`;
            if (!seen.has(k)) {
                seen.add(k);
                pts.push({ x: p.x, y: p.y });
            }
        }

        const n = pts.length;
        if (n === 0) return [];
        if (n === 1) return [pts[0]];
        if (n === 2) return [pts[0], pts[1]];

        const cross = (a:{x:number,y:number}, b:{x:number,y:number}, c:{x:number,y:number}) => {
            return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
        };
        const dist2 = (a:{x:number,y:number}, b:{x:number,y:number}) => {
            const dx = a.x - b.x, dy = a.y - b.y;
            return dx*dx + dy*dy;
        };

        // find leftmost point (smallest x, then smallest y)
        let left = 0;
        for (let i = 1; i < n; i++) {
            if (pts[i].x < pts[left].x || (pts[i].x === pts[left].x && pts[i].y < pts[left].y)) left = i;
        }

        const hull: {x:number,y:number}[] = [];
        let p = left;
        do {
            hull.push(pts[p]);
            let q = (p + 1) % n;
            for (let r = 0; r < n; r++) {
                if (r === p) continue;
                const cr = cross(pts[p], pts[q], pts[r]);
                if (cr < 0) {
                    // r is more counter-clockwise than q relative to p (choose r)
                    q = r;
                } else if (cr === 0) {
                    // collinear: choose farther point to ensure endpoints are kept
                    if (dist2(pts[p], pts[r]) > dist2(pts[p], pts[q])) {
                        q = r;
                    }
                }
            }
            p = q;
        } while (p !== left);

        // If all points are collinear, ensure we return the two extreme endpoints in order
        if (hull.length === 1) {
            // fallback: find min/max along x (or y) and return them
            let minI = 0, maxI = 0;
            for (let i = 1; i < n; i++) {
                if (pts[i].x < pts[minI].x || (pts[i].x === pts[minI].x && pts[i].y < pts[minI].y)) minI = i;
                if (pts[i].x > pts[maxI].x || (pts[i].x === pts[maxI].x && pts[i].y > pts[maxI].y)) maxI = i;
            }
            if (minI === maxI) return [pts[minI]];
            return [pts[minI], pts[maxI]];
        }

        return hull;
    }   

}