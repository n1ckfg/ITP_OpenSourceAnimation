//based on Animation class by Matt Mets http://www.cibomahto.com/

class Sprite {
  PImage[] frames;
  int frameNumber;
  int frameDivider;
  PVector p, r, s;

  Sprite(String _name, int _frameDivider) {
    frameNumber = 0;
    frameDivider = _frameDivider;
    load(_name);
    p = new PVector(width/2,height/2, 0);
    r = new PVector(0, 0, 0);
    s = new PVector(1, 1);
  }

  void load(String name) {
    int filesCounter=0;
    File dataFolder = new File(sketchPath, "data/"+name); 
    String[] allFiles = dataFolder.list();
    try {
      for (int j=0;j<allFiles.length;j++) {
        if (allFiles[j].toLowerCase().endsWith("png")) {
          filesCounter++;
        }
      }
    }
    catch(Exception e) {
    }
    frames = new PImage[filesCounter];
    for (int i=0; i<frames.length; i++) {
      println("Loading " + name + "/frame" + (i+1) + ".png");
      frames[i] = loadImage(name + "/frame" + (i+1) + ".png");
    }
  }

  void update() {
    if (frameCount % frameDivider == 0) {
      frameNumber++;
      if (frameNumber >= frames.length) {
        frameNumber = 0;
      }
    }
  }

  void draw() {
    pushMatrix();
    translate(p.x, p.y);
    rotateXYZ(r.x, r.y, r.z);
    scale(s.x, s.y);
    imageMode(CENTER);
    image(frames[frameNumber], 0, 0);
    popMatrix();
  }

  void run() {
    update();
    draw();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  void rotateXYZ(float _x, float _y, float _z) {
    rotateX(radians(_x));
    rotateY(radians(_y));
    rotateZ(radians(_z));
  }

  //simplifies the unnecessarily complex blend command; image, x, y, width, height, center/corner
  void blendImage(PImage bI, int pX, int pY, String b, boolean center) {
    String[] blendModes = { 
      "BLEND", "ADD", "SUBTRACT", "LIGHTEST", "DARKEST", "DIFFERENCE", "EXCLUSION", "MULTIPLY", "SCREEN", "OVERLAY", "HARD_LIGHT", "SOFT_LIGHT", "DODGE", "BURN"
    };
    int[] blendModeCodes = { 
      1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192
    };
    for (int i=0;i<blendModes.length;i++) {
      if (b==blendModes[i]) {
        int qX, qY;
        if (center) {
          qX=pX-(bI.width/2);
          qY=pY-(bI.height/2);
        } 
        else {
          qX=pX;
          qY=pY;
        }
        blend(bI, 0, 0, bI.width, bI.height, qX, qY, bI.width, bI.height, blendModeCodes[i]);
      }
    }
  }

  //Tween movement.  start, end, ease (more = slower).
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
    if (x1 + w1 >= x2 - w2 && x1 - w1 <= x2 + w2 && y1 + h1 >= y2 - h2 && y1 - h1 <= y2 + h2) {
      return true;
    } 
    else {
      return false;
    }
  }
}

