

export class JavisPoint{

    public ratio:number = 0;
    public index:number = 0;

    public offsetX:number = 0;
    public offsetY:number = 0;

    public vx:number = Math.random()*2-1;
    public vy:number = Math.random()*2-1;

    public random:boolean = false;

    public x:number = 0;
    public y:number = 0;

    public px:number = 0;
    public py:number = 0;

    public updateV(){

        this.vx = this.x-this.px;
        this.vy = this.y-this.py;
        this.px = this.x;
        this.py = this.y;

    }
}