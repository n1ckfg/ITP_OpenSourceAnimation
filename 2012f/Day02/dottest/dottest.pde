import processing.opengl.*;

int sW = 640;
int sH = 360;
int dW = 1920;
int dH = 1080;
int fps = 24;
int counter=0;

PVector p;
boolean recording=false;
Data data;

ArrayList traceController;
color traceColor = color(255, 0, 0, 50);

void setup() {
  size(sW, sH, OPENGL);
  frameRate(fps);
  noCursor();
  traceController = new ArrayList();
  p = new PVector(0, 0);
  data = new Data();
  data.beginSave();
  data.add("Adobe After Effects 8.0 Keyframe Data");
  data.add("\r");
  data.add("\t"+"Units Per Second"+"\t"+fps);
  data.add("\t"+"Source Width"+"\t"+sW);
  data.add("\t"+"Source Height"+"\t"+sH);
  data.add("\t"+"Source Pixel Aspect Ratio"+"\t"+"1");
  data.add("\t"+"Comp Pixel Aspect Ratio"+"\t"+"1");
  data.add("Transform\tPosition");
  data.add("\t"+"Frame"+"\t"+"X pixels"+"\t"+"Y pixels"+"\t"+"Z pixels");
}

void draw() {
  if (recording) {
    background(100, 0, 0);
  }
  else {
    background(0);
  }
  traceHandler();
  p.x = mouseX;
  p.y = mouseY;
  strokeWeight(20);
  stroke(255, 0, 0);
  point(p.x, p.y);
  if (p.x !=0 && p.y !=0) {
    data.add("\t"+counter+"\t" + ((p.x/sW)*dW) + "\t" + ((p.y/sH)*dH) + "\t" + 0);
  }
  counter++;
}

void mousePressed() {
  if (!recording) {
    recording = true;
  }
  else {
    recording = false;
    data.add("\r");
    data.add("End of Keyframe Data");
    data.endSave("foo.txt");
    exit();
  }
}

void traceHandler(){
    if(recording){
  traceController.add(new PVector(mouseX, mouseY));
  strokeWeight(2);
  stroke(traceColor);
  for (int j=0;j<traceController.size();j++) {
    if (j>0) {
      PVector tracePoint1 = (PVector) traceController.get(j);
      PVector tracePoint2 = (PVector) traceController.get(j-1);
      if (tracePoint1.x!=0&&tracePoint1.y!=0&&tracePoint2.x!=0&&tracePoint2.y!=0) {
        line(tracePoint1.x, tracePoint1.y, tracePoint2.x, tracePoint2.y);
      }
    }
  }
  }
}

