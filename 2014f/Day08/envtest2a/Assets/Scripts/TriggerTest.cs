using UnityEngine;
using System.Collections;

public class TriggerTest : MonoBehaviour {

	public float startTime = 5f;

	private Animator animator;

	void Awake() {
		animator = GetComponent<Animator>();
	}

	// Use this for initialization
	void Start() {
	
	}
	
	// Update is called once per frame
	void Update() {
		if (Input.GetKeyDown(KeyCode.A) || Time.realtimeSinceStartup > startTime) {
			animator.SetTrigger("TriggerA");
		}
	}

}
