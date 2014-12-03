//from http://www.openprocessing.org/sketch/553

int sW = 512;
int sH = 512;
int sD = 512;
Target target;

int sx,sy,ex,ey,hx,hy,hxo,hyo;
int armLength,ua,la;
float uad, lad;

void setup(){
  size(sW,sH,P3D);
  
  target = new Target();
  
  sx = width/2;
  sy = height/2;
  armLength = int(width/5);
}
 
void draw(){
  background(127);
  
  target.run();
  
  upperArm();
}
 
void upperArm(){
  //int dx = mouseX - sx;
  //int dy = mouseY - sy;
  int dx = int(target.p.x - sx);
  int dy = int(target.p.y - sy);

  float distance = sqrt(dx*dx+dy*dy);
   
  int a = armLength;
  int b = armLength;
  float c = min(distance, a + b);
   
  float B = acos((b*b-a*a-c*c)/(-2*a*c));
  float C = acos((c*c-a*a-b*b)/(-2*a*b));
   
  float D = atan2(dy,dx);
  float E = D + B + PI + C;
   
  ex = int((cos(E) * a)) + sx;
  ey = int((sin(E) * a)) + sy;
  print("UpperArm Angle=  "+degrees(E)+"    ");
   
  hx = int((cos(D+B) * b)) + ex;
  hy = int((sin(D+B) * b)) + ey;
 println("LowerArm Angle=  "+degrees((D+B)));
   
  stroke(255,0,0,100);
  fill(240,0,0,200);
  ellipse(sx,sy,10,10);
  ellipse(ex,ey,8,8);
  ellipse(hx,hy,6,6);
  stroke(0);
  line(sx,sy,ex,ey);
  line(ex,ey,hx,hy);
  //float angle = atan2(dy, dx);
  //println("angle = " + degrees(angle))
  //ex = int((cos(angle) * r)) + sx;
  //ey = int((sin(angle) * r)) + sy;
  //line(sx,sy,ex,ey);
}
