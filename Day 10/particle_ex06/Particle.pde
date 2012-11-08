class Particle extends Sprite{
  
  PVector[] AEpath = new PVector[counterMax];
  
  Particle(){
    super("bacterium",3,true,50,50,10,10);
    p = new PVector(random(sW),random(sH),random(sD)-(sD/2));
    t = new PVector(random(sW),random(sH),random(sD)-(sD/2));
    for(int i=0;i<counterMax;i++){
      AEpath[i] = new PVector(0,0);
    }
    frameNumber = int(random(frames.length));
  }
  
  void update(){
    p = tween3D(p, t, new PVector(random(10,100),random(10,100),random(10,100)));
    if(hitDetect3D(p,new PVector(5,5,5),t,new PVector(5,5,5))){
      t = new PVector(random(sW),random(sH),random(sD)-(sD/2));
    }
    AEpath[frameCount-1] = new PVector((p.x/sW)*dW,(p.y/sH)*dH); 
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
