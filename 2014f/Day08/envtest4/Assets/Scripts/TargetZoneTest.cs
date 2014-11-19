using UnityEngine;
using System.Collections;

public class TargetZoneTest : MonoBehaviour {

	public GameObject target;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	void OnTriggerEnter(){
		/*
		Vector3 p = target.transform.position;
		p.y += 10;
		target.transform.position = p;
		*/
		target.collider.attachedRigidbody.useGravity = true;
	}
}
