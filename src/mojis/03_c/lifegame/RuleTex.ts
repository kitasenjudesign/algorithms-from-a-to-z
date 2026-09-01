import * as THREE from 'three';
import { DataTexture, Vector2 } from 'three';
import { ParamsC } from '../data/ParamsC';

export class RuleTex{

    public dataTex:DataTexture;
    public size:THREE.Vector2;

    constructor() 
    {
        let ruleTexWidth = 8;
        let ruleTexHeight = 256;

        let len = ruleTexWidth*ruleTexHeight;
        var data = new Float32Array(len*4);

        //let ruleList = []
        //Params.numRules = ruleList.length;

        let list = []//0-256
        for(let i=0;i<256;i++){
            let str = "" + ParamsC.zeroPadding( ParamsC.convertToBinary(i),8 );
            list.push(str);
            console.log(str);
        }


        for(let j=0; j<ruleTexHeight; j++){
            let output = "";
            for (let i = 0; i < ruleTexWidth; i++) {

                let idx = i;//ruleTexWidth-1-i;
                let stride = (j*ruleTexWidth+idx) * 4;
                    //console.log( list[j].substring(i,1),parseInt( list[j].substring(i,1) ) )
                    output += "" + parseInt( list[j].substring(i,i+1) );
                    data[stride + 0] = parseInt( list[j].substring(i,i+1) );
                    data[stride + 1] = 0;
                    data[stride + 2] = 0;
                    data[stride + 3] = 0;  
                
            }
            //console.log(j,output)
          }  
          
          
        var ruleTex = new THREE.DataTexture( 
            data, ruleTexWidth, ruleTexHeight, THREE.RGBAFormat, THREE.FloatType
        );

        ruleTex.minFilter = THREE.NearestFilter;
        ruleTex.magFilter = THREE.NearestFilter;
        ruleTex.needsUpdate = true;//必ず必要

        this.dataTex=ruleTex;
        this.size = new THREE.Vector2(
            ruleTexWidth,ruleTexHeight
        );



    }


    







}