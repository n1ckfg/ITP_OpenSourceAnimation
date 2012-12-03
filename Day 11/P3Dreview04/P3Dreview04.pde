//this will give you hardware-accelerated 3D on both Processing 1.5 and Processing 2 beta.
import processing.opengl.*;

int sW, sH;
int sD = 500;
int fps = 60;

PVector p, s;
PVector[] uv = new PVector[4];
PVector[] vertices = new PVector[4];
Point2D[] controlPoints = new Point2D[4];
PImage img;

boolean texFreeze = false;

void setup() {
  img = loadImage("test.jpg");
  sW = img.width;
  sH = img.height;
  size(sW, sH, OPENGL);
  frameRate(fps);
  smooth();
  p = new PVector(320, 240, 0);
  s = new PVector(150, 150);
  vertexInit();
  uvUpdate();
}

void draw() {
  background(127);

  if (mousePressed) {
    if (!texFreeze) {
      p = new PVector(mouseX, mouseY, 0);

      for (int i=0;i<controlPoints.length;i++) {
       controlPoints[i].p = vertices[i];
       }
       
      vertexInit();
       
    }
  }
  vertexUpdate();

  pushMatrix();
  beginShape(QUADS);
  if (!texFreeze) {
    strokeWeight(3);
    stroke(255, 0, 255);
    texture(img);
    vertex(vertices[0].x, vertices[0].y, 0, vertices[0].x, vertices[0].y);
    stroke(0, 0, 255);
    vertex(vertices[1].x, vertices[1].y, 0, vertices[1].x, vertices[1].y);
    stroke(255, 0, 0);
    vertex(vertices[2].x, vertices[2].y, 0, vertices[2].x, vertices[2].y);
    stroke(0, 255, 0);
    vertex(vertices[3].x, vertices[3].y, 0, vertices[3].x, vertices[3].y);
  }
  else {
    strokeWeight(1);
    stroke(0);
    texture(img);
    vertex(vertices[0].x, vertices[0].y, 0, uv[0].x, uv[0].y);
    vertex(vertices[1].x, vertices[1].y, 0, uv[1].x, uv[1].y);
    vertex(vertices[2].x, vertices[2].y, 0, uv[2].x, uv[2].y);
    vertex(vertices[3].x, vertices[3].y, 0, uv[3].x, uv[3].y);
  }
  endShape(CLOSE);
  popMatrix();

  for (int i=0;i<controlPoints.length;i++) {
    controlPoints[i].run();
    if (controlPoints[i].clicked) controlPoints[i].p = new PVector(mouseX, mouseY);
  }
}

void vertexInit() {
  controlPoints[0] = new Point2D(p.x-(s.x/2), p.y-(s.y/2));
  controlPoints[1] = new Point2D(p.x+(s.x/2), p.y-(s.y/2));
  controlPoints[2] = new Point2D(p.x+(s.x/2), p.y+(s.y/2));
  controlPoints[3] = new Point2D(p.x-(s.x/2), p.y+(s.y/2));
}

void vertexUpdate() {
  vertices[0] = controlPoints[0].p;
  vertices[1] = controlPoints[1].p;
  vertices[2] = controlPoints[2].p;
  vertices[3] = controlPoints[3].p;
}

void uvUpdate() {
  uv[0] = new PVector(p.x-(s.x/2), p.y-(s.y/2));
  uv[1] = new PVector(p.x+(s.x/2), p.y-(s.y/2));
  uv[2] = new PVector(p.x+(s.x/2), p.y+(s.y/2));
  uv[3] = new PVector(p.x-(s.x/2), p.y+(s.y/2));
  println("("+uv[0].x + ", " + uv[0].y+"), " + "("+uv[1].x + ", " + uv[1].y+"), " + "("+uv[2].x + ", " + uv[2].y+"), " + "("+uv[3].x + ", " + uv[3].y+")");
}

