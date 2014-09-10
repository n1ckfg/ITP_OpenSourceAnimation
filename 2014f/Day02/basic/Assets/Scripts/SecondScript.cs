using UnityEngine;
using System.Collections;

public class SecondScript : MonoBehaviour {

	public GameObject[] cubes;
	public GameObject target;

	public float ease = 50;

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
			for(int i=0;i<cubes.Length;i++){
				Vector3 p = cubes[i].transform.position;
				p = tween3D(p, target.transform.position, new Vector3(ease,ease,ease));
				transform.position = p;
			}

			/*
			r = transform.rotation.eulerAngles;
			r.x += xDelta;
			transform.rotation = Quaternion.Euler(r);

			s = transform.localScale;
			s.x += xDelta;
			transform.localScale = s;
			*/
		}
	}

	Vector3 tween3D(Vector3 v1, Vector3 v2, Vector3 e) {
		v1.x += (v2.x-v1.x)/e.x;
		v1.y += (v2.y-v1.y)/e.y;
		v1.z += (v2.z-v1.z)/e.z;
		return v1;
	}

}
