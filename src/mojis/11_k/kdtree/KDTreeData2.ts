import p5 from "p5";
import { KDTree } from "./KDTree";
import { Colors } from "../data/Colors";
import { KDTreeData } from "./KDTreeData";

export class KDTreeData2 extends KDTreeData{


    override makeNewTreeData(parent:KDTreeData,depth:number):KDTreeData{
        return new KDTreeData2(parent, depth);
    }

    draw(x:number,y:number,w:number,h:number,p5:p5){

        if(!this.hasChildren() || this.isLast){

            /*
            p5.fill(
                this.rr,
                this.gg,
                this.bb,
                128
//                this.aa
            );*/
            
            if(w*h>=1){
                p5.push(); // 現在の座標系を保存

                // 回転の中心を設定
                p5.translate(
                    x + w / 2+this.ox, y + h / 2+this.oy);
        
                // 回転角度を設定 (例: フレーム数に基づいて回転)
                p5.rotate(this.or); // ラジアンで指定
        
                // 色を設定
                //this.fill=0.5
                p5.fill(this.rr, this.gg, this.bb, this.aa);//this.aa);
        
                // rect を描画 (中心を基準に描画)
                p5.rect(-w / 2, -h / 2, w* this.fill, h);


                p5.fill(this.rr2, this.gg2, this.bb2, this.aa2);//this.aa);
                p5.rect(-w / 2 + w*this.fill, -h / 2, w*(1-this.fill), h);
                
        
                p5.pop(); // 座標系を元に戻す
            }

            this.x = x;// + w / 2;
            this.y = y;// + h / 2;
            this.w = w;
            this.h = h;
            
            //console.log("aaaaa")
            //p5.fill(0,0,0,255);
            //p5.textSize(10);
            /*p5.text(
                "L"+this.children.length + " W"+this.weight.toFixed(2),
                
                this.x+this.w/2,this.y+this.h/2);*/
            return;
        }
        
        //weightによって
        let weight1 = this.children[0].getWeight();
        let weight2 = this.children[1].getWeight();
        let ratio = weight1 / (weight1 + weight2);

        if(this.topdown){

            ratio = this.ratio;

        }


        if(true){
            //横分割
            this.children[0].draw(
                x, 
                y,
                w*ratio,
                h,
                p5
            );
            this.children[1].draw(
                x + w*ratio,
                y, 
                w * (1 - ratio), 
                h, 
                p5
            );            
        }else{
            //縦分割
            this.children[0].draw(
                x, 
                y,
                w,
                h*ratio,
                p5
            );
            this.children[1].draw(
                x,
                y + h*ratio, 
                w, 
                h * (1 - ratio), 
                p5
            );   
            

        }

    }


}