import { Point } from "./Point";

export class Rect {

    x: number = 0;
    y: number = 0;
    w: number = 0;
    h: number = 0;

    constructor(x:number, y:number, w:number, h:number) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
    
    contains(point:Point) {
      if (point.x >= this.x - this.w &&
         point.x < this.x + this.w &&
         point.y >= this.y - this.h &&
         point.y < this.y + this.h) {
        return true;
      } else {
        return false;
      }
    }
    
    intersects(boundary:Rect) {
      let boundaryR = boundary.x + boundary.w;
      let boundaryL = boundary.x - boundary.w;
      let boundaryT = boundary.y - boundary.h;
      let boundaryB = boundary.y + boundary.h;
      
      let rangeR = this.x + this.w;
      let rangeL = this.x - this.w;
      let rangeT = this.y - this.h;
      let rangeB = this.y + this.h;
      
      if (boundaryR >= rangeL &&
         boundaryL <= rangeR &&
         boundaryT <= rangeB &&
         boundaryB >= rangeT) {
        return true;
      } else {
        return false;
      }
      
    }
  }