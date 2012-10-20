Data dataAE;
String aeFileName = "AEscript";
String aeFilePath = "scripts";
String aeFileType = "jsx";

void AEkeysMain() {
  AEkeysBegin();
  for (int j = 0; j < model.getSegmentCount(); j++) {
    Segment segment = model.getSegment(j);
    Face[] faces = segment.getFaces();
    for (int i = 0; i < faces.length; i++) {
      Face f = faces[i];
      PVector[] vs = f.getVertices();
      for (int k = 0; k < vs.length; k++) {
      dataAE.add("\t" + "var solid = myComp.layers.addSolid([1.0, 1.0, 0], \"my square\", 50, 50, 1);" + "\r");
      dataAE.add("\t" + "solid.threeDLayer=true;");
      dataAE.add("\r");
      dataAE.add("\t" + "var p = solid.property(\"position\");" + "\r");
      dataAE.add("\r");
        dataAE.add("\t\t" + "p.setValueAtTime(" + 0 + ", [ " + vs[k].x + ", " + vs[k].y + "," + vs[k].z + "]);" + "\r");

        //vertex(vs[k].x, vs[k].y, vs[k].z);
      }
    }
  }
  /*
  for (int i=0;i<voxel.length;i++) {
    for (int j=0;j<voxel[i].length;j++) {
      for (int k=0;k<voxel[i][j].length;k++) {
        if(voxel[i][j][k].drawMe){
      dataAE.add("\t" + "var solid = myComp.layers.addSolid([1.0, 1.0, 0], \"my square\", 50, 50, 1);" + "\r");
      dataAE.add("\t" + "solid.threeDLayer=true;");
      dataAE.add("\r");
      dataAE.add("\t" + "var p = solid.property(\"position\");" + "\r");
      dataAE.add("\r");
        dataAE.add("\t\t" + "p.setValueAtTime(" + 0 + ", [ " + voxel[i][j][k].p.x + ", " + voxel[i][j][k].p.y + "," + voxel[i][j][k].p.z + "]);" + "\r");
        }
      }
      }
  }
  */
  dataAE.add("\t"+"myComp.layers.addCamera(\"Camera 1\", [960,540]);"+"\r");  
  AEkeysEnd();
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
  dataAE.add("\t" + "var compL = " + (100) + ";  // comp length (seconds)" + "\r");
  dataAE.add("\t" + "var compRate = " + 24 + "; // comp frame rate" + "\r");
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
  dataAE.endSave(aeFilePath + "/" + aeFileName + counter + "." + aeFileType);
}

