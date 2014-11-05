using UnityEngine;
using System.Collections;

public class TriggerMove : MonoBehaviour {

	private Animator animator;

	void Awake() {
		animator = GetComponent<Animator>();
	}

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetKeyDown(KeyCode.Space)) {
			animator.SetTrigger("TriggerA");
		}
	}
}
