export class BitmapData{

    private _context:CanvasRenderingContext2D;
    public _imageData:ImageData;
    private _img:HTMLImageElement;
    private _width:number;
    private _height:number;
    private _mean:number=0;
    private _canvas:HTMLCanvasElement;
    private _callback:()=>void;

    constructor(){

    }

    init(
        url:string,name:string,width:number,height:number,callback:()=>void
    ){

        this._callback = callback;

        this._canvas    = document.createElement("canvas");// == 
        this._canvas.id = ""+name;//"bitmap";      
        this._context   = this._canvas.getContext("2d");

        this._canvas.width = width;
        this._canvas.height = height;
        this._width = width;
        this._height = height;

        this._img = document.createElement("img") as HTMLImageElement; //new ImageElement();
        this._img.onload = ()=>{
            this._onLoad();
        }
        this._img.src = url;//"image2.gif?" + new Date().getTime();
        
        //document.body.appendChild(this._img);
        //document.body.appendChild(this._canvas)
    }

    private _onLoad(){

        this._context.drawImage(
            this._img, 
            0, 0, this._img.width, this._img.height, 
            0, 0, this._width, this._height
        );
        
        this._imageData = this._context.getImageData(0, 0, this._width, this._height);
        
        

        window.addEventListener("keydown",(e)=>{
            if(e.key=="s"){
                this.setPattern();
                this.save();
            }
        });

        this._callback();

    }


    public setPattern(){

        for(let j=0;j<this._height;j++){
            for(let i=0;i<this._width;i++){
                let index:number = (i + j*this._width) * 4;


                let cc = this._imageData.data[ index ];
                if(cc==0) continue;

                let c = 255;
                if(j%2==0){
                    c= (i%4<=1) ? 0 : 255;
                }else{
                    c= (i%4>=2) ? 0 : 255;
                }

                this._imageData.data[ index ] = c;
                this._imageData.data[ index + 1 ] = c;
                this._imageData.data[ index + 2 ] = c;
                this._imageData.data[ index + 3 ] = 255;      

            }
        }

    }


    public save(){

        // ImageData をキャンバスに描画
        this._context.putImageData(this._imageData, 0, 0);

        // PNG 保存処理
        //document.getElementById("saveBtn").addEventListener("click", () => {
            const link = document.createElement("a");
            link.download = "output.png"; // 保存するファイル名
            link.href = this._canvas.toDataURL("image/png");
            link.click();
        //});

    }


    public setPixel(x:number, y:number, rr:number,gg:number,bb:number){

        let index:number = (x + y*this._width) * 4;
        this._imageData.data[ index ] = rr;
        this._imageData.data[ index + 1 ] = gg;
        this._imageData.data[ index + 2 ] = bb;
        //let a:number = this._imageData.data[ index + 3 ];        

    }

    public getPixel(x:number, y:number):number {
        
        let index:number = (x + y*this._width) * 4;
        let r:number = this._imageData.data[ index ];
        let g:number = this._imageData.data[ index + 1 ];
        let b:number = this._imageData.data[ index + 2 ];
        let a:number = this._imageData.data[ index + 3 ];
        
        return (r+g+b)/3;
    }

    public getPixelR(rx:number, ry:number):number{

        return this.getPixel(
            Math.floor(rx*this._width*0.99999),
            Math.floor(ry*this._height*0.99999)            
        )

    }



    
    public getHensa(
        xx:number,yy:number,ww:number,hh:number,per:number=1
    ):number{
        
        let m = this.getMean(xx,yy,ww,hh,per);
        

        let sum = 0;
        let nn = 0;
        for(let j=yy;j<yy+hh;j++){
            for(let i=xx;i<xx+ww;i++){
                if(Math.random()<per){
                    sum += Math.abs( m-this.getPixel(xx,yy) )
                    nn++;    
                }
            }
        }

        return sum/nn;

    }

    //平均値を取得する
    public getMean(
        xx:number,yy:number,ww:number,hh:number,per:number
    ):number{
        let m = 0;
        let num = 0;
        for(let j=yy; j<yy+hh; j++){
            for(let i=xx; i<xx+ww; i++){
                if( Math.random()< per ){
                    m += this.getPixel(i,j);
                    num++;
                }
            }
        }
        return m/num;
    }


}