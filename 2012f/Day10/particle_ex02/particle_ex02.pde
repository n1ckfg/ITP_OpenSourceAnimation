int sW = 640;
int sH = 480;
int sD = 1000;

int numParticles = 1000;
Particle[] particle = new Particle[numParticles];

void setup(){
  size(sW,sH,P3D);
  for(int i=0;i<numParticles;i++){
    particle[i] = new Particle();
  }
}

void draw(){
  background(0);
  for(int i=0;i<numParticles;i++){
    particle[i].run();
  }
}

class Particle{
  PVector p;
  
  Particle(){
    p = new PVector(random(sW),random(sH),random(sD)-(sD/2));
  }
  
  void update(){
    p.x = tween(p.x,mouseX,random(10,100));
    p.y = tween(p.y,mouseY,random(10,100));
    p.z = tween(p.z,0,random(10,100));
  }
  
  void drawParticle(){
    pushMatrix();
    translate(p.x,p.y,p.z);
    noStroke();
    fill(random(255),20,20,random(100,200));
    ellipseMode(CENTER);
    ellipse(0,0,10,10);
    popMatrix();
  }
  
  void run(){
    update();
    drawParticle();
  }
  
  float tween(float v1, float v2, float e) {
    v1 += (v2-v1)/e;
    return v1;
  }  
}

