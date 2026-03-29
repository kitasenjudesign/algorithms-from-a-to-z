import * as THREE from 'three';
import { DataTexture, Vector2 } from 'three';
import { ParamsG } from '../data/ParamsG';

export class RuleTex2{

    public dataTex:DataTexture;
    public size:THREE.Vector2;

    constructor() 
    {
        let ruleTexWidth = 32;
        let len = ruleTexWidth*ruleTexWidth;
        var data = new Float32Array(len*4);

        let numRule = 3;
        //http://www.mirekw.com/ca/rullex_life.html
        

        let ruleList = [
            //(S/B/C)
            //[0,0,0,1,1,0,1,1,0,  0,0,1,0,0,1,0,0,0, 0.6,0,0,0,0,0,0,0],//Worms	3467/25/6	Exploding
            [1,0,1,1,0,1,1,1,1,  0,0,0,1,1,0,1,0,1, 0.9,0,0,0,0,0,0,0],//0235678/3468/9
            //[0,0,1,0,0,0,0,0,0,  0,0,1,1,1,0,0,0,0, 0.5,0,0,0,0,0,0,0],//2/234/5
            //[0,0,0,1,1,0,0,1,0,  0,0,1,1,0,0,0,0,0, 0.8,0,0,0,0,0,0,0],//347/23/8
            //[0,0,1,0,0,0,0,0,0,  0,0,1,1,1,0,0,0,0, 0.5,0,0,0,0,0,0,0],//2/234/5
            //[0,0,0,1,1,1,0,0,0,  0,0,1,0,0,0,0,0,0, 0.4,0,0,0,0,0,0,0],//345/2/4
            //[1,1,1,1,1,1,0,0,0,  0,0,0,0,1,1,0,0,1, 0.3,0,0,0,0,0,0,0],//012345/458/3
            [1,1,1,1,1,1,0,0,0,  0,0,0,0,1,1,0,0,1, 0.3,0,0,0,0,0,0,0],//2/3	Brian's Brain	Chaotic	Brian Silverman
            [0,1,1,0,0,0,0,0,0,  0,0,0,1,1,0,0,0,0, 0.3,0,0,0,0,0,0,0],//12/34/3
            
            //[0,0,1,1,0,0,0,0,0,  0,0,0,1,0,0,0,0,0],// 23/3 lifegame

        ]

        ParamsG.numRules = ruleList.length;

        


        for(let j=0; j<ruleTexWidth; j++){
            for (let i = 0; i < ruleTexWidth; i++) {

                let stride = (j*ruleTexWidth+i) * 4;

                if(j<ruleList.length && i<ruleList[0].length/numRule){
                    let value   = ruleList[j][i];
                    let value2  = ruleList[j][i+9];
                    let value3  = ruleList[j][i+9+9];
                    
                    if(!value) value=0;
                    if(!value2) value2=0;
                    if(!value3) value3=0;
                        
                    console.log(i,value,value2,value3);

                    data[stride] = value;//Math.random();
                    data[stride + 1] = value2;
                    data[stride + 2] = value3;
                    data[stride + 3] = 1;

                }else{

                    data[stride] = 0;//Math.random();
                    data[stride + 1] = 0;
                    data[stride + 2] = 0;
                    data[stride + 3] = 0;  
                }
            }
          }  
          
          
        var ruleTex = new THREE.DataTexture( 
            data, ruleTexWidth, ruleTexWidth, THREE.RGBAFormat, THREE.FloatType
        );

        ruleTex.minFilter = THREE.NearestFilter;
        ruleTex.magFilter = THREE.NearestFilter;
        ruleTex.needsUpdate = true;//必ず必要

        this.dataTex=ruleTex;
        this.size = new THREE.Vector2(ruleTexWidth,ruleTexWidth)


        //色のデータを作る
        //var data = new Float32Array(len*4);

    }




}