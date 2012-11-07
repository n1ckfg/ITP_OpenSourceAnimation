int sW = 640;
int sH = 480;
int sD = 1000;

int numParticles = 100;
Particle[] particle = new Particle[numParticles];

void setup(){
  size(sW,sH,P3D);
  initParticles();
}

void draw(){
  background(0);
  for(int i=0;i<numParticles;i++){
    particle[i].run();
  }
}

void keyPressed(){
  initParticles();
}

void initParticles(){
  for(int i=0;i<numParticles;i++){
    particle[i] = new Particle("bacterium",3,true,50,50,10,10);
  }
}
