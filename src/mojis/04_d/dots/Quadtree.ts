//import { p5Main } from "../p5Main";
import { DifferentialGrothP5 } from "../DifferentialGrothP5";
import { Circle } from "./Circle";
import { Node } from "./Node";
import { Point } from "./Point";
import { Rect } from "./Rect";

export class QuadTree {

    capacity: number;
    boundary: Rect;
    points: Point[];
    divided: boolean;

    northeast: QuadTree;
    northwest: QuadTree;
    southeast: QuadTree;
    southwest: QuadTree;

    constructor(boundary:Rect, capacity:number) {
      this.boundary = boundary;
      this.capacity = capacity;
      this.points = [];
      this.divided = false;
    }
    
    clearQuadtree() {
      this.points = [];
      this.divided = false;
    }
    
    insert(point:Point) {
      if (!this.boundary.contains(point)) {
        return false
      }
      
      if (this.points.length < this.capacity) {
        this.points.push(point);
        return true;
      } else {
        if (!this.divided) {
          this.subdivide(); 
        }
        
        if (this.northeast.insert(point)) {
          return true;
        } else if (this.northwest.insert(point)) {
          return true;
        } else if (this.southeast.insert(point)) {
          return true;
        } else if (this.southwest.insert(point)) {
          return true;
        }
      }
      
      return false;
    }
    
    subdivide() {
      let x = this.boundary.x;
      let y = this.boundary.y;
      let w = this.boundary.w;
      let h = this.boundary.h;
      
      let northeastBoundary = new Rect(x + w/2, y - h/2, w/2, h/2);
      this.northeast = new QuadTree(northeastBoundary, this.capacity);
      let northwestBoundary = new Rect(x - w/2, y - h/2, w/2, h/2);
      this.northwest = new QuadTree(northwestBoundary, this.capacity);
      let southeastBoundary = new Rect(x + w/2, y + h/2, w/2, h/2);
      this.southeast = new QuadTree(southeastBoundary, this.capacity);
      let southwestBoundary = new Rect(x - w/2, y + h/2, w/2, h/2);
      this.southwest = new QuadTree(southwestBoundary, this.capacity);
      
      this.divided = true;
      
    }
    
    query(range:Circle, found:Node[]) {
      if (!range.intersects(this.boundary)) {
        return false;
      } else {
        for (let i=0; i<this.points.length; i++) {
          if (range.contains(this.points[i])) {
            found.push(this.points[i].userData);
          }
        }
        
        if (this.divided) {
          this.northeast.query(range, found);
          this.northwest.query(range, found);
          this.southeast.query(range, found);
          this.southwest.query(range, found);
        }
      }
      
      return found;
      
    }
    
    display() {
      
      /*
      let p5 = DifferentialGrothP5._p5;
        p5.stroke(100);
        p5.noFill();
        p5.rectMode(p5.CENTER);
        p5.rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2); 
      
      if (this.divided) {
        this.northeast.display();
        this.northwest.display();
        this.southeast.display();
        this.southwest.display();
      }*/
    }
  }