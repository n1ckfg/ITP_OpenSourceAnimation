class Target {

  PVector p;
  PVector t;
  float e;
  
  Target() {
    p = new PVector(random(sW),random(sH),random(sD)-(sD/2));
    t = new PVector(random(sW),random(sH),random(sD)-(sD/2));
    e = 10;
  }
  
  void update() {
    p = tween3D(p,t, new PVector(e,e,e));
    float rnd = random(1);
    if (rnd > 0.95) t = new PVector(random(sW),random(sH),random(sD)-(sD/2));
  }
  
  void draw() {
    pushMatrix();
    translate(p.x,p.y,p.z);
    noStroke();
    fill(255,0,0);
    ellipse(0,0,10,10);
    popMatrix();
  }
  
  void run() {
    update();
    draw();
  }
  
  PVector tween3D(PVector v1, PVector v2, PVector e) {
    v1.x += (v2.x-v1.x)/e.x;
    v1.y += (v2.y-v1.y)/e.y;
    v1.z += (v2.z-v1.z)/e.z;
    return v1;
  }  
 
    //3D Hit Detect.  Assumes center.  xyz, whd of object 1, xyz, whd of object 2.
  boolean hitDetect3D(PVector p1, PVector s1, PVector p2, PVector s2) {
    s1.x /= 2;
    s1.y /= 2;
    s1.z /= 2;
    s2.x /= 2;
    s2.y /= 2; 
    s2.z /= 2; 
    if (  p1.x + s1.x >= p2.x - s2.x && 
          p1.x - s1.x <= p2.x + s2.x && 
          p1.y + s1.y >= p2.y - s2.y && 
          p1.y - s1.y <= p2.y + s2.y &&
          p1.z + s1.z >= p2.z - s2.z && 
          p1.z - s1.z <= p2.z + s2.z
      ) {
      return true;
    } 
    else {
      return false;
    }
  }  
  
}
