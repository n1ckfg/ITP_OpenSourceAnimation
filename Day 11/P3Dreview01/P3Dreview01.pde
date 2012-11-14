//this will give you hardware-accelerated 3D on both Processing 1.5 and Processing 2 beta.
import processing.opengl.*;

int sW = 640;
int sH = 480;
int sD = 500;

PVector p,s;

void setup(){
  size(640,480,OPENGL);
  p = new PVector(320,240,0);
  s = new PVector(100,100);
}

void draw(){
  background(127);
  pushMatrix();
  translate(p.x,p.y,random(sD)-(sD/2));
  fill(255,0,0);
  noStroke();
  ellipseMode(CENTER);
  ellipse(0,0,s.x,s.y);
  popMatrix();
}

