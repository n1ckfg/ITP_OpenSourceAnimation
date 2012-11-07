//based on Animation class by Matt Mets http://www.cibomahto.com/

class Particle {
  PImage[] frames;
  int frameNumber, loopIn, loopOut, frameDivider;
  PVector p, r, s, t;
  boolean spriteSheet, play;
  
  Particle(String _name, int _frameDivider, boolean _ssheet, int _tdx, int _tdy, int _etx, int _ety) {
    play = true;
    spriteSheet = _ssheet;
    loopIn = 0;
    frameNumber = loopIn;
    load(_name, _ssheet,_tdx,_tdy,_etx,_ety);
    loopOut = frames.length; 
    frameDivider = _frameDivider;
    r = new PVector(0, 0, 0);
    s = new PVector(1, 1);
    p = new PVector(random(sW),random(sH),random(sD)-(sD/2));
    t = new PVector(random(sW),random(sH),random(sD)-(sD/2));
  }

  void load(String _name, boolean _ssheet, int _tdx, int _tdy, int _etx, int _ety) {
    try {
      if (!_ssheet) {
        //loads a sequence of frames from a folder
        int filesCounter=0;
        File dataFolder = new File(sketchPath, "data/"+_name); 
        String[] allFiles = dataFolder.list();
        for (int j=0;j<allFiles.length;j++) {
          if (allFiles[j].toLowerCase().endsWith("png")) {
            filesCounter++;
          }
        }
        //--
        frames = new PImage[filesCounter];
        for (int i=0; i<frames.length; i++) {
          println("Loading " + _name + "/frame" + (i+1) + ".png");
          frames[i] = loadImage(_name + "/frame" + (i+1) + ".png");
        }
      }
      else {
        //loads a spritesheet from a single image
        PImage fromImg;
        fromImg = loadImage(_name + ".png");
        int tileX = 1;
        int tileY = 1;
        int tileDimX = _tdx;
        int tileDimY = _tdy;
        int endTileX = _etx;
        int endTileY = _ety;
        //--
        frames = new PImage[_etx*_ety];
        for (int h=0;h<frames.length;h++){
          if (tileX + tileDimX<=(endTileX*tileDimX)) {
            tileX += tileDimX;
          }
          else if (tileY + tileDimY<=(endTileY*tileDimY)) {
            tileY += tileDimY;
            tileX = 1;
          }
          else {
            tileX = 1;
            tileY = 1;
          }
          println("Loading frame" + (h+1) + " from " + _name + ".png");
          frames[h] = fromImg.get(tileX, tileY, tileDimX, tileDimY);
        }
      }
    }
    catch(Exception e) {
    }
  }

  void update() {
    p.x = tween(p.x,t.x,random(10,100));
    p.y = tween(p.y,t.y,random(10,100));
    p.z = tween(p.z,t.z,random(10,100));
    if(hitDetect(p.x,p.y,5,5,t.x,t.y,5,5)){
      t = new PVector(random(sW),random(sH),random(sD)-(sD/2));
    } 
    if(play){
    if (frameCount % frameDivider == 0) {
      frameNumber++;
      if (frameNumber >= loopOut) {
        frameNumber = loopIn;
      }
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

  //spritesheet functions
  /*

   */

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //utilities

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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //basic behaviors

  //Tween movement.  start, end, ease (more = slower).
  float tween(float v1, float v2, float e) {
    v1 += (v2-v1)/e;
    return v1;
  }

  float shake(float v1, float s) {
    v1 += random(s) - random(s);
    return v1;
  }

  float boundary(float v1, float vMin, float vMax) {
    if (v1<vMin) {
      v1 = vMin;
    } 
    else if (v1>vMax) {
      v1=vMax;
    } 
    return v1;
  }

  float gravity(float v1, float v2, float v3) { //y pos, floor num, gravity num
    if (v1<v2) {
      v1 += v3;
    }
    if (v1>v2) {
      v1 = v2;
    }
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

