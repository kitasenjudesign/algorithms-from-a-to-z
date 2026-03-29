import p5, { Graphics } from "p5";
import { p5Base } from "../00_base/p5Base";
import { Params } from "../../data/Params";
import { TitleView } from "../../html/TitleView";
import { Stage } from "../../data/Stage";

type CellWalls = { N: boolean; E: boolean; S: boolean; W: boolean };

export class MazeP5 extends p5Base{

    private cellSize = 20;
    private cols = 0;
    private rows = 0;

    private valid: boolean[][] = [];
    private visited: boolean[][] = [];
    private walls: CellWalls[][] = [];

    private maskG!: Graphics;

    private startCell: { c: number; r: number } | null = null;
    private goalCell: { c: number; r: number } | null = null;
    private solutionPath: { c: number; r: number }[] = [];

    private _count:number=0;

    constructor() {
        super();
    }

    init(callback: () => void) {
        this._callback = callback;

        let sketch = (p: p5) => {

            p.setup = () => {
                this._p5 = p;
                TitleView.setPosition(
                    100,
                    Stage.height/2 - TitleView.getSize().height/2
                )
                let str = "M";//"ABCDEFGHIHKJKOMNOPQRSTUVWXYZ"
                this.loadFont(str[Math.floor(Math.random()*str.length)],()=>{
                    this.setUp(p);
                    this.reset();
                    this.onLoad();
                });
            };

            p.draw = () => this.draw();
            p.mouseClicked = () => this.click();
            p.windowResized = () => this.resize();
        };

        new p5(sketch, document.body);
    }

    setUp(p: p5) {
        p.createCanvas(window.innerWidth, window.innerHeight);
        p.noSmooth();
        p.pixelDensity(1);
        p.frameRate(30);
    }

    onLoad() {
        this._callback?.();
    }

    click() {
        this.reset();
    }

    reset() {
        const p = this._p5;

        this.cols = Math.floor(p.width / this.cellSize);
        this.rows = Math.floor(p.height / this.cellSize);

        this.createGlyphMask();
        this.buildValidGridFromMask();

        this.visited = Array.from({ length: this.cols }, () => Array(this.rows).fill(false));
        this.walls = Array.from({ length: this.cols }, () =>
            Array.from({ length: this.rows }, () => ({ N: true, E: true, S: true, W: true }))
        );

        this.generateMaze();
    }

    createGlyphMask() {
        const p = this._p5;

        this.maskG = p.createGraphics(p.width, p.height);
        this.maskG.pixelDensity(1);
        this.maskG.background(0);
        this.maskG.fill(255);
        this.maskG.noStroke();

        let ss = 8+4*Math.random();
        this._path.draw(
            this.maskG,
            this._p5.width,
            this._p5.height,
            ss,
            0,
            0
        );
    }

    buildValidGridFromMask() {
        const p = this._p5;
        this.maskG.loadPixels();

        this.valid = Array.from({ length: this.cols }, () => Array(this.rows).fill(false));

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {

                const cx = Math.floor((c + 0.5) * this.cellSize);
                const cy = Math.floor((r + 0.5) * this.cellSize);
                const idx = 4 * (cy * p.width + cx);
                const v = this.maskG.pixels[idx]; // R channel

                this.valid[c][r] = v > 127;
            }
        }
    }

    generateMaze() {
        const stack: { c: number; r: number }[] = [];
        const start = this.findAnyValidCell();
        if (!start) return;

        this.visited[start.c][start.r] = true;
        stack.push(start);

        while (stack.length > 0) {
            const cur = stack[stack.length - 1];
            const nbs = this.getUnvisitedNeighbors(cur.c, cur.r);

            if (nbs.length === 0) {
                stack.pop();
            } else {
                const next = this._p5.random(nbs) as typeof nbs[number];
                this.removeWall(cur, next);
                this.visited[next.c][next.r] = true;
                stack.push({ c: next.c, r: next.r });
            }
        }

        // after maze generated, compute start/goal and solution path
        this.computeSolutionPath();
    }

    findAnyValidCell() {
        //for (let r = 0; r < this.rows; r++) {
        for (let r = this.rows-1; r >=0; r--) {

            for (let c = 0; c < this.cols; c++) {
                if (this.valid[c][r]) return { c, r };
            }
        }
        return null;
    }

    getUnvisitedNeighbors(c: number, r: number) {
        const out: { c: number; r: number; dir: keyof CellWalls }[] = [];

        if (r > 0 && this.valid[c][r - 1] && !this.visited[c][r - 1]) out.push({ c, r: r - 1, dir: "N" });
        if (c < this.cols - 1 && this.valid[c + 1][r] && !this.visited[c + 1][r]) out.push({ c: c + 1, r, dir: "E" });
        if (r < this.rows - 1 && this.valid[c][r + 1] && !this.visited[c][r + 1]) out.push({ c, r: r + 1, dir: "S" });
        if (c > 0 && this.valid[c - 1][r] && !this.visited[c - 1][r]) out.push({ c: c - 1, r: r, dir: "W" });

        return out;
    }

    removeWall(a: { c: number; r: number }, b: { c: number; r: number; dir: keyof CellWalls }) {
        const wa = this.walls[a.c][a.r];
        const wb = this.walls[b.c][b.r];

        if (b.dir === "N") { wa.N = false; wb.S = false; }
        if (b.dir === "E") { wa.E = false; wb.W = false; }
        if (b.dir === "S") { wa.S = false; wb.N = false; }
        if (b.dir === "W") { wa.W = false; wb.E = false; }
    }

    // compute start (some valid cell), goal (farthest reachable), and the path between them
    private computeSolutionPath() {
        this.solutionPath = [];
        this.startCell = this.findAnyValidCell();
        if (!this.startCell) {
            this.goalCell = null;
            return;
        }

        // BFS over the maze graph using opened walls
        const queue: { c: number; r: number }[] = [];
        const parent: ( { c:number; r:number } | null )[][] = Array.from({ length: this.cols }, () => Array(this.rows).fill(null));
        const dist: number[][] = Array.from({ length: this.cols }, () => Array(this.rows).fill(-1));

        queue.push(this.startCell);
        dist[this.startCell.c][this.startCell.r] = 0;

        let head = 0;
        let farthest = this.startCell;
        while (head < queue.length) {
            const cur = queue[head++];
            const d = dist[cur.c][cur.r];
            if (d > dist[farthest.c][farthest.r]) farthest = cur;

            const w = this.walls[cur.c][cur.r];
            // neighbors where wall is removed
            if (!w.N && cur.r > 0 && dist[cur.c][cur.r - 1] === -1) {
                dist[cur.c][cur.r - 1] = d + 1;
                parent[cur.c][cur.r - 1] = cur;
                queue.push({ c: cur.c, r: cur.r - 1 });
            }
            if (!w.E && cur.c < this.cols - 1 && dist[cur.c + 1][cur.r] === -1) {
                dist[cur.c + 1][cur.r] = d + 1;
                parent[cur.c + 1][cur.r] = cur;
                queue.push({ c: cur.c + 1, r: cur.r });
            }
            if (!w.S && cur.r < this.rows - 1 && dist[cur.c][cur.r + 1] === -1) {
                dist[cur.c][cur.r + 1] = d + 1;
                parent[cur.c][cur.r + 1] = cur;
                queue.push({ c: cur.c, r: cur.r + 1 });
            }
            if (!w.W && cur.c > 0 && dist[cur.c - 1][cur.r] === -1) {
                dist[cur.c - 1][cur.r] = d + 1;
                parent[cur.c - 1][cur.r] = cur;
                queue.push({ c: cur.c - 1, r: cur.r });
            }
        }

        this.goalCell = farthest;

        // reconstruct path from goal back to start
        if (this.goalCell) {
            let cur: { c: number; r: number } | null = this.goalCell;
            while (cur) {
                this.solutionPath.push(cur);
                cur = parent[cur.c][cur.r];
            }
            // path currently from goal->start, reverse to start->goal
            this.solutionPath.reverse();
        }
    }

    draw() {
        const p = this._p5;
        p.background(0);
        p.stroke(255);
        p.strokeWeight(2);

        if(Params.debug){
            this._p5.image(this.maskG,0,0,100,100);
        }

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (!this.valid[c][r]) continue;

                const x = c * this.cellSize;
                const y = r * this.cellSize;
                const w = this.walls[c][r];

                if (w.N) p.line(x, y, x + this.cellSize, y);
                if (w.E) p.line(x + this.cellSize, y, x + this.cellSize, y + this.cellSize);
                if (w.S) p.line(x, y + this.cellSize, x + this.cellSize, y + this.cellSize);
                if (w.W) p.line(x, y, x, y + this.cellSize);
            }
        }

        // draw solution path as a line (through cell centers)
        if (this.solutionPath && this.solutionPath.length > 0) {
            p.stroke(255, 0, 0);//ここ
            p.strokeWeight(3);
            p.noFill();
            p.beginShape();

            let len = this._p5.frameCount*1.5;
            if(len>=this.solutionPath.length){
                len = this.solutionPath.length;
            }

            for(let i=0;i< len;i++){
                const cell = this.solutionPath[i];
                const cx = cell.c * this.cellSize + this.cellSize * 0.5;
                const cy = cell.r * this.cellSize + this.cellSize * 0.5;
                p.vertex(cx, cy);
            }
            p.endShape();

            // optionally draw start/goal markers
            p.noStroke();
            p.fill(255, 0, 0);
            if (this.startCell) p.circle(this.startCell.c * this.cellSize + this.cellSize * 0.5, this.startCell.r * this.cellSize + this.cellSize * 0.5, this.cellSize * 0.6);
            p.fill(255, 0, 0);
            if (this.goalCell) p.circle(this.goalCell.c * this.cellSize + this.cellSize * 0.5, this.goalCell.r * this.cellSize + this.cellSize * 0.5, this.cellSize * 0.6);
            p.fill(255);
        }
    }

    resize() {
        /*
        const p = this._p5;
        p.resizeCanvas(
            window.innerWidth, window.innerHeight
            
        );
        this.reset();
        */
    }
}
