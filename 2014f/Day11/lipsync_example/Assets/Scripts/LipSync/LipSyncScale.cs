using UnityEngine;
using System.Collections;

[RequireComponent(typeof(LipSyncVolume))]

public class LipSyncScale : MonoBehaviour {

	public Transform mouth;
	public float motionScale = 10.0f;
	public Vector3 rangeMinimum = new Vector3(1.0f,0.01f,1.0f);
	public Vector3 rangeMaximum = new Vector3(1.0f,1.0f,1.0f);
	private LipSyncVolume lsVolume;

	public void Start(){
		lsVolume = GetComponent<LipSyncVolume>();
		if (!mouth)	mouth = transform;
	}

	public void Update(){
		Vector3 val;
		Vector3 rng = rangeMaximum - rangeMinimum;
		val = rng * lsVolume.intensity*motionScale + rangeMinimum;
		mouth.localScale = val;
	}

}