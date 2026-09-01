
//https://neort.io/createfromjs/bp4e9dc3p9f2ibmm0p60

import p5 from "p5";

export class WaveSimulation{

    k:number = 0.8;
    attenuation:number = 0.96;//げんすい
    impulseStrength:number = 8;
    public pos:number[] = [];
    vel:number[] = [];
    MAX:number = 500;

    constructor(){
        for(let i = 0; i < this.MAX; i++){
            this.pos[i] = 0;
            this.vel[i] = 0;
        }
    }


    impulse(){
        let idx = Math.floor(this.MAX*Math.random());

        let num=4+Math.floor(2*Math.random());
        let value = this.impulseStrength * Math.sign(Math.random()-0.5);
        for(let i=-num;i<=num;i++){
            if(idx+i>=0 && idx+i<this.MAX){
                let idxx =idx+i;
                if(idxx<0)idxx=this.vel.length-1+idxx;
                else idxx = idxx % this.vel.length;
                this.vel[idxx] += value * ((num-Math.abs(i))/num);
            }
        }

        //this.vel[idx] += this.impulseStrength * (Math.random()-0.5);


    }
    
    draw(p5:p5=null) {
        

        this.updateWave(p5);


    }

    // 波のアップデート処理
    updateWave(p5:p5=null) {


        for (var x = 0; x < this.MAX; x++) {
             // 現在の波の高さにラプラシアンフィルタをかけ、
             // それを加速度とする。

             let prev = (x==0)?0:this.pos[x-1];
             let next = (x==this.MAX-1)?0:this.pos[x+1];
            var accel = prev - 2 * this.pos[x] + next;

             // 伝播速度を掛ける
            accel *= this.k;

            // 現在の速度に加速度を足し、さらに減衰率を掛ける
            this.vel[x]= (this.vel[x] + accel) * this.attenuation;
            
            //ためしに、戻る方向のベクトル
            this.vel[x] += (0-this.pos[x])/20;
        }
	
		for (var x = 1; x < this.MAX - 1; x++) {
            this.pos[x] += this.vel[x];

            if(p5!=null){
                p5.circle(
                    x*10,
                    this.pos[x]*10+500,
                    5
                );
            }

		}

    }


}


/*

var k = 0.9;
var attenuation = 0.9;

var pos = []
var vel = [];
var MAX = 100;

var rain = {
	idx:0,t:0
}

function setup() {
	for(var i=0;i<MAX;i++){
		pos[i] = 0;
		vel[i] = 0;
	}
	createCanvas(windowWidth, windowHeight);
    
}



function draw() {
	background(255);
	stroke(0,0,255);
	strokeWeight(40);
	
	for(var i=0;i<MAX-1;i++){
		//circle(i/MAX*width,height/2+pos[i],30);
		line(
			i/MAX*width,height/2+pos[i],
			(i+1)/MAX*width,height/2+pos[i+1]
		);
	}

	updateWave();
	if(random()<0.08){
		
		var i = Math.floor(8+random()*(MAX-16));
		var amp = 100+300 * (random());
		vel[i-4] += amp * 0.1;
		vel[i-3] += amp * 0.2;
		vel[i-2] += amp * 0.3;
		vel[i-1] += amp * 0.5;
		vel[i+0] += amp * 0.8;
		vel[i+1] += amp * 0.5;
		vel[i+2] += amp * 0.3;
		vel[i+3] += amp * 0.2;
		vel[i+4] += amp * 0.1;
		//rain.sx=;
		//rain.sy=0;
		//rain.ex=i/MAX*width;
    //rain.ey=height/2+pos[i];
		rain.idx=i;
		rain.t=0;
	}
	
	if(rain.t++<13){
		var px = rain.idx/MAX*width;
		var yy = height/2+pos[rain.idx];
		var rr = rain.t/12;
        
		strokeWeight(20);
		line(px,yy*rr,px,yy);
	}
	
}

// 波のアップデート処理
function updateWave() {
    for (var x = 1; x < MAX - 1; x++) {
             // 現在の波の高さにラプラシアンフィルタをかけ、
             // それを加速度とする。
            var accel = pos[x-1] - 2 * pos[x] + pos[x+1];
			
             // 伝播速度を掛ける
            accel *= k;

            // 現在の速度に加速度を足し、さらに減衰率を掛ける
            vel[x]= (vel[x] + accel) * attenuation;
            
            //ためしに、戻る方向のベクトル
            vel[x] += (0-pos[x])/20;
    }
	
		for (var x = 1; x < MAX - 1; x++) {
            pos[x] += vel[x];
		}
}

*/