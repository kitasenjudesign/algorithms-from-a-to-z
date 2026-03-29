

export class JavisPoint{

    public ratio:number = 0;
    public index:number = 0;

    public offsetX:number = 0;
    public offsetY:number = 0;

    public vx:number = Math.random()*2-1;
    public vy:number = Math.random()*2-1;

    public random:boolean = false;

    public update(){



        this.offsetX += this.vx;
        this.offsetY += this.vy;
        this.vx *= 0.99;
        this.vy *= 0.99;
    }
}