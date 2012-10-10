//based on oscP5parsing by andreas schlegel

import oscP5.*;
import netP5.*;

String ipNumber = "127.0.0.1";
int receivePort = 9000;
OscP5 oscP5;
NetAddress myRemoteLocation;
//---
float xPos,yPos,targetX,targetY,secretX,secretY;
float xySize = 30;
float posDelta = 10;
boolean dPad = false;
float pitch,roll;
int up,down,left,right;
float radiusLimit = 150;
float frictionChaser = 0.5;
float frictionPointer = 0.8;
float vx,vy,vvx,vvy;

void setup() {
  size(640,480);
  smooth();
  frameRate(60);
  oscP5 = new OscP5(this,receivePort);  // start osc
  myRemoteLocation = new NetAddress(ipNumber,receivePort);
}

void draw() {
  noStroke();
  fill(0,20);
  rect(0,0,width,height);
  ellipseMode(CENTER);
  fill(255);
  ellipse(xPos,yPos,xySize,xySize);
  fill(255,100,0,random(55)+200);
  ellipse(targetX,targetY,5,5);
  fill(255,0,0,random(55)+50);
  ellipse(targetX,targetY,random(5)+10,random(5)+10);
  if(keyPressed&&key==' '){
    xPos=320;
    yPos=240;
    targetX=320;
    targetY=240;
  }
  /*fill(0,100,255,150);
  ellipse(secretX,secretY,5,5);*/
  wiiControls();
  console();
}

void wiiControls(){
  if(left==0&&right==0&&up==0&&down==0){
    dPad=false;
  } 
  else if(left==1||right==1||up==1||down==1){
    dPad=true;
  }
  if(left==1){
    targetX-=posDelta;
  }
  if(right==1){
    targetX+=posDelta;
  }
  if(up==1){
    targetY-=posDelta;
  }
  if(down==1){
    targetY+=posDelta;
  }
  if(dPad==false){
    secretX = roll*width;
    secretY = abs(height-(pitch*height));
  }
  calculateMotionChaser();
  calculateMotionPointer();
}

void calculateMotionPointer(){
  float radius = dist(targetX,targetY,secretX,secretY);  // distance from particle to cursor
  float angle = atan2(targetY-secretY,targetX-secretX);  // angle between particle and cursor
  //calculate velocity
  vvx -= radius * 0.01 * cos(angle + (0.0005 * radius));
  vvy -= radius * 0.01 * sin(angle + (0.0005 * radius));
  //apply velocity
  targetX += vvx;
  targetY += vvy;
  //apply friction
  vvx *= frictionPointer;
  vvy *= frictionPointer;
}

void calculateMotionChaser(){
  float radius = dist(xPos,yPos,targetX,targetY);  // distance from particle to cursor
  float angle = atan2(yPos-targetY,xPos-targetX);  // angle between particle and cursor
  //calculate velocity
  vx -= radius * 0.01 * cos(angle + (0.0005 * radius));
  vy -= radius * 0.01 * sin(angle + (0.0005 * radius));
  //apply velocity
  xPos += vx;
  yPos += vy;
  //apply friction
  vx *= frictionChaser;
  vy *= frictionChaser;
}

void oscEvent(OscMessage theOscMessage) {
  if(theOscMessage.checkAddrPattern("/pitch")==true) {
    if(theOscMessage.checkTypetag("f")) {  // types are i = int, f = float, s = String, ifs = all
      pitch = theOscMessage.get(0).floatValue();  
    }  
  }
  if(theOscMessage.checkAddrPattern("/roll")==true) {
    if(theOscMessage.checkTypetag("f")) {  // types are i = int, f = float, s = String, ifs = all
      roll = theOscMessage.get(0).floatValue();  
    }  
  } 
  if(theOscMessage.checkAddrPattern("/up")==true) {
    if(theOscMessage.checkTypetag("i")) {  // types are i = int, f = float, s = String, ifs = all
      up = theOscMessage.get(0).intValue();  
    }  
  } 
  if(theOscMessage.checkAddrPattern("/down")==true) {
    if(theOscMessage.checkTypetag("i")) {  // types are i = int, f = float, s = String, ifs = all
      down = theOscMessage.get(0).intValue();  
    }  
  } 
  if(theOscMessage.checkAddrPattern("/left")==true) {
    if(theOscMessage.checkTypetag("i")) {  // types are i = int, f = float, s = String, ifs = all
      left = theOscMessage.get(0).intValue();  
    }  
  } 
  if(theOscMessage.checkAddrPattern("/right")==true) {
    if(theOscMessage.checkTypetag("i")) {  // types are i = int, f = float, s = String, ifs = all
      right = theOscMessage.get(0).intValue();  
    }  
  } 
}

void console(){
  println("pitch: " + pitch + "    roll: " + roll + "     U:"+up +" D:"+down + " L:"+left + " R:"+right);
}


/*void mousePressed() {
 OscMessage myMessage = new OscMessage("/test");  // create
 myMessage.add(123); // add an int to the osc message 
 myMessage.add(12.34); // add a float to the osc message 
 myMessage.add("some text"); // add a string to the osc message 
 oscP5.send(myMessage, myRemoteLocation);  // send
 }*/










