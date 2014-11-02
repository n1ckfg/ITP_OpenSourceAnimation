using UnityEngine;
using System.Collections;

public class Recorder : MonoBehaviour {
	
	[HideInInspector]
	public bool activate = true;
	
	public string fileName = "frame";
	//public string filePath = "/Frames/";
	public int counter = 0;
	public int counterLimit = 100;
	public int superSample = 1;

	// Use this for initialization
	void Start() {
		//
	}
	
	// Update is called once per frame
	void Update() {
		if (activate) {
			if (counter < counterLimit) {
			//string temp = Application.dataPath + filePath + fileName + counter + ".png";
			string temp = fileName + counter + ".png";
		    Application.CaptureScreenshot(temp, superSample);
			Debug.Log(temp);
			counter++;
			} else {
				counter = 0;
				activate = false;
				Debug.Log("finished");
			}
		}
	}
		
}
