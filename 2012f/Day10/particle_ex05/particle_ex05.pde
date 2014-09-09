int sW = 640;
int sH = 360;
int sD = 1000;
int fps = 24;
int dW = 1920;
int dH = 1080;

int numParticles = 10;
Particle[] particle = new Particle[numParticles];

boolean recordFrames = false;

void setup(){
  size(sW,sH,P3D);
  frameRate(fps);
  initParticles();
}

void draw(){
 if(frameCount<counterMax){
  background(0);
  for(int i=0;i<numParticles;i++){
    particle[i].run();
  }
  if(recordFrames) saveFrame("frames/frame"+frameCount+".png");
 }else{
    AEkeysMain();
    exit();
  }
}

void keyPressed(){
  initParticles();
}

void initParticles(){
  for(int i=0;i<numParticles;i++){
    particle[i] = new Particle();
  }
}
