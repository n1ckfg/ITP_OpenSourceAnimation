using UnityEngine;
using System.Collections;

public class TriggerVolume : MonoBehaviour {

	public GameObject target;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	void OnTriggerEnter() {
		Debug.Log("Trigger Volume 1 triggered.");
		Vector3 p = target.transform.position;
		p.x += 10f;
		target.transform.position = p;
	}
}
