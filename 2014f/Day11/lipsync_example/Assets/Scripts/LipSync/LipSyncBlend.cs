using UnityEngine;
using System.Collections;

[RequireComponent(typeof(LipSyncVolume))]

public class LipSyncBlend : MonoBehaviour {

	public SkinnedMeshRenderer mouth;
	public int blendShapeNum = 0;
	public float motionScale = 10.0f;
	public float rangeMinimum = 0.0f;
	public float rangeMaximum = 1.0f;
	private LipSyncVolume lsVolume;

	public void Start(){
		lsVolume = GetComponent<LipSyncVolume>();
		if (!mouth) mouth = GetComponent<SkinnedMeshRenderer>();
	}

	public void Update(){
		float val;
		float rng = rangeMaximum - rangeMinimum;
		val = rng * lsVolume.intensity*motionScale + rangeMinimum;
		mouth.SetBlendShapeWeight(blendShapeNum, val * 100.0f);
	}

}