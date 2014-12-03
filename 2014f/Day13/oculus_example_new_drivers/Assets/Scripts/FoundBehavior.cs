using UnityEngine;
using System.Collections;

public class FoundBehavior : MonoBehaviour {

	public bool found = false;


	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		if (found) {
			Vector3 p = transform.position;
			p.z += 0.1f;
			transform.position = p;
		}
	}
}
