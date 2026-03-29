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

        for (const ch of this.sentence) {
            if (ch === 'F' || ch === 'G') {
                const sw = Math.max(0.5, Math.min(6, len / 18));
                p.strokeWeight(sw);
                p.line(0, 0, 0, -len);
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
                lenStack.push(len);
                len = len * this.lengthDecay;
            } else if (ch === ']') {
                p.pop();
                const last = lenStack.pop();
                if (last !== undefined) len = last;
            }
        }

        p.pop();
    }

}