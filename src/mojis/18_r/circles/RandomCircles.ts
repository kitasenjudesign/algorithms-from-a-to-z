import * as THREE from 'three';
import { Matrix4, Mesh, Texture, TextureLoader, Vector3 } from 'three';
import waveRender_vert from "../glsl/waveRender.vert";
import waveRender_frag from "../glsl/waveRender.frag";
import { CircleObj } from './CircleObj';
import { p5MainRd } from '../myP5/p5MainRd';
import { Params } from '../../../data/Params';
import { ParamsRd } from '../data/ParamsRd';

export class RandomCircles extends THREE.Object3D{

    circles:Mesh[];
    yy:number=0;
    count:number=0;
    size:number=80;
    flag:boolean=false;
    constructor(){
        super();

        this.circles = [];
        for(let i=0;i<2;i++){

            let m:THREE.Mesh = new THREE.Mesh(
                new THREE.CircleGeometry(0.9+0.3*Math.random(),10),
                new THREE.MeshBasicMaterial({color:0xffffff})
            );
            
            this.circles.push(m);
            this.add(m);
        }

        ParamsRd.gui.add(this,"size",0,512).step(1);


    }

    update(){
        
        if( p5MainRd.Instance){

            try{
                
                //console.log("pos:",pos);
                for(let i=0;i<this.circles.length;i++){
                    let ss = 1;
                    let pos = p5MainRd.Instance.getRandomPos();
                    this.circles[i].scale.set(ss,ss,ss);
                    this.circles[i].position.set(
                       72*(pos.x-0.5),
                       72*((1-pos.y)-0.5),
                       0
                    );            
                }
                this.flag=true;

            }catch(e){
                this.flag=false;
            }

        }



        this.count++;
        if(this.count>60){
            this.visible = false;//!this.visible;
        }
        if(this.count==120){
            this.visible = true;
            this.count=0;
        }
        /*
        for(let i=0;i<this.circles.length;i++){
            let ss:number = 0.4;
            if(Math.random()<0.1){
                ss=10*Math.random();
            }
            if(Math.random()<0.001){
                ss=30;
            }

            
            this.circles[i].scale.set(ss,ss,ss);
            this.circles[i].position.set(
                0,//100*(Math.random()-0.5),
                0,//100*(Math.random()-0.5),
                0
            );
        }*/

    }

}