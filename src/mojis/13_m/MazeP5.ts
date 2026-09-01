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

    //迷路生成(バックトラッキング法)の途中経過を保持し、1フレームずつ進める
    private stack: { c: number; r: number }[] = [];
    private generating: boolean = false;
    private stepsPerFrame: number = 3;

    //実際に動いた軌跡(行き止まりで戻った枝も含め、通った区間をすべて記録)
    private trace: { a: { c: number; r: number }; b: { c: number; r: number } }[] = [];

    private _count:number=0;

    constructor() {
        super();
    }

    init(callback: () => void) {
        this._callback = callback;

        let sketch = (p: p5) => {

            p.setup = () => {
                this._p5 = p;
                TitleView.setBasePosition(
                    100,
                    Stage.height/2 - TitleView.getSize().height/2
                );
                TitleView.setPosition();
                
                let letter = Params.alphabet;
                if(letter=="") letter = "M";
                console.log("letter = ",letter);
                this.loadFont(letter,()=>{
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

    //生成開始:左下あたりのセルからスタートし、右下あたりのセルをゴールにする
    //以降はdraw()からstepMaze()を毎フレーム呼んで少しずつ進める
    generateMaze() {
        this.stack = [];
        this.solutionPath = [];
        this.trace = [];

        const start = this.findBottomLeftValidCell();
        if (!start) return;

        this.startCell = start;
        this.goalCell = this.findBottomRightValidCell();

        this.visited[start.c][start.r] = true;
        this.stack.push(start);
        this.generating = true;
    }

    //バックトラッキング法を1歩だけ進める
    private stepMaze() {
        if (this.stack.length === 0) {
            this.generating = false;
            return;
        }

        const cur = this.stack[this.stack.length - 1];
        const nbs = this.getUnvisitedNeighbors(cur.c, cur.r);

        if (nbs.length === 0) {
            //行き止まり→1歩戻る
            this.stack.pop();
        } else {
            //未訪問の隣接セルへランダムに1歩進む
            const next = this._p5.random(nbs) as typeof nbs[number];
            this.removeWall(cur, next);
            this.visited[next.c][next.r] = true;
            this.trace.push({ a: { c: cur.c, r: cur.r }, b: { c: next.c, r: next.r } });
            this.stack.push({ c: next.c, r: next.r });

            //ゴールに着いたら、そこまでたどってきたスタック=ルートとして確定し生成を終了
            if (this.goalCell && next.c === this.goalCell.c && next.r === this.goalCell.r) {
                this.solutionPath = this.stack.slice();
                this.generating = false;
                return;
            }
        }

        if (this.stack.length === 0) {
            this.generating = false;
        }
    }

    //文字の一番左の列のうち、一番下にある有効セルをスタートとして探す
    findBottomLeftValidCell() {
        for (let c = 0; c < this.cols; c++) {
            for (let r = this.rows-1; r >=0; r--) {
                if (this.valid[c][r]) return { c, r };
            }
        }
        return null;
    }

    //文字の一番右の列のうち、一番下にある有効セルをゴールとして探す
    findBottomRightValidCell() {
        for (let c = this.cols-1; c >=0; c--) {
            for (let r = this.rows-1; r >=0; r--) {
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

    draw() {
        const p = this._p5;
        p.background(0);
        p.stroke(255);
        p.strokeWeight(2);

        if(Params.debug){
            this._p5.image(this.maskG,0,0,100,100);
        }

        //生成の途中経過を1フレームにつき数歩ずつ進める
        if (this.generating) {
            for (let i = 0; i < this.stepsPerFrame && this.generating; i++) {
                this.stepMaze();
            }
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

        //実際に動いた軌跡を灰色の線で表示(行き止まりで戻った枝もそのまま残す)
        if (this.trace.length > 0) {
            p.stroke(150);
            p.strokeWeight(3);
            for (const seg of this.trace) {
                const ax = seg.a.c * this.cellSize + this.cellSize * 0.5;
                const ay = seg.a.r * this.cellSize + this.cellSize * 0.5;
                const bx = seg.b.c * this.cellSize + this.cellSize * 0.5;
                const by = seg.b.r * this.cellSize + this.cellSize * 0.5;
                p.line(ax, ay, bx, by);
            }
        }

        //現在バックトラッキング中のセル(スタック先頭)を赤丸でハイライト
        if (this.generating && this.stack.length > 0) {
            const cur = this.stack[this.stack.length - 1];
            p.noStroke();
            p.fill(255, 0, 0);
            p.circle(cur.c * this.cellSize + this.cellSize * 0.5, cur.r * this.cellSize + this.cellSize * 0.5, this.cellSize * 0.6);
            p.fill(255);
        }

        //ゴールに到達した後、そこまで実際に動いたルートを赤い線で表示
        if (this.solutionPath.length > 0) {
            p.stroke(255, 0, 0);
            p.strokeWeight(3);
            p.noFill();
            p.beginShape();
            for (const cell of this.solutionPath) {
                const cx = cell.c * this.cellSize + this.cellSize * 0.5;
                const cy = cell.r * this.cellSize + this.cellSize * 0.5;
                p.vertex(cx, cy);
            }
            p.endShape();

            p.noStroke();
            p.fill(255, 0, 0);
            if (this.startCell) p.circle(this.startCell.c * this.cellSize + this.cellSize * 0.5, this.startCell.r * this.cellSize + this.cellSize * 0.5, this.cellSize * 0.6);
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
