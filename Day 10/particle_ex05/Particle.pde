class Particle{
  PVector p,t;
  PVector[] AEpath = new PVector[counterMax];
  
  Particle(){
    p = new PVector(random(sW),random(sH),random(sD)-(sD/2));
    t = new PVector(random(sW),random(sH),random(sD)-(sD/2));
    for(int i=0;i<counterMax;i++){
      AEpath[i] = new PVector(0,0);
    }
  }
  
  void update(){
    p.x = tween(p.x,t.x,random(10,100));
    p.y = tween(p.y,t.y,random(10,100));
    p.z = tween(p.z,t.z,random(10,100));
    if(hitDetect(p.x,p.y,5,5,t.x,t.y,5,5)){
      t = new PVector(random(sW),random(sH),random(sD)-(sD/2));
    }
    AEpath[frameCount-1] = new PVector((p.x/sW)*dW,(p.y/sH)*dH); 
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
  
  //2D Hit Detect.  Assumes center.  x,y,w,h of object 1, x,y,w,h, of object 2.
  boolean hitDetect(float x1, float y1, float w1, float h1, float x2, float y2, float w2, float h2) {
    w1 /= 2;
    h1 /= 2;
    w2 /= 2;
    h2 /= 2; 
    if(x1 + w1 >= x2 - w2 && x1 - w1 <= x2 + w2 && y1 + h1 >= y2 - h2 && y1 - h1 <= y2 + h2) {
      return true;
    } 
    else {
      return false;
    }
  }
}
