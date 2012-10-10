int numImages = 31;
PImage[] img = new PImage[numImages];
int counter=0;

void setup(){
  size(1920,1080);
  frameRate(24);
  for (int i=0;i<img.length;i++){
    img[i] = loadImage("match-cm_"+i+".png");
  }
}

void draw(){
  image(img[counter],0,0);
  if(counter<img.length-1){
    counter++;
  }else{
    counter=0;
  }
}

