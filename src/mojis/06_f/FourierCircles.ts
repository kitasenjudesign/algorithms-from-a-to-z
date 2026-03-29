import p5 from "p5";

type Complex = { re: number; im: number };
type FourierTerm = { re: number; im: number; freq: number; amp: number; phase: number };

export class FourierCircles{
    private original: Complex[] = [];
    private fourier: FourierTerm[] = [];
    private fourierX: FourierTerm[] = [];
    private fourierY: FourierTerm[] = [];
    private centroid = { x: 0, y: 0 }; // 追加: 元データの重心
    private time: number = 0;
    private path: { x: number; y: number }[] = [];
    private dt: number = 0;
    private initialized: boolean = false;
    private maxTerms: number | null = null; // if set, limit number of epicycles drawn
    private separateXY: boolean = false; // if true, use separate DFTs for x and y like the example
    private partialPaths: {x:number,y:number}[][] = [];
    private partialPathsX: {x:number,y:number}[][] = [];
    private partialPathsY: {x:number,y:number}[][] = [];
    private startX?: number;
    private startY?: number;
    private isRecorded: boolean = false;
    private count: number = 0;

    constructor(){ }

    /**
     * 明示的に描画の開始位置（エピサイクル群の原点）を指定する。
     * 指定すると draw 時に canvas の中心の代わりにこの座標を使う。
     */
    public setStart(x: number, y: number){
        this.startX = x;
        this.startY = y;
    }

    /**
     * 元データの最初のサンプルが canvas 上の (x,y) に来るように描画原点を設定する。
     * （内部では original[0] は DFT に使う中心化後の座標なのでそれを考慮して原点を決める）
     */
    public setStartAtFirstSample(x: number, y: number){
        const first = this.original[0] || { re: 0, im: 0 };
        // we want: canvasPos = origin + first => origin = canvasPos - first
        this.startX = x - first.re;
        this.startY = y - first.im;
    }

    /**
     * リセットして中心を canvas 中央に戻す
     */
    public resetStart(){
        this.startX = undefined;
        this.startY = undefined;
    }

    // points: array of {x,y} representing a sampled closed path (in order)
    public init(points:{x:number,y:number}[], maxTerms?: number){
        // compute centroid and center points so DC term is removed
        const cx = points.reduce((s,p)=>s+p.x, 0) / points.length;
        const cy = points.reduce((s,p)=>s+p.y, 0) / points.length;
        this.centroid = { x: cx, y: cy };
        // store centered points for DFT (so origin becomes centroid)
        this.original = points.map(p=>({ re: p.x - cx, im: p.y - cy }));

        this.maxTerms = typeof maxTerms === 'number' ? maxTerms : null;
        this.fourier = this.dft(this.original);
        // prepare separate transforms if desired
        const xs = points.map(p=>p.x);
        const ys = points.map(p=>p.y);
        // for separate x/y mode, subtract centroid too
        const xsCentered = points.map(p => p.x - cx);
        const ysCentered = points.map(p => p.y - cy);
        this.fourierX = this.dftReal(xsCentered);
        this.fourierY = this.dftReal(ysCentered);
        // sort by amplitude descending
        this.fourier.sort((a,b)=>b.amp - a.amp);
        this.time = 0;
        this.path = [];
        this.dt = (Math.PI * 2) / this.original.length;

        // prepare partial path buffers
        const terms = this.maxTerms ? this.fourier.slice(0, this.maxTerms) : this.fourier;
        const nterms = terms.length;
        this.partialPaths = new Array(nterms).fill(0).map(()=>[] as {x:number,y:number}[]);
        this.partialPathsX = new Array(nterms).fill(0).map(()=>[] as {x:number,y:number}[]);
        this.partialPathsY = new Array(nterms).fill(0).map(()=>[] as {x:number,y:number}[]);
        this.initialized = true;
    }

    // allow switching mode at runtime
    public setSeparateXY(enable: boolean){
        this.separateXY = enable;
    }

    // DFT for a real-valued sequence -> returns FourierTerm with freq/amp/phase
    private dftReal(arr: number[]): FourierTerm[]{
        const N = arr.length;
        const X: FourierTerm[] = [];
        for(let k=0;k<N;k++){
            let re = 0;
            let im = 0;
            for(let n=0;n<N;n++){
                const phi = (2 * Math.PI * k * n) / N;
                re += arr[n] * Math.cos(phi);
                im += -arr[n] * Math.sin(phi);
            }
            re = re / N;
            im = im / N;
            let freq = k;
            if(k > N/2) freq = k - N;
            const amp = Math.hypot(re, im);
            const phase = Math.atan2(im, re);
            X.push({ re, im, freq, amp, phase });
        }
        return X;
    }

    // discrete Fourier transform returning array of terms with freq adjusted to negative for k>N/2
    private dft(x: Complex[]): FourierTerm[]{
        const N = x.length;
        const X: FourierTerm[] = [];
        for(let k=0;k<N;k++){
            let re = 0;
            let im = 0;
            for(let n=0;n<N;n++){
                const phi = (2 * Math.PI * k * n) / N;
                re += x[n].re * Math.cos(phi) + x[n].im * Math.sin(phi);
                im += -x[n].re * Math.sin(phi) + x[n].im * Math.cos(phi);
            }
            re = re / N;
            im = im / N;
            // frequency mapping: center zero at negative/positive
            let freq = k;
            if(k > N/2) freq = k - N;
            const amp = Math.hypot(re, im);
            const phase = Math.atan2(im, re);
            X.push({ re, im, freq, amp, phase });
        }
        return X;
    }

    // draw epicycles and the reconstructed path onto a p5 instance
    public draw(p5:p5){
        if(!this.initialized) return;

        //p5.circle(p5.width/2,p5.height/2,10);
        // start position for epicycles: use canvas center (or change to desired point)
        // since we centered input for DFT, place the reconstruction at the canvas center
        const cx = (this.startX !== undefined) ? this.startX : (p5.width / 2);
        const cy = (this.startY !== undefined) ? this.startY : (p5.height / 2);

        let x = cx;
        let y = cy;
  
        {
            // single complex-series epicycles (previous behavior)
            const terms = this.maxTerms ? this.fourier.slice(0, this.maxTerms) : this.fourier;

            p5.push();
            p5.stroke(255);
            p5.noFill();
            p5.strokeWeight(1);
            // ensure partials exist
            for(let i=0;i<terms.length;i++){
                if(!this.partialPaths[i]){
                    this.partialPaths[i] = [];
                }
            }

            for(let tIndex=0;tIndex<terms.length;tIndex++){
                const term = terms[tIndex];
                const prevx = x;
                const prevy = y;
                const freq = term.freq;
                const radius = term.amp;
                const phase = term.phase;
                const angle = freq * this.time + phase;
                x += radius * Math.cos(angle);
                y += radius * Math.sin(angle);

                // record partial sum endpoint for this term
                if(!this.isRecorded){
                    this.partialPaths[tIndex].unshift({ x: x, y: y });
                    //if(this.partialPaths[tIndex].length > 200) this.partialPaths[tIndex].pop();
                }else{
                    
                }

                // circle
                p5.stroke(255);
                p5.ellipse(prevx, prevy, radius*2, radius*2);
                // radius line
                p5.stroke(255);
                p5.line(prevx, prevy, x, y);
            }

            if(this.isRecorded){
                this.count++;
                console.log(this.count);
            }
            p5.pop();

            // draw each partial-sum trace with its own color (shows composition)
            p5.noFill();
            
            //for(let i=0;i<terms.length;i++){
            //直線を書く
            p5.strokeWeight(3);
            for(let i=1;i<4;i++){
              
                const arr = this.partialPaths[i];
                console.log(arr.length);
                if(!arr || arr.length===0) continue;
                const tnorm = i / Math.max(1, terms.length-1);

                p5.stroke(255);
                p5.beginShape();
                //for(const q of arr){
                if(this.isRecorded){
                   let len = arr.length;
                    for(let j=this.count;j<arr.length;j++){
                        const q = arr[arr.length - 1 - j];
                        //p5.circle(q.x, q.y, j/10);
                        p5.vertex(q.x, q.y);
                    }
                }else{
                    let len = arr.length;
                    for(let j=0;j<arr.length;j++){
                        const q = arr[j];
                        //p5.circle(q.x, q.y, j/10);
                        p5.vertex(q.x, q.y);
                    }
                }
                p5.endShape();

            }

            // add current endpoint to path and draw final reconstructed path in red
            if(!this.isRecorded){
                this.path.unshift({ x: x, y: y });
            }
            p5.push();
            p5.noFill();
            p5.stroke(255);
            p5.beginShape();
            if(this.isRecorded){
                for(let i=this.count;i<this.path.length;i++){
                    let pp = this.path[this.path.length - 1 - i];
                    p5.vertex(pp.x, pp.y);
                }
            }else{
                for(let i=0;i<this.path.length;i++){
                    p5.vertex(this.path[i].x, this.path[i].y);
                }
            }
            p5.endShape();
            p5.pop();
        }

        // advance time
        this.time += this.dt;
        if(this.time > Math.PI * 2){
            
            this.time = 0;
            // reset main path

            // clear partial-sum buffers so drawn partial traces restart
                        this.isRecorded=!this.isRecorded;

            if(!this.isRecorded){
                this.path = [];
                for (let i = 0; i < this.partialPaths.length; i++) this.partialPaths[i] = [];
                for (let i = 0; i < this.partialPathsX.length; i++) this.partialPathsX[i] = [];
                for (let i = 0; i < this.partialPathsY.length; i++) this.partialPathsY[i] = [];    
            }
            this.count=0;
        }

        // cap path length
        //if(this.path.length > 2000) this.path.pop();
    }

}