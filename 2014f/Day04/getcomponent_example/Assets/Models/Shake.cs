using UnityEngine;
using System.Collections;

public class Shake : MonoBehaviour {

	public float shakeAmount = 0.1f;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		Vector3 p = transform.position;
		p.y += Random.Range(0f,shakeAmount) - Random.Range(0f,shakeAmount);
		transform.position = p;
	}
}
