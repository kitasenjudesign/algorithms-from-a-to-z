export class Point {
    
    x: number = 0;
    y: number = 0;
    baseX: number = 0;
    baseY :number = 0;
    userData: any = null;
    
    constructor(x:number, y:number, userData:any = null) {
      
        this.x = x; 
        this.y = y; 
        this.userData = userData;

    }

}