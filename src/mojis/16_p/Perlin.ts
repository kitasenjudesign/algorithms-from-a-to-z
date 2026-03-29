import p5 from "p5";


export class Perlin{

    gradients: { [key: string]: { x: number, y: number } } = {};
    GRID_SIZE = 8;
    p5:p5;

    constructor(p5:p5){
        this.p5 = p5;
    }

    perlin(x:number, y:number, pp:boolean=false):number {
        let x0 = Math.floor(x);
        let x1 = x0 + 1;
        let y0 = Math.floor(y);
        let y1 = y0 + 1;

        let sx = x - x0;
        let sy = y - y0;

        let g00 = this.gradient(x0, y0);
        let g10 = this.gradient(x1, y0);
        let g01 = this.gradient(x0, y1);
        let g11 = this.gradient(x1, y1);

        
        if(pp){
            g00 = {x:0.5,y:0.5};
            g10 = {x:0.5,y:0.5};
            g01 = {x:0.5,y:0.5};
            g11 = {x:0.5,y:0.5};
        }

        let d00 = { x: sx,     y: sy     };
        let d10 = { x: sx - 1, y: sy     };
        let d01 = { x: sx,     y: sy - 1 };
        let d11 = { x: sx - 1, y: sy - 1 };

        let n00 = this.dot(g00, d00);
        let n10 = this.dot(g10, d10);
        let n01 = this.dot(g01, d01);
        let n11 = this.dot(g11, d11);

        let u = this.fade(sx);
        let v = this.fade(sy);

        let nx0 = this.p5.lerp(n00, n10, u);
        let nx1 = this.p5.lerp(n01, n11, u);
        let nxy = this.p5.lerp(nx0, nx1, v);

        return nxy;
    }

    gradient(ix:number, iy:number) {
            
        let key = ix + "," + iy;
        if (!(key in this.gradients)) {
            let angle = this.p5.random(this.p5.TWO_PI);
            this.gradients[key] = { x: this.p5.cos(angle), y: this.p5.sin(angle) };
        }
        return this.gradients[key];

    }

    dot(a:{x:number, y:number}, b:{x:number, y:number}):number {
        return a.x * b.x + a.y * b.y;
    }

    fade(t:number):number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }


}