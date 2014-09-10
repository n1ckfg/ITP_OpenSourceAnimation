using UnityEngine;
using System.Collections;

public class ThirdScript : MonoBehaviour {

	public GameObject cube;
	public int numCubes;
	public GameObject target;

	public float ease = 50;

	public bool activate = false;

	[HideInInspector]
	public float xDelta = 5;

	private GameObject[] cubes;

	// Use this for initialization
	void Start () {
		cubes = new GameObject[numCubes];
		for (int i=0; i<cubes.Length; i++) {
			cubes[i] = (GameObject) Object.Instantiate(cube);
			cubes[i].transform.position = new Vector3(Random.Range(0f,1f),Random.Range(0f,1f),Random.Range(0f,1f));
		}
	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetKeyDown(KeyCode.A)) activate = !activate;

		if (activate) {
			for(int i=0;i<cubes.Length;i++){
				Vector3 p = cubes[i].transform.position;
				p = tween3D(p, target.transform.position, new Vector3(ease,ease,ease));
				cubes[i].transform.position = p;
			}
		}
	}

	Vector3 tween3D(Vector3 v1, Vector3 v2, Vector3 e) {
		v1.x += (v2.x-v1.x)/e.x;
		v1.y += (v2.y-v1.y)/e.y;
		v1.z += (v2.z-v1.z)/e.z;
		return v1;
	}

}
