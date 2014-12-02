using UnityEngine;
using System.Collections;

public class Raycaster : MonoBehaviour {

	public bool isLooking = false;
	public string isLookingAt = "";
	public GameObject target;
	public bool targetHit = false; 
	public bool cameraMode = true;

	// Use this for initialization
	void Start () {
		//
	}
	
	// Update is called once per frame
	void Update() {
		doRay();
	}

	void doRay() {
		RaycastHit hit;
		Ray ray;
		
		if (cameraMode) {
			ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		} else {
			ray = new Ray(transform.position, transform.forward);
		}
		
		if (Physics.Raycast(ray, out hit)) {
			isLooking = true;
			isLookingAt = hit.collider.name;
			Debug.Log(gameObject.name + " is looking at " + isLookingAt + ".");
			
			if (target) {
				if(isLookingAt==target.name) {
					targetHit = true;
					Debug.Log(gameObject.name + " has found target " + target.name + "!");
				} else {
					targetHit = false;
				}
			}
		} else {
			isLooking = false;
			isLookingAt = "";
		}
	}

}
