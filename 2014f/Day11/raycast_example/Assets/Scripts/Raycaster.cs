using UnityEngine;
using System.Collections;

public class Raycaster : MonoBehaviour {

	public bool isLooking = false;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update() {
		RaycastHit hit;
		Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		if (Physics.Raycast(ray, out hit)) {
			Debug.Log(hit.collider.name);
			if(hit.collider.name=="Cube") {
				isLooking = true;
			}
		} else {
			isLooking = false;
		}

	}

}
