
import p5, { Graphics, Shader } from "p5";
import { FontManager } from "../../font/FontManager";
import { PathWrapper } from "../../font/PathWrapper";

export class MazeP5b{

    /*
let cell = 10;
let cols, rows;
let valid = [], visited = [], walls = [];
let entrance, exit, path = [];

function setup() {
  createCanvas(800, 800);
  pixelDensity(1);
  noLoop();

  maskG = createGraphics(width, height);
  maskG.background(255);
  maskG.fill(0);
  maskG.textAlign(CENTER, CENTER);
  maskG.textSize(600);
  maskG.text("M", width/2, height/2 + 80);

  cols = floor(width / cell);
  rows = floor(height / cell);

  maskG.loadPixels();

  for (let c = 0; c < cols; c++) {
    valid[c] = []; visited[c] = []; walls[c] = [];
    for (let r = 0; r < rows; r++) {
      const x = floor((c + 0.5) * cell);
      const y = floor((r + 0.5) * cell);
      const idx = 4 * (y * width + x);
      const v = maskG.pixels[idx];
      valid[c][r] = (v < 128);
      visited[c][r] = false;
      walls[c][r] = {N:true,E:true,S:true,W:true};
    }
  }

  generateMaze();
  makeEntranceExit();
  path = solveMaze();
  drawMaze();
}

function generateMaze() {
  let stack = [];
  let start = findFirstValid();
  if (!start) return;

  visited[start.c][start.r] = true;
  stack.push(start);

  while (stack.length) {
    let cur = stack[stack.length-1];
    let nbs = neighbors(cur.c, cur.r).filter(n => !visited[n.c][n.r]);
    if (nbs.length === 0) stack.pop();
    else {
      let next = random(nbs);
      removeWall(cur, next);
      visited[next.c][next.r] = true;
      stack.push(next);
    }
  }
}

function findFirstValid() {
  for (let c=0;c<cols;c++)
    for (let r=0;r<rows;r++)
      if (valid[c][r]) return {c,r};
  return null;
}

function neighbors(c,r) {
  let n=[];
  if (r>0 && valid[c][r-1]) n.push({c,r:r-1,d:"N"});
  if (c<cols-1 && valid[c+1][r]) n.push({c:c+1,r,d:"E"});
  if (r<rows-1 && valid[c][r+1]) n.push({c,r:r+1,d:"S"});
  if (c>0 && valid[c-1][r]) n.push({c:c-1,r,d:"W"});
  return n;
}

function removeWall(a,b){
  if (b.d==="N"){ walls[a.c][a.r].N=false; walls[b.c][b.r].S=false; }
  if (b.d==="E"){ walls[a.c][a.r].E=false; walls[b.c][b.r].W=false; }
  if (b.d==="S"){ walls[a.c][a.r].S=false; walls[b.c][b.r].N=false; }
  if (b.d==="W"){ walls[a.c][a.r].W=false; walls[b.c][b.r].E=false; }
}

function makeEntranceExit() {
  let minC = cols, maxC = 0;

  for (let c=0;c<cols;c++)
    for (let r=0;r<rows;r++)
      if (valid[c][r]) {
        if (c < minC) { minC = c; entrance = {c,r}; }
        if (c > maxC) { maxC = c; exit = {c,r}; }
      }

  walls[entrance.c][entrance.r].W = false;
  walls[exit.c][exit.r].E = false;
}

function solveMaze() {
  let q = [entrance];
  let came = {};
  came[entrance.c+","+entrance.r] = null;

  while (q.length) {
    let cur = q.shift();
    if (cur.c===exit.c && cur.r===exit.r) break;

    for (let n of openNeighbors(cur)) {
      let key = n.c+","+n.r;
      if (!(key in came)) {
        came[key] = cur;
        q.push(n);
      }
    }
  }

  let p = [];
  let cur = exit;
  while (cur) {
    p.push(cur);
    cur = came[cur.c+","+cur.r];
  }
  return p.reverse();
}

function openNeighbors(c) {
  let out=[];
  let w = walls[c.c][c.r];
  if (!w.N) out.push({c:c.c,r:c.r-1});
  if (!w.E) out.push({c:c.c+1,r:c.r});
  if (!w.S) out.push({c:c.c,r:c.r+1});
  if (!w.W) out.push({c:c.c-1,r:c.r});
  return out.filter(n => n.c>=0 && n.c<cols && n.r>=0 && n.r<rows && valid[n.c][n.r]);
}

function drawMaze() {
  background(20);
  stroke(255); strokeWeight(2);

  for (let c=0;c<cols;c++)
    for (let r=0;r<rows;r++) if (valid[c][r]) {
      let x=c*cell,y=r*cell,w=walls[c][r];
      if (w.N) line(x,y,x+cell,y);
      if (w.E) line(x+cell,y,x+cell,y+cell);
      if (w.S) line(x,y+cell,x+cell,y+cell);
      if (w.W) line(x,y,x,y+cell);
    }

  // --- ルート ---
  noFill();
  stroke(255,0,0);
  strokeWeight(3);
  beginShape();
  for (let p of path) {
    vertex(p.c*cell+cell/2, p.r*cell+cell/2);
  }
  endShape();
}

function keyPressed(){
  if (key==='r'||key==='R') setup();
}*/
    
}

