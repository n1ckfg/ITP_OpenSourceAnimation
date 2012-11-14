//this will give you hardware-accelerated 3D on both Processing 1.5 and Processing 2 beta.
import processing.opengl.*;

int sW,sH;
int sD = 500;
int fps = 60;

PVector p,s;
PVector[] uv = new PVector[4];
PImage img;

boolean texFreeze = false;

void setup(){
  img = loadImage("test.jpg");
  sW = img.width;
  sH = img.height;
  size(sW,sH,OPENGL);
  frameRate(fps);
  smooth();
  p = new PVector(320,240,0);
  s = new PVector(150,150);
  uvUpdate();
}

void draw(){
  background(127);
  
  if(mousePressed) p = new PVector(mouseX,mouseY,0);
  
  pushMatrix();
  beginShape(QUADS);
  if(!texFreeze){
    strokeWeight(3);
    stroke(255,0,255);
    texture(img);
    vertex(p.x-(s.x/2),p.y-(s.y/2),p.z,p.x-(s.x/2),p.y-(s.y/2));
    stroke(0,0,255);
    vertex(p.x+(s.x/2),p.y-(s.y/2),p.z,p.x+(s.x/2),p.y-(s.y/2));
    stroke(255,0,0);
    vertex(p.x+(s.x/2),p.y+(s.y/2),p.z,p.x+(s.x/2),p.y+(s.y/2));
    stroke(0,255,0);
    vertex(p.x-(s.x/2),p.y+(s.y/2),p.z,p.x-(s.x/2),p.y+(s.y/2));
  }else{
    strokeWeight(1);
    stroke(0);
    texture(img);
    vertex(p.x-(s.x/2),p.y-(s.y/2),p.z,uv[0].x,uv[0].y);
    vertex(p.x+(s.x/2),p.y-(s.y/2),p.z,uv[1].x,uv[1].y);
    vertex(p.x+(s.x/2),p.y+(s.y/2),p.z,uv[2].x,uv[2].y);
    vertex(p.x-(s.x/2),p.y+(s.y/2),p.z,uv[3].x,uv[3].y);
  }
  endShape(CLOSE);
  popMatrix();
}

void keyPressed(){
  texFreeze = !texFreeze;
  uvUpdate();
}

void uvUpdate(){
uv[0] = new PVector(p.x-(s.x/2),p.y-(s.y/2));
uv[1] = new PVector(p.x+(s.x/2),p.y-(s.y/2));
uv[2] = new PVector(p.x+(s.x/2),p.y+(s.y/2));
uv[3] = new PVector(p.x-(s.x/2),p.y+(s.y/2));
}
