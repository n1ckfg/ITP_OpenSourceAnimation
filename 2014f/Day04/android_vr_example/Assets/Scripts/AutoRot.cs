using UnityEngine;
using System.Collections;

public class AutoRot : MonoBehaviour {

	public float rot = 0.1f;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		Vector3 r = transform.eulerAngles;
		r.y += rot;
		transform.rotation = Quaternion.Euler(r);
	}
}
