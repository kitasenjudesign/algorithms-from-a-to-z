import p5 from "p5";
import { Circle } from "../04_d/dots/Circle";
import { Point } from "../04_d/dots/Point";
import { QuadTree } from "../04_d/dots/Quadtree";
import { Rect } from "../04_d/dots/Rect";

export class Boid {

    p5: p5;
    visible: boolean = false;
    position: p5.Vector;
    prevPosition: p5.Vector;
    velocity: p5.Vector;
    acceleration: p5.Vector;
    maxSpeed: number;
    maxForce: number;
    perceptionRadius: number;
    separationRadius: number;
    public count:number=0;
    countLimit:number=100;
    startLimit:number = 0;

    constructor(p: p5, x: number, y: number) {
        this.p5 = p;
        this.position = p.createVector(x, y);
        const angle = p.random(p.TWO_PI);
        this.velocity = p.createVector(Math.cos(angle), Math.sin(angle));
        this.velocity.mult(p.random(1, 2));
        this.acceleration = p.createVector(0, 0);
        this.maxSpeed = 6.5;
        this.maxForce = 0.2;
        this.perceptionRadius = 50;
        this.separationRadius = 24;
        this.countLimit=100+300*Math.random();
        this.startLimit=Math.floor(30*Math.random());
        if(Math.random()<0.1){
            this.startLimit=0;
        }
    }

    applyForce(force: p5.Vector) {
        this.acceleration.add(force);
    }

    flock(neighbors: Boid[]) {
    if (!this.visible) return;
    // ignore invisible neighbors
    const visibleNeighbors = neighbors.filter(n => n && (n.visible !== false));

    const alignment = this.align(visibleNeighbors);
    const cohesion = this.cohesion(visibleNeighbors);
    const separation = this.separation(visibleNeighbors);

        alignment.mult(1.0);
        cohesion.mult(0.8);
        separation.mult(1.2);

        this.applyForce(alignment);
        this.applyForce(cohesion);
        this.applyForce(separation);
    }

    align(neighbors: Boid[]) {
        const steering = this.p5.createVector(0, 0);
        let total = 0;
        for (let i = 0; i < neighbors.length; i++) {
            const other = neighbors[i];
            if (other === this) {
                continue;
            }
            steering.add(other.velocity);
            total += 1;
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    cohesion(neighbors: Boid[]) {
        const steering = this.p5.createVector(0, 0);
        let total = 0;
        for (let i = 0; i < neighbors.length; i++) {
            const other = neighbors[i];
            if (other === this) {
                continue;
            }
            steering.add(other.position);
            total += 1;
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    separation(neighbors: Boid[]) {
        const steering = this.p5.createVector(0, 0);
        let total = 0;
        for (let i = 0; i < neighbors.length; i++) {
            const other = neighbors[i];
            if (other === this) {
                continue;
            }
            const d = this.p5.dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (d > 0 && d < this.separationRadius) {
                const diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d);
                steering.add(diff);
                total += 1;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    update() {

        this.count++;
        if(this.startLimit==this.count){
            this.visible=true;
        }

        if (!this.visible) return;

        if(this.countLimit<this.count){
            this.visible=false;
        }

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    edges(width: number, height: number) {
        if (!this.visible) return;

        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    draw() {
        if (!this.visible) return;

        const theta = this.velocity.heading() + this.p5.HALF_PI;

        this.p5.line(
            this.position.x,
            this.position.y,
            this.position.x + this.velocity.x,
            this.position.y + this.velocity.y
        );

        /*
        this.p5.push();
        this.p5.translate(this.position.x, this.position.y);
        this.p5.rotate(theta);
        this.p5.beginShape();
        this.p5.vertex(0, -6);
        this.p5.vertex(-4, 6);
        this.p5.vertex(4, 6);
        this.p5.endShape(this.p5.CLOSE);
        this.p5.pop();*/

    }
}