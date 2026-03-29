import * as THREE from 'three';
import { DataTexture, Vector2 } from 'three';
import { ParamsG } from '../data/ParamsG';

export class RuleTex{

    public dataTex:DataTexture;
    public size:THREE.Vector2;

    constructor() 
    {
        let ruleTexWidth = 32;
        let len = ruleTexWidth*ruleTexWidth;
        var data = new Float32Array(len*4);

        //http://www.mirekw.com/ca/rullex_life.html
        

        let ruleList = [
            /*
             1,2,3,4,5,6,7,8,9
            */
            //SurviveとBirth
            [1,1,1,1,1,1,1,1,1,  0,0,0,0,0,0,0,0,0],
            [0,0,1,1,0,0,0,0,0,  0,0,0,1,0,0,1,0,0],//10 23/36 highlife
            [0,0,1,1,0,0,0,0,0,  0,0,0,1,0,0,0,0,0],//0 23/3 lifegame
            [0,0,0,0,1,0,0,0,0,  0,0,0,1,1,1,1,0,0],//11 5/345 longlife

            [0,0,0,0,1,1,1,1,1,  0,0,0,1,0,0,0,0,0],//1 45678/3coral
            [1,1,1,1,1,1,1,1,0,  0,0,0,1,0,0,0,0,0],//2 012345678/3 frake
            [0,1,1,1,1,1,0,0,0,  0,0,0,1,0,0,0,0,0],//3 12345/3 maze
            [0,1,1,1,1,0,0,0,0,  0,0,0,1,0,0,0,0,0],//4 12345/3 maze
            [0,0,0,1,1,0,1,1,1,  0,0,0,1,1,0,0,0,0],//16  34 Life	34/34
            
            [0,0,1,0,1,1,0,0,0,  0,0,0,1,0,0,1,0,1],//5 245/368 move		
            [0,0,0,1,1,0,0,0,0,  0,0,0,1,1,0,0,0,0],//6 34/34 life	
            [0,1,0,1,0,1,0,0,1,  0,0,0,1,0,1,0,1,0],//7 1358/357	Amoeba	
            [0,1,1,0,0,1,0,0,0,  0,0,0,1,0,0,1,0,0],//8 125/36 2x3	

            [0,0,1,1,0,0,0,0,0,  0,0,0,1,0,0,0,0,0],//9 23/3 lifegame
            
            
            [0,0,0,0,1,1,1,1,0,  0,0,0,1,1,1,0,0,0],//12 4567/345　Assimilation
            [0,0,0,0,1,0,0,0,0,  0,0,0,1,1,1,0,0,0],//13 5/345	Stable
            [0,0,1,1,1,1,0,0,0,  0,0,0,0,1,1,1,1,1],//14 WalledCities	2345/45678	Stable
            [0,0,0,1,1,0,1,1,1,  0,0,0,1,0,0,1,1,1],//15 34678/3678 day and night
            
            
            [0,0,0,1,1,1,1,0,0,  0,0,0,1,1,1,0,0,0],//17  Assimilation	4567/345
            [0,0,1,1,0,0,0,0,1,  0,0,0,1,0,1,0,1,0],//18  Pseudo life	238/357

            [1,0,1,1,1,1,1,0,0,  0,0,0,1,0,1,0,0,1],
            [1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1],//めいろ＋バラバラ
            [1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1],//めいろ＋動き
            [1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],//めいろ＋バラバラ
            [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0],//ドット＋動き
            [0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1],//ストライプ
            [1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],//ちょい
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],//アメーバ
            [0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],//wa-mu
            [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1],//dots
            [1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1],//dots2
            //[1,1,0,0,1,1,1,1,1,  1,1,1,0,1,1,1,1,1],// 23/3 inv lifegame
     
        ];

        /*
        ruleList=[];
        for(let i=0;i<30;i++){
            let randomedRule = []
            for(let i=0;i<18;i++){
                randomedRule[i] = Math.random()<0.5 ? 1 : 0;
            }
            ruleList.push(randomedRule);    
        }

        for(let i=0;i<ruleList.length;i++){
            console.log(i,ruleList[i]);            
        }*/

        ParamsG.numRules = ruleList.length;

        


        for(let j=0; j<ruleTexWidth; j++){
            for (let i = 0; i < ruleTexWidth; i++) {

                let stride = (j*ruleTexWidth+i) * 4;

                if(j<ruleList.length && i<ruleList[0].length/2){
                    let value   = ruleList[j][i];
                    let value2  = ruleList[j][i+9];
                    if(!value) value=0;
                    if(!value2) value2=0;
                        
                    data[stride] = value;//Math.random();
                    data[stride + 1] = value2;
                    data[stride + 2] = 0;
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