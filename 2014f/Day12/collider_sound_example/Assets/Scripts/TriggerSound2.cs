using UnityEngine;
using System.Collections;

public class TriggerSound2 : MonoBehaviour {

	public GameObject target1;
	public GameObject target2;

	// Use this for initialization
	void Start() {

	}
	
	// Update is called once per frame
	void Update() {
	
	}

	void OnTriggerEnter() {

		float rnd = Random.Range(0f,1f);

		Debug.Log(rnd);

		if (rnd > 0.5f) {
			target2.audio.Stop();
			target1.audio.Play();
		} else {
			target1.audio.Stop();
			target2.audio.Play();
		}
	}

}
