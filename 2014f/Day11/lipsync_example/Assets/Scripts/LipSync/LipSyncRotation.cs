using UnityEngine;
using System.Collections;

[RequireComponent(typeof(LipSyncVolume))]

public class LipSyncRotation : MonoBehaviour {

	[ExecuteInEditMode]
	public Transform mouth;
	public float motionScale = 10.0f;
	public float rangeMinimum = 0.0f;
	public float rangeMaximum = 1.0f;
	private Vector3 origRot;
	//public Vector3 offset = new Vector3(0.0f,0.0f,0.0f);
	public enum JawAxis {X, Y, Z};
	public JawAxis jawAxis = JawAxis.X;

	private LipSyncVolume lsVolume;

	public void Start(){
		origRot = transform.localEulerAngles;
		lsVolume = GetComponent<LipSyncVolume>();
		if (!mouth)	mouth = transform;
	}

	public void Update(){
		float val;
		float rng = rangeMaximum - rangeMinimum;
		val = rng * lsVolume.intensity*motionScale + rangeMinimum;

		switch(jawAxis){
			case JawAxis.X:
				//val += origRot.x + offset.x;
				val += origRot.x;
				mouth.localEulerAngles = new Vector3(val, mouth.localEulerAngles.y, mouth.localEulerAngles.z);
				break;
			case JawAxis.Y:
				//val += origRot.y + offset.y;
				val += origRot.y;
				mouth.localEulerAngles = new Vector3(mouth.localEulerAngles.x, val, mouth.localEulerAngles.z);
				break;
			case JawAxis.Z:
				//val += origRot.z + offset.z;
				val += origRot.z;
				mouth.localEulerAngles = new Vector3(mouth.localEulerAngles.x, mouth.localEulerAngles.y, val);
				break;
		}
	}

}