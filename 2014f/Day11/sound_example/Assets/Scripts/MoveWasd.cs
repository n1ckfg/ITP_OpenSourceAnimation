using UnityEngine;
using System.Collections;

public class MoveWasd : MonoBehaviour {

	public float walkSpeed = 10.0f;
	public float runSpeed = 100.0f;
	public float accel = 0.01f;

	public Vector3 homePoint = new Vector3(0,0,0);

	private float currentSpeed;
	private Vector3 p = new Vector3(0,0,0);
	private bool run = false;

	// Use this for initialization
	void Start() {
		currentSpeed = walkSpeed;
	}
	
	// Update is called once per frame
	void Update() {

		if (Input.GetKeyDown(KeyCode.LeftShift)){
			run = true;
		}else if (Input.GetKeyUp(KeyCode.LeftShift)){
			run = false;
		}

		if (run && currentSpeed < runSpeed) {
			currentSpeed += accel;
			if(currentSpeed > runSpeed) currentSpeed = runSpeed;
		}else if (!run && currentSpeed > walkSpeed) {
			currentSpeed -= accel;
			if (currentSpeed < walkSpeed) currentSpeed = walkSpeed;
		}

		p.x = Input.GetAxis("Horizontal") * Time.deltaTime * currentSpeed;
		p.y = 0.0f;
		p.z = Input.GetAxis("Vertical") * Time.deltaTime * currentSpeed;

		transform.Translate(p.x, p.y, p.z);

		if (Input.GetKeyDown(KeyCode.Home)) {
			transform.position = homePoint;
		}

	}

}
