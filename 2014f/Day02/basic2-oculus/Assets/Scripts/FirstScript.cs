using UnityEngine;
using System.Collections;

public class FirstScript : MonoBehaviour {

	public bool activate = false;

	[HideInInspector]
	public float xDelta = 5;

	// Use this for initialization
	void Start () {

	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetKeyDown(KeyCode.A)) activate = !activate;

		if (activate) {
			Vector3 p = transform.position;
			p.x += xDelta;
			transform.position = p;

			Vector3 r = new Vector3(xDelta, 0f, 0f);
			transform.Rotate(r);

			Vector3 s = transform.localScale;
			s.x += xDelta;
			transform.localScale = s;
		}
	}

	Vector3 tween3D(Vector3 v1, Vector3 v2, Vector3 e) {
		v1.x += (v2.x-v1.x)/e.x;
		v1.y += (v2.y-v1.y)/e.y;
		v1.z += (v2.z-v1.z)/e.z;
		return v1;
	}

}