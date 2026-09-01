import p5 from "p5";
import { Params } from "../../data/Params";
import { Stage } from "../../data/Stage";
import { TitleView } from "../../html/TitleView";
import { HilbertAlphabet } from "./HilbertAlphabet";

export class HilbertCurveP5{

    private _callback   :()=>void;
    private _p5         :p5;
    private _width:number = 0;
    private _height:number = 0;
    // margins around the drawing area
    private _marginX: number = 10;
    private _marginY: number = 10;
    private orderMap:number[][] = [];
    private path:p5.Vector[] = [];
    private bgColor:string = "#000";
    private strokeColor:string = "#fff"

    //表示/消滅アニメーション用
    private _phase:string = "grow";//grow:描画されていく / hold:完成状態で待機 / shrink:消えていく
    private _animFrame:number = 0;
    private static readonly HOLD_FRAMES:number = 300;//約5秒(60fps)
    
    public setMargins(mx: number, my: number){
        this._marginX = Math.max(0, mx);
        this._marginY = Math.max(0, my);
    }

    constructor(){
        
        if(Params.color){
            this.bgColor="rgba(34, 34, 155, 1)";
            this.strokeColor="#ffe"
        }
        //this._waveSimulation = new WaveSimulation();

    }

    init(callback:()=>void){
        
        this._callback=callback;
        this._width = Stage.width;
        this._height = Stage.height;

        let sketch = (p: p5)=>{
            /** 初期化処理 */
            p.setup = ()=>{
                
                this._p5 = p;
                this.setUp(this._p5);
                this._callback();
            
            }
            /** フレームごとの描画処理 */
            p.draw = ()=> {
                this.draw();
            }

            p.mouseClicked = ()=>{

            }
            
        };
        
        new p5(sketch, document.body);
    }


    setUp(p: p5){
        
       this._p5.createCanvas(
            this._width,
            this._height
        );
        
        this._p5.pixelDensity(1);
        this._p5.frameRate(60);

        let letter = Params.alphabet;
        if(letter=="") letter = "H";
        console.log("letter = ",letter);

        this.orderMap = HilbertAlphabet.getAlphabet(letter.substring(0,1));
  
        this.generateMultiOrderHilbert();

        TitleView.setBasePosition(
            this._marginX+(Stage.width-2*this._marginX)/16*4,
            this._marginY+(Stage.height-2*this._marginY)/16*4,
        );
        TitleView.setPosition();
    }

    onLoad(){


    }

    click(){

    }

    reset(){
        
    }
    draw() {

        this._p5.background(this.bgColor);
        this._p5.noFill();
        this._p5.strokeWeight(2);
        this._p5.stroke(this.strokeColor);
        // 描画
        
        
        const len = this.path.length;
        const half1 = len/2;                    //線1の折り返し(排他)
        const half2 = Math.floor(len/2)+1;      //線2の折り返し
        const end2min = len - half2;            //線2の下限インデックス

        this._animFrame++;
        const f = this._animFrame;

        //線1は[seg1From, seg1To)を昇順、線2は[seg2To, seg2From]を降順に描く
        let seg1From = 0;
        let seg1To = half1;
        let seg2From = len-1;
        let seg2To = end2min;

        if(this._phase == "grow"){
            //両端から中央へ描画されていく
            seg1To = Math.min(f*8, half1);
            seg2To = Math.max(len - f*7, end2min);
            if(seg1To >= half1 && seg2To <= end2min){
                this._phase = "hold";
                this._animFrame = 0;
            }
        }else if(this._phase == "hold"){
            //完成状態のまま約5秒待機
            if(f >= HilbertCurveP5.HOLD_FRAMES){
                this._phase = "shrink";
                this._animFrame = 0;
            }
        }else{
            //両端から中央へ消えていく
            seg1From = Math.min(f*8, half1);
            seg2From = Math.max(len-1 - f*7, end2min);
            if(seg1From >= half1 && seg2From <= end2min){
                //消え切ったらまた表示する
                this._phase = "grow";
                this._animFrame = 0;
            }
        }

        this._p5.beginShape();
        for(let i=seg1From;i<seg1To;i++){
            let v = this.path[i];

            let ox = this._p5.noise(v.x+this._p5.frameCount*0.01, v.y);
            let oy = this._p5.noise(v.x, v.y+this._p5.frameCount*0.01);

            let amp1 = 5;//Math.random()*10;
            let amp2 = 5;//Math.random()*10;
            this._p5.vertex(v.x+ox*amp1, v.y+oy*amp2);
            //this._p5.circle(v.x,v.y,2);
        }
        this._p5.endShape();


        this._p5.beginShape();
        for(let i=seg2From;i>=seg2To;i--){
            let v = this.path[i];
            let ox = this._p5.noise(v.x+this._p5.frameCount*0.01, v.y);
            let oy = this._p5.noise(v.x, v.y+this._p5.frameCount*0.01);

            this._p5.vertex(v.x+ox*5, v.y+oy*5);
            //this._p5.circle(v.x,v.y,2);
        }
        this._p5.endShape();



    }

    generateMultiOrderHilbert() {
        // 全体（1x1の正方形内）から開始
        // orderMapのサイズに合わせて、初期の再帰レベルを調整
        this.path = [];
        // use inner drawing area after margins
        const innerW = Math.max(0, this._width - this._marginX * 2);
        const innerH = Math.max(0, this._height - this._marginY * 2);
        this.hilbert(
            this._marginX, this._marginY, innerW,
            0, 0, innerH, 0
        );
    }

    hilbert(x: number, y: number, xi: number, xj: number, yi: number, yj: number, currentLevel: number) {
    // 1. セル判定用の座標（中心点）を計算
    // -0.5 などの定数を排除し、ベクトルの中心を正確に捉えます
    let centerX = x + (xi + yi) / 2;
    let centerY = y + (xj + yj) / 2;

    // map center into the orderMap grid using inner drawing area (respect margins)
    const innerW = Math.max(0, this._width - this._marginX * 2);
    const innerH = Math.max(0, this._height - this._marginY * 2);
    let gridX = this._p5.floor(this._p5.map(centerX - this._marginX, 0, innerW, 0, this.orderMap[0].length));
    let gridY = this._p5.floor(this._p5.map(centerY - this._marginY, 0, innerH, 0, this.orderMap.length));

    gridX = this._p5.constrain(gridX, 0, this.orderMap[0].length - 1);
    gridY = this._p5.constrain(gridY, 0, this.orderMap.length - 1);

    let targetOrder = this.orderMap[gridY][gridX];

    if (currentLevel >= targetOrder) {
        // 目標の深さに達したら座標を追加
        this.path.push(this._p5.createVector(centerX, centerY));
    } else {
        // 2. 4つのサブセクションに分割して再帰
        // 各象限の開始位置を正確に指定します
        
        // 左下 (または回転に応じた第1象限)
        this.hilbert(x, y, yi / 2, yj / 2, xi / 2, xj / 2, currentLevel + 1);
        
        // 左上 (第2象限)
        this.hilbert(x + xi / 2, y + xj / 2, xi / 2, xj / 2, yi / 2, yj / 2, currentLevel + 1);
        
        // 右上 (第3象限)
        this.hilbert(x + xi / 2 + yi / 2, y + xj / 2 + yj / 2, xi / 2, xj / 2, yi / 2, yj / 2, currentLevel + 1);
        
        // 右下 (第4象限): 座標計算を修正
        // x + xi/2 + yi/2 ではなく、ベクトルの向きを考慮した終点付近から開始
        this.hilbert(x + xi / 2 + yi - 1, y + xj / 2 + yj - 1, -yi / 2, -yj / 2, -xi / 2, -xj / 2, currentLevel + 1);
        
        // ※ヒント: -1 はピクセル調整用ですが、浮動小数点で計算する場合は 
        // x + xi/2 + (yi/2) でも動作しますが、オリジナルのロジックに合わせるなら yi が必要です。
    }
}

    resize(){

       
        
    }
    
}

