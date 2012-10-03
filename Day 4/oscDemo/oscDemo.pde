//based on oscP5parsing by andreas schlegel

import oscP5.*;
import netP5.*;

String ipNumber = "127.0.0.1";
int receivePort = 9000;
int sendPort = 9000;
OscP5 oscP5;
NetAddress myRemoteLocation;
//---
String[] oscChannelNames = { "foo" };
float[] oscReceiveData = { 0 };
float[] oscSendData = { 0 };

Button button;

PFont font;
int fontSize = 24;
color receiveOff = color(50,0,0);
color receiveOn = color(255,50,0);
color receiveNow = receiveOff;
int sizeOff = 100;
int sizeOn = 110;
int sizeNow = sizeOff;

int sW = 640;
int sH = 480;

void setup(){
size(sW,sH);
smooth();
oscSetup();
button = new Button(sW/4,sH/2,100,color(0,100,50),fontSize,"Send","ellipse");
font = createFont("Arial",fontSize);
}

void draw(){
  background(127);
  fill(0);
  textAlign(CENTER);
  textFont(font,fontSize);
  text("OSC Send",sW/4,fontSize*1.5);
  text("OSC Receive",(sW/4)+(sW/2),fontSize*1.5);
  stroke(0);
  strokeWeight(2);
  line(sW/2,0,sW/2,sH);
  rectMode(CENTER);
  noStroke();
  fill(127);
  rect(sW/2,sH/4,100,100);
  rect(sW/2,(sH/2)+(sH/4),100,100);
  button.update();
  oscUse();
  if(oscReceiveData[0]==1){
    sizeNow = sizeOn;
    receiveNow = receiveOn;
  }else{
    sizeNow = sizeOff;
    receiveNow = receiveOff;  
  }
  fill(receiveNow);
  rect((sW/4)+(sW/2),sH/2,sizeNow,sizeNow);
}

void mousePressed(){
  if(button.hovered){
    oscSendData[0] = 1;
    oscSend();
  }
}

void mouseReleased(){
  oscSendData[0] = 0;
  oscSend();
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//1.  This function initializes OSC.  Put it in your setup().
void oscSetup() {
  oscP5 = new OscP5(this,receivePort);  // start osc
  myRemoteLocation = new NetAddress(ipNumber,sendPort);
}

//2.  This function receives OSC.  It runs automatically; no need to call it in your code.
void oscEvent(OscMessage myMessage) {
  for(int i=0;i<oscChannelNames.length;i++){
  if(myMessage.checkAddrPattern("/" + oscChannelNames[i])) {
    if(myMessage.checkTypetag("f")) {  // types are i = int, f = float, s = String, ifs = all
      oscReceiveData[i] = myMessage.get(0).floatValue();  // commands are intValue, floatValue, stringValue
    }  
  }
}
}

//3.  This function sends OSC.  Put it in your draw(), or in control functions like mousePressed() and keyPressed().
void oscSend(){
    //--
  OscMessage myMessage;
  
  for(int i=0;i<oscSendData.length;i++){
    myMessage = new OscMessage("/" + oscChannelNames[i]);
    myMessage.add(oscSendData[i]);
    oscP5.send(myMessage, myRemoteLocation);
  }
}

//4.  This function uses incoming OSC data in your sketch by assigning it to variables.
void oscUse(){
println("send: " + oscSendData[0] + "   receive: " + oscReceiveData[0]);
}

//END
