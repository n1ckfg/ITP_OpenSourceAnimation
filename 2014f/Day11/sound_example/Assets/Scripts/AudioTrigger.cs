using UnityEngine;
using System.Collections;

public class AudioTrigger : MonoBehaviour {
	
	public bool randomStart = false;

	// Use this for initialization
	void Start() {
		if(randomStart) audio.time = Random.Range(0.0f,audio.clip.length);
	}
	
	// Update is called once per frame
	void Update() {
		if (Input.GetKeyDown(KeyCode.F)) {
			audio.Play();
		}
	}
}
