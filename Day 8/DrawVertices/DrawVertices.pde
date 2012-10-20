import saito.objloader.*;

int sW = 640;
int sH = 360;
int dW = 1920;
int dH = 1080;

OBJModel model;
String OBJModelName = "cubic_sphere.obj";

float rotX;
float rotY;
float scaleNum = 3;
float normLength = -25;
int counter=1;

void setup() {
  size(sW,sH, P3D);

  model = new OBJModel(this, OBJModelName);

  model.scale(scaleNum);
  model.translateToCenter();
}

void draw() {
  background(0);
  pushMatrix();
  translate(width/2, height/2, 0);
  for (int j = 0; j < model.getSegmentCount(); j++) {
    Segment segment = model.getSegment(j);
    Face[] faces = segment.getFaces();
    beginShape(QUADS);
    for (int i = 0; i < faces.length; i++) {
      Face f = faces[i];
      PVector[] vs = f.getVertices();
      for (int k = 0; k < vs.length; k++) {
        vertex(vs[k].x, vs[k].y, vs[k].z);
        fill(255, 0, 0);
        pushMatrix();
        translate(vs[k].x, vs[k].y, vs[k].z);
        ellipseMode(CENTER);
        ellipse(0, 0, 5, 5);
        popMatrix();
      }
    }
    endShape();
  }
  popMatrix();
}

void mouseDragged() {
  rotX += (mouseX - pmouseX) * 0.01;
  rotY -= (mouseY - pmouseY) * 0.01;
}

void keyPressed(){
AEkeysMain();
exit();
}







