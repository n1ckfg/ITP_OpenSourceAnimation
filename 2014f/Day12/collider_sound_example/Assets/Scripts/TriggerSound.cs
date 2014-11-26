using UnityEngine;
using System.Collections;

public class TriggerSound : MonoBehaviour {

	// Use this for initialization
	void Start() {

	}
	
	// Update is called once per frame
	void Update() {
	
	}

	void OnTriggerEnter() {
		Debug.Log("triggered");
		audio.Play();
	}

}
