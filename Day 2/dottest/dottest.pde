int sW = 640;
int sH = 480;
int fps = 24;
int counter=0;

PVector p;
boolean recording=true;
Data data;


void setup(){
size(sW,sH);
frameRate(fps);
p = new PVector(0,0);
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

void draw(){
  background(0);
  p.x = mouseX;
  p.y = mouseY;
  strokeWeight(20);
  stroke(255,0,0);
  point(p.x,p.y);
  data.add("\t"+counter+"\t" + p.x + "\t" + p.y + "\t" + 0);
  counter++;
}

void keyPressed(){
recording = false;
data.add("\r");
data.add("End of Keyframe Data");
data.endSave("foo.txt");
exit();
}
