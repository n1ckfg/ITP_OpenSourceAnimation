using UnityEngine;
using System.Collections;

public class AudioTimeDelay : MonoBehaviour {
	
	public bool randomStart = false;
	public bool timeDelay = false;
	public float delayLength = 0.0f;
	
	// Use this for initialization
	void Start() {
		if(randomStart) audio.time = Random.Range(0.0f,audio.clip.length);
	}
	
	// Update is called once per frame
	void Update() {
		if(timeDelay && Time.realtimeSinceStartup >= delayLength){
			audio.Play();
			timeDelay = false;
		}
	}
}
