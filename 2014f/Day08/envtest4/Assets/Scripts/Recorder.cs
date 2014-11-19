using UnityEngine;
using System.Collections;

public class Recorder : MonoBehaviour {

	public string fileName = "frame";
	public string filePath = "/Frames/";
	public int counter = 0;

	// Use this for initialization
	void Start () {

	}
	
	// Update is called once per frame
	void Update () {
		string temp = Application.dataPath + filePath + fileName + counter + ".png";
	    Application.CaptureScreenshot(temp);
		Debug.Log(temp);
		counter++;
	}
		
}
