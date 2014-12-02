using UnityEngine;
using System.Collections;

public class Rotator : MonoBehaviour {

	public float delta = 2.0f;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		Vector3 r = transform.eulerAngles;
		r.y += delta;
		transform.eulerAngles = r;
	}
}
