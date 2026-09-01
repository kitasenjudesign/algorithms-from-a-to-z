import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { PathWrapper } from "../../font/PathWrapper";
import { p5Base } from "../00_base/p5Base";
import { TitleView } from "../../html/TitleView";
import { Stage } from "../../data/Stage";
import { Params } from "../../data/Params";

export class OpenTypeP5 extends p5Base {

    private _width: number = 0;
    private _height: number = 0;
    private _ratio: number = 0.0;
    private _isInit: boolean = false;
    // transform controls
    private _offset = { x: 0, y: 0 };
    private _scale = 1.0;
    private _baseStrokeWeight = 1;
    private _rad:number = 0;
    private _strength:number = 110;

    constructor() {
        super();
        //this._waveSimulation = new WaveSimulation();

    }

   

    init(callback: () => void) {

        this._callback = callback;
        this._width = Stage.width;
        this._height = Stage.height;

        let sketch = (p: p5) => {
            /** 初期化処理 */
            p.setup = () => {

                this._p5 = p;

                let letter = Params.alphabet;
                if(letter=="") letter = "Opentype";
                console.log("letter = ",letter);
                
                this._fontManager = new FontManager();
                this.loadFont(letter, () => {
                    console.log("font loaded");
                    this._isInit = true;
                    this.setUp(this._p5);
                    let rect = this._path.getRect();
                                                    
                    this._scale = 4*Stage.width/1920;
                    this._offset.x = this._p5.width/2-rect.width*0.505*this._scale;
                    this._offset.y = this._p5.height/2+rect.height/4*this._scale;
                    TitleView.setCenter(0,0);
                    this._callback();
                });

            }
            /** フレームごとの描画処理 */
            p.draw = () => {
                this.draw();
            }

            p.mouseClicked = () => {

            }

        };

        new p5(sketch, document.body);
    }


    setUp(p: p5) {

        this._p5.createCanvas(
            this._width,
            this._height
        );

        this._p5.pixelDensity(1);

        //r.id('p5canvas');
        //this._p5.frameRate(30);
        //this._p5.noSmooth();

        //this._p5.noLoop();
        this._p5.frameRate(30);

    }

    onLoad() {


    }

    click() {

    }

    reset() {

    }

    draw() {

        if (!this._isInit) return;


        const p = this._p5;
        p.background(0, 0, 0, 255);
        p.stroke(255);
        //p.strokeWeight(2);
        p.noFill();
        // adjust stroke weight so line thickness remains visually consistent
        p.strokeWeight(2);//this._baseStrokeWeight / this._scale);

        p.push();
        // apply transform: translate then scale
        //p.translate(this._offset.x, this._offset.y);
        //p.scale(this._scale);

        const strokes = this._path.getStrokes();

        this._rad += 0.1;
        if(this._rad>Math.PI*2){
            this._rad = 0;
            this._strength = 100 + 100*Math.random();
        }

        

        for (let si = 0; si < strokes.length; si++) {
            let strength = this._strength*(Math.sin(this._rad-si) * 0.5 + 0.5);

            const stroke = strokes[si];
            if (!stroke || !stroke.commands || stroke.commands.length === 0) continue;

            let shapeOpen = false;
            // track previous endpoint for handle drawing
            let lastX = 0;
            let lastY = 0;
            let haveLast = false;

             for (const c of stroke.commands as any[]) {
                 const t = (c.type || c.cmd || '').toString();

                 let x = c.x*this._scale + strength * (Math.random()-0.5) + this._offset.x;
                 let y = c.y*this._scale + strength * (Math.random()-0.5) + this._offset.y;
                 let x1 = c.x1*this._scale + strength * (Math.random()-0.5) + this._offset.x;
                 let y1 = c.y1*this._scale + strength * (Math.random()-0.5) + this._offset.y;
                 let x2 = c.x2*this._scale + strength * (Math.random()-0.5) + this._offset.x;
                 let y2 = c.y2*this._scale + strength * (Math.random()-0.5) + this._offset.y;

                 if (t === 'M' || t === 'm') {
                    if (shapeOpen) {
                        p.endShape();
                        shapeOpen = false;
                    }
                    p.beginShape();
                    p.circle(x, y, 5);
                    shapeOpen = true;
                    // moveTo: start new vertex
                    p.vertex(x, y);
                    // update last point
                    lastX = x; lastY = y; haveLast = true;

                 } else if (t === 'L' || t === 'l') {
                    if (!shapeOpen) { p.beginShape(); shapeOpen = true; p.vertex(x, y); }
                    else p.vertex(x, y);
                    
                    p.circle(x, y, 2);
                    lastX = x; lastY = y; haveLast = true;
                 } else if (t === 'Q' || t === 'q') {
                    // quadratic: x1,y1 control, x,y end
                    // ensure shape started
                    if (!shapeOpen) { p.beginShape(); shapeOpen = true; p.vertex(x, y); }
                    // p5 requires previous vertex; quadraticVertex adds control+end
                    p.quadraticVertex(x1, y1, x, y);
                     //p.circle(x, y, 62);
                     //p.circle(x1, y1, 69);
                    lastX = x; lastY = y; haveLast = true;
                 } else if (t === 'C' || t === 'c') {
                     // cubic bezier: x1,y1,x2,y2,x,y
                     if (!shapeOpen) { p.beginShape(); shapeOpen = true; p.vertex(x, y); }
                     p.bezierVertex(x1, y1, x2, y2, x, y);
                    // draw handles (separate style from main stroke)
                    const handleStrokeColor = p.color(255, 255, 255,180); // handle line color
                    const handlePointFill = p.color(255, 255, 255,180); // control point fill
                    const handleStrokeW = 2.0;                       // handle line thickness (px)
                    const ctrlSize = 4; // this._scale;
                    const anchorSize = 6 // this._scale;

                    // lines: use stroked thin lines
                    p.push();
                    p.stroke(handleStrokeColor);
                    p.strokeWeight(handleStrokeW);
                    p.noFill();
                    if (haveLast) p.line(lastX, lastY, x1, y1); // from prev anchor -> control1
                    p.line(x2, y2, x, y);                         // from control2 -> end anchor
                    p.pop();

                    // control points: filled circles with no stroke
                    p.push();
                    p.noStroke();
                    p.fill(handlePointFill);
                    p.circle(x1, y1, ctrlSize);
                    p.circle(x2, y2, ctrlSize);
                    p.pop();

                    // end anchor: hollow square using handle stroke color
                    p.push();
                    p.stroke(handleStrokeColor);
                    p.strokeWeight(handleStrokeW);
                    p.noFill();
                    p.rectMode(p.CENTER);
                    p.rect(x, y, anchorSize, anchorSize);
                    p.pop();

                    // update last endpoint
                    lastX = x; lastY = y; haveLast = true;
                      
                 } else if (t === 'Z' || t === 'z') {
                    if (shapeOpen) {
                        p.endShape(p.CLOSE);
                        shapeOpen = false;
                    }
                 } else {
                     // unknown command: ignore
                 }
             }
            if (shapeOpen) {
                p.endShape();
                shapeOpen = false;
            }
        }

        p.pop();



    }

    getPixel(i: number, j: number): { r: number, g: number, b: number, a: number } {

        let img = this._p5.drawingContext.getImageData(i, j, 1, 1);
        let data = img.data;
        return {
            r: data[0],
            g: data[1],
            b: data[2],
            a: data[3]
        };

    }

    resize() {



    }

}

