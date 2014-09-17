using UnityEngine;
using System.Collections;

public class Main : MonoBehaviour {

	public GameObject target;
	private Shake shake;

	void Awake() {
		shake = target.GetComponent<Shake>();
	}

	// Use this for initialization
	void Start() {
	
	}
	
	// Update is called once per frame
	void Update() {
		shake.shakeAmount += 0.01f;
	}
}
