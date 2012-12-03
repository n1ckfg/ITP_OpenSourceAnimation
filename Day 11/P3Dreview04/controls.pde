void mouseReleased(){
  for (int i=0;i<controlPoints.length;i++) {
    controlPoints[i].clicked=false;
  }
}

void keyPressed(){
  texFreeze = !texFreeze;
  uvUpdate();
}
