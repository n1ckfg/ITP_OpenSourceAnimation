class Bacterium extends Sprite{
 
 Bacterium(){
   super("bacterium",3,true,50,50,10,10);
   p = new PVector(width/2,height/2,0);
 }
 
 void update(){
   if(mousePressed) p = tween3D(p, new PVector(mouseX,mouseY,0), new PVector(10,10,10));
   super.update();
 }
 
 void draw(){
   super.draw();
 }
 
 void run(){
   update();
   draw();
 }
  
}
