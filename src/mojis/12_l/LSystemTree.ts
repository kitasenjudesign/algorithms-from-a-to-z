import p5 from "p5";

export class LSystemTree{

    startX:number;
    startY:number;
    angleDeg:number;

    private axiom:string;
    private sentence:string;
    // rules may be string or function (for random rules like 'dead')
    private rules: Record<string, string | (() => string)>;
    private iterations:number;
    private stepLength:number;
    private baseStepLength:number;
    private angleIncDeg:number; // in radians for drawing
    private lengthDecay:number;
    private type:string;

    //生成アニメーション用(0~1でsentenceの描画範囲を広げる)
    private progress:number = 0;
    private delay:number = Math.floor(Math.random()*30);//frames
    private growSpeed:number = 0.008 + Math.random()*0.008;

    //grow:先端に向かって生える / hold:全体表示のまま待機 / shrink:根っこ側から消える
    private phase:string = "grow";
    private holdTimer:number = 0;
    private static readonly HOLD_FRAMES:number = 200;//約10秒(20fps)

    constructor(startX:number,startY:number,angle:number, type?: string){
        this.startX = startX;
        this.startY = startY;
        this.angleDeg = angle;

        this.axiom = "X";
        this.sentence = this.axiom;
        this.rules = {};
        this.type = type || this.randomType();

        // default params
        this.iterations = 4+Math.floor(3*Math.random());
        this.stepLength = 20;
        this.angleIncDeg = Math.PI/8; // default ~22.5deg
        this.lengthDecay = 0.3;

    this.createSystem(this.type);

    // build the sentence
    this.generate();

    // compute final drawing step length (keep baseStepLength intact)
    this.stepLength = this.baseStepLength * Math.pow(this.lengthDecay, this.iterations);
    }

    private randomType(): string{
        const types = ["symmetric","broadleaf","wind","weeping","pine","dead","bamboo"];
        return types[Math.floor(Math.random()*types.length)];
    }

    private createSystem(type: string){
        // initialize base
        this.axiom = "X";
        this.sentence = this.axiom;
        this.rules = {};
        let lenRatio = 0.35

        switch(type){
            case "symmetric":
                this.rules = { X: "F[+X][-X]FX", F: "FF" };
                this.angleIncDeg = Math.PI * 25 / 180;
                this.iterations = 5;
                this.baseStepLength = Math.max(40, Math.random()*120);
                break;
            case "broadleaf":
                this.rules = { X: "F[-X][+X][X]", F: "FF" };
                this.angleIncDeg = Math.PI * 22 / 180;
                this.iterations = 4 + Math.floor(Math.random()*2);
                this.baseStepLength = Math.max(30, Math.random()*100);
                break;
            case "wind":
                this.rules = { X: "F[+X]F[-X]FX", F: "FF" };
                this.angleIncDeg = Math.PI * 20 / 180;
                this.iterations = 4;
                this.baseStepLength = 50 + Math.random()*80;
                break;
            case "weeping":
                this.rules = { X: "FF-[-X]+[+X]", F: "FF" };
                this.angleIncDeg = Math.PI * 18 / 180;
                this.iterations = 4;
                this.baseStepLength = 40 + Math.random()*60;
                break;
            case "pine":
                this.rules = { X: "FFX", F: "F[+F][-F]F" };
                this.angleIncDeg = Math.PI * 30 / 180;
                this.iterations = 5;
                this.baseStepLength = 30 + Math.random()*60;
                break;
            case "dead":
                this.rules = {
                    X: () => {
                        const r = Math.random();
                        if (r < 0.6) return "F[+X]F[-X]FX";
                        if (r < 0.9) return "F[-X]FX";
                        return "F";
                    },
                    F: "FF"
                };
                this.angleIncDeg = Math.PI * (10 + Math.random()*25) / 180;
                this.iterations = 3 + Math.floor(Math.random()*3);
                this.baseStepLength = 50 + Math.random()*100;
                break;
            case "bamboo":
                this.axiom = "A";
                this.rules = { A: "FFA", F: "F[+F]F" };
                this.angleIncDeg = Math.PI * 10 / 180;
                this.iterations = 4;
                this.baseStepLength = 60 + Math.random()*80;
                break;
            default:
                this.rules = { X: "F[+X][-X]FX", F: "FF" };
                this.angleIncDeg = Math.PI * 20 / 180;
                this.iterations = 4;
                this.baseStepLength = 60;
        }

        this.baseStepLength*=lenRatio;
        // decay length each generation similar to reference
        this.lengthDecay = 0.6 + Math.random()*0.15;

        //bambooなどswitch内でaxiomを変えたケースにも対応
        this.sentence = this.axiom;
    }

    //消滅後、新しい木として再生成する
    private regenerate(){

        this.type = this.randomType();
        this.createSystem(this.type);
        this.generate();
        this.stepLength = this.baseStepLength * Math.pow(this.lengthDecay, this.iterations);

        this.progress = 0;
        this.delay = Math.floor(Math.random()*30);
        this.growSpeed = 0.008 + Math.random()*0.008;
        this.phase = "grow";

    }

    private generate(){
        for (let i = 0; i < this.iterations; i++) {
            let next = "";
            for (const ch of this.sentence) {
                const rule = this.rules[ch];
                if (rule) {
                    if (typeof rule === 'function') next += (rule as (()=>string))();
                    else next += rule as string;
                }
                else next += ch;
            }
            this.sentence = next;
        }
    }

    draw(p: p5, degree: number){
        if (!p) return;

        //生成アニメーション:delayフレーム待ってからprogressを進める
        if(this.delay > 0){
            this.delay--;
            return;
        }

        //drawStart~drawEndの範囲だけ線を描く
        let drawStart = 0;
        let drawEnd = this.sentence.length;

        if(this.phase == "grow"){
            //先端に向かって生える
            this.progress = Math.min(1, this.progress + this.growSpeed);
            drawEnd = Math.floor(this.sentence.length * this.progress);
            if(this.progress >= 1){
                this.phase = "hold";
                this.holdTimer = LSystemTree.HOLD_FRAMES;
            }
        }else if(this.phase == "hold"){
            //全体表示のまま待機
            this.holdTimer--;
            if(this.holdTimer <= 0){
                this.phase = "shrink";
                this.progress = 0;
            }
        }else if(this.phase == "shrink"){
            //根っこ側から消えていく
            this.progress = Math.min(1, this.progress + this.growSpeed);
            drawStart = Math.floor(this.sentence.length * this.progress);
            if(this.progress >= 1){
                //消え切ったら新しい木として再生成
                this.regenerate();
                return;
            }
        }

        p.push();
        p.translate(this.startX, this.startY);
        // initial orientation: angleDeg is treated as radians (LSystemP5 passes radians)
        p.rotate(degree);//this.angleDeg);

        // visual style
    // brighter stroke so it is visible on dark backgrounds
    p.stroke(220);

        // Use transform stack instead of manual x/y/angle bookkeeping
        // local mutable length so drawing doesn't change instance state
        const lenStack: number[] = [];
        let len = this.stepLength;

        //途中でbreakしたときにpush/popのバランスを取るための深さカウント
        let pushDepth = 0;
        let charIndex = 0;

        for (const ch of this.sentence) {
            if (charIndex >= drawEnd) break;
            //根っこ側が消えても枝先の位置がずれないよう、非表示でも変形は適用する
            const visible = charIndex >= drawStart;
            charIndex++;
            if (ch === 'F' || ch === 'G') {
                if (visible) {
                    const sw = Math.max(0.5, Math.min(6, len / 18));
                    p.strokeWeight(sw);
                    p.line(0, 0, 0, -len);
                }
                p.translate(0, -len);

                if (this.type === 'weeping') p.rotate(-Math.PI/180 * 0.5);
                if (this.type === 'wind') p.rotate(Math.PI/180 * 0.2);
            } else if (ch === 'f') {
                p.translate(0, -len);
            } else if (ch === '+') {
                p.rotate(this.angleIncDeg);
            } else if (ch === '-') {
                p.rotate(-this.angleIncDeg);
            } else if (ch === '[') {
                p.push();
                pushDepth++;
                lenStack.push(len);
                len = len * this.lengthDecay;
            } else if (ch === ']') {
                p.pop();
                pushDepth--;
                const last = lenStack.pop();
                if (last !== undefined) len = last;
            }
        }

        //break時に閉じられていないpushを戻す
        for(let i=0;i<pushDepth;i++){
            p.pop();
        }

        p.pop();
    }

}