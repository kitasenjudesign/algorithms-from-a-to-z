import { Point } from "./Point";
import { Rect } from "./Rect";

export class Circle {

    x: number;
    y: number;
    r: number;

    constructor(x:number, y:number, r:number) {
      this.x = x;
      this.y = y;
      this.r = r;
    }
    
    contains(point:Point) {
      let distX = Math.abs(this.x - point.x);
      let distY = Math.abs(this.y - point.y);
      let distance = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
    
      if (distance <= this.r) {
        return true;
      } else {
        return false;
      }
    }
    
    intersects(boundary:Rect) {
      let closeX = this.x; 
      let closeY = this.y;
  
      if (this.x < boundary.x - boundary.w) {
        closeX = boundary.x - boundary.w;
      } else if (closeX > boundary.x + boundary.w) {
        closeX = boundary.x + boundary.w;
      }
      
      if (this.y > boundary.y + boundary.h) {
        closeY = boundary.y + boundary.h;
      } else if (this.y < boundary.y - boundary.h) {
        closeY = boundary.y - boundary.h;
      }
      
      let distX = Math.abs(this.x - closeX);
      let distY = Math.abs(this.y - closeY);
      let distance = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
      
      if (distance <= this.r) {
        return true;
      } else {
        return false;
      }
      
    }
  }