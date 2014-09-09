Data dataAE = new Data();
boolean motionBlur = true;
boolean applyEffects = false;
boolean applySmoothing = true;
String aeFileName = "AEscript";
String aeFilePath = "data";
String aeFileType = "jsx";
int counterMax = 200;
int smoothNum = 6;
float weight = 18;
float scaleNum  = 1.0 / (weight + 2);

void AEkeysMain() {
  AEkeysBegin();
  for (int i=0;i<numParticles;i++) {
    dataAE.add("\t" + "var solid = myComp.layers.addSolid([1.0, 1.0, 0], \"my square\", 50, 50, 1);" + "\r");
    if(motionBlur){
      dataAE.add("\t" + "solid.motionBlur = true;" + "\r");
    }
    if(applyEffects){
      AEeffects();
    }
    dataAE.add("\r");
    dataAE.add("\t" + "var p = solid.property(\"position\");" + "\r");
    dataAE.add("\t" + "var r = solid.property(\"rotation\");" + "\r");
    dataAE.add("\r");

    for (int j=0;j<counterMax;j++) {
      AEkeyPos(i,j);
      AEkeyRot(i,j);
    }
}
    AEkeysEnd();   
}

float AEkeyTime(int frameNum){
  return (float(frameNum)/float(counterMax)) * (float(counterMax)/float(fps));
}

void AEkeyPos(int spriteNum, int frameNum){
  
     // smoothing algorithm by Golan Levin

   PVector lower, upper, centerNum;

     centerNum = new PVector(particle[spriteNum].AEpath[frameNum].x,particle[spriteNum].AEpath[frameNum].y);

     if(applySmoothing && frameNum>smoothNum && frameNum<counterMax-smoothNum){
       lower = new PVector(particle[spriteNum].AEpath[frameNum-smoothNum].x,particle[spriteNum].AEpath[frameNum-smoothNum].y);
       upper = new PVector(particle[spriteNum].AEpath[frameNum+smoothNum].x,particle[spriteNum].AEpath[frameNum+smoothNum].y);
       centerNum.x = (lower.x + weight*centerNum.x + upper.x)*scaleNum;
       centerNum.y = (lower.y + weight*centerNum.y + upper.y)*scaleNum;
     }
     
     if(frameNum%smoothNum==0||frameNum==0||frameNum==counterMax-1){
       dataAE.add("\t\t" + "p.setValueAtTime(" + AEkeyTime(frameNum) + ", [ " + centerNum.x + ", " + centerNum.y + "]);" + "\r");
     }
}

void AEkeyRot(int spriteNum, int frameNum){
/*
   float lower, upper, centerNum;

     centerNum = particle[spriteNum].AErot[frameNum];

     if(applySmoothing && frameNum>smoothNum && frameNum<counterMax-smoothNum){
       lower = particle[spriteNum].AErot[frameNum-smoothNum];
       upper = particle[spriteNum].AErot[frameNum+smoothNum];
       centerNum = (lower + weight*centerNum + upper)*scaleNum;
     }
     
     if(frameNum%smoothNum==0||frameNum==0||frameNum==counterMax-1){
      dataAE.add("\t\t" + "r.setValueAtTime(" + AEkeyTime(frameNum) + ", " + centerNum +");" + "\r");
     }
     */
}

void AEeffects(){
     dataAE.add("\t" + "var myEffect = solid.property(\"Effects\").addProperty(\"Fast Blur\")(\"Blurriness\").setValue(61);");
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

void AEkeysBegin() {
  dataAE = new Data();
  dataAE.beginSave();
  dataAE.add("{  //start script" + "\r");
  dataAE.add("\t" + "app.beginUndoGroup(\"foo\");" + "\r");
  dataAE.add("\r");
  dataAE.add("\t" + "// create project if necessary" + "\r");
  dataAE.add("\t" + "var proj = app.project;" + "\r");
  dataAE.add("\t" + "if(!proj) proj = app.newProject();" + "\r");
  dataAE.add("\r");
  dataAE.add("\t" + "// create new comp named 'my comp'" + "\r");
  dataAE.add("\t" + "var compW = " + dW + "; // comp width" + "\r");
  dataAE.add("\t" + "var compH = " + dH + "; // comp height" + "\r");
  dataAE.add("\t" + "var compL = " + (counterMax/fps) + ";  // comp length (seconds)" + "\r");
  dataAE.add("\t" + "var compRate = " + fps + "; // comp frame rate" + "\r");
  dataAE.add("\t" + "var compBG = [0/255,0/255,0/255] // comp background color" + "\r");
  dataAE.add("\t" + "var myItemCollection = app.project.items;" + "\r");
  dataAE.add("\t" + "var myComp = myItemCollection.addComp('my comp',compW,compH,1,compL,compRate);" + "\r");
  dataAE.add("\t" + "myComp.bgColor = compBG;" + "\r");
  dataAE.add("\r");  
}

void AEkeysEnd() {
  dataAE.add("\r");
  dataAE.add("\t" + "app.endUndoGroup();" + "\r");
  dataAE.add("}  //end script" + "\r");
  dataAE.endSave(aeFilePath + "/" + aeFileName + "." + aeFileType);
}


