import * as THREE from 'three';
import { Matrix4, Mesh, Texture, TextureLoader, Vector3 } from 'three';
import waveRender_vert from "../glsl/waveRender.vert";
import waveRender_frag from "../glsl/waveRender.frag";
import { CircleObj } from './CircleObj';

export class Circles extends THREE.Object3D{

    circles:CircleObj[];

    constructor(){
        super();
        this.circles = [];
    }

    makeObj(){

            let rad = Math.random()*Math.PI*2;
            let amp = Math.random()*20;
            let tgtPos = new THREE.Vector3(
                amp * Math.cos(rad),
                amp * Math.sin(rad),
                0
            );
            
            //ヒットしてるサークルある？
            let hitObj = this.isHitCircle(tgtPos);

            if(hitObj){
                //ヒットしてたらなにもしない
                return;
            }else{
                //ヒットしてなかったら、一番近くのオブジェを探す
                if(this.circles.length==0){
                    this.makeCircle(tgtPos,5);
                }else{
                    let c = this.getNearestCircle(tgtPos);
                    let radius = tgtPos.distanceTo(c.position)-c.r;
                    if(radius>20)radius=20;
                    if(radius>0.02){
                        this.makeCircle(tgtPos,radius);
                    }
                }
            }

    }

    makeCircle(pos:THREE.Vector3,r:number){

        //console.log("gen" + this.circles.length)
        let c = new CircleObj();
        c.makeObj(pos,r);
        this.add(c);
        this.circles.push(c);

    }



    //ヒットしてるサークルある？
    isHitCircle(p:THREE.Vector3):CircleObj{

        for(let j=0;j<this.circles.length;j++){

            let c = this.circles[j];
            let dist = c.position.distanceTo(p);
            if(dist < c.r){
                return this.circles[j];
            }
        }
        return null;

    }

    getNearestCircle(p:THREE.Vector3):CircleObj{

        let dist = 9999;
        let idx = -1;
        for(let i=0;i<this.circles.length;i++){
            let d = this.circles[i].position.distanceTo(p);
            d=d-this.circles[i].r;
            if(d<dist){
                idx = i;
                dist = d;
            }
        }

        if(idx==-1)return null;

        return this.circles[idx];

    }

    update(){

        for(let i=0;i<this.circles.length;i++){
            this.circles[i].update();
        }

        if(this.circles.length<20){
            this.makeObj();
        }

        
        if(Math.random()<0.9){
            let n = this.circles.shift();
            if(n) this.remove(n);
        }

    }

}