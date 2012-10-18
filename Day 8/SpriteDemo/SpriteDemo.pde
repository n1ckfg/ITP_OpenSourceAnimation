int sW = 640;
int sH = 480;
Sprite anim;

void setup(){
  size(sW,sH,P3D);
  anim = new Sprite("runner",3);
}
  
void draw() {
  background(0);
  if(mousePressed){
    anim.p.x = mouseX;
    anim.p.y = mouseY;
  }
  anim.run();
}
