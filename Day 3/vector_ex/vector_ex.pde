PVector p, v, a;

void setup(){
  size(960,540);
  p = new PVector(320,240);
  v = new PVector(0,0);
  a = new PVector(0,0.5);
}

void draw(){
  background(128);
  strokeWeight(20);
  stroke(0);
  v.add(a);
  p.add(v);
  point(p.x,p.y);
  if(p.y>height) p.y=0;
}


