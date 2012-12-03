class Point2D {
  PVector p,s;
  boolean hovered;
  boolean clicked;

  Point2D(float _x, float _y) {
    p = new PVector(_x, _y);
    s = new PVector(10,10);
  }

  void draw() {
    if (hovered && !clicked) {
      noStroke();
      fill(255, 255, 0, 200);
      ellipse(p.x, p.y, s.x, s.y);
    }else if (clicked) {
      noStroke();
      fill(255, 0, 0, 200);
      ellipse(p.x, p.y, s.x, s.y);
    }else{
      noStroke();
      fill(255, 255, 0, 20);
      ellipse(p.x, p.y, s.x, s.y);
    }
  }

  void update() {
    if (hitDetect(mouseX, mouseY, 5,5, p.x, p.y, 5,5)) {
      hovered = true;
      if(mousePressed){
        clicked=true;
      }
    }else{
      hovered = false;
    }
  }

  void run() {
    update();
    draw();
  }

  //2D Hit Detect.  Assumes center.  x,y,w,h of object 1, x,y,w,h, of object 2.
  boolean hitDetect(float x1, float y1, float w1, float h1, float x2, float y2, float w2, float h2) {
    w1 /= 2;
    h1 /= 2;
    w2 /= 2;
    h2 /= 2; 
    if (x1 + w1 >= x2 - w2 && x1 - w1 <= x2 + w2 && y1 + h1 >= y2 - h2 && y1 - h1 <= y2 + h2) {
      return true;
    } 
    else {
      return false;
    }
  }
}
