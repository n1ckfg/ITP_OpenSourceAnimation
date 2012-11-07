int numParticles = 100;
Particle[] particle = new Particle[numParticles];

void setup(){
  size(640,480);
  for(int i=0;i<numParticles;i++){
    particle[i] = new Particle();
  }
}

void draw(){
  for(int i=0;i<numParticles;i++){
    particle[i].run();
  }
}

class Particle{
  PVector p;
  
  Particle(){
    p = new PVector(random(width),random(height));
  }
  
  void update(){
  }
  
  void drawParticle(){
    ellipseMode(CENTER);
    ellipse(p.x,p.y,10,10);
  }
  
  void run(){
    update();
    drawParticle();
  }
}

