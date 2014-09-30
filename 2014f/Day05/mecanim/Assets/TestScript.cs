using UnityEngine;
using System.Collections;

public class TestScript : MonoBehaviour {

	Animator animator;

	// Use this for initialization
	void Start () {
		animator = GetComponent<Animator>();
	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetKeyDown(KeyCode.A)) animator.SetTrigger("TriggerA");
		if (Input.GetKeyDown(KeyCode.B)) animator.SetTrigger("TriggerB");
	}
}
