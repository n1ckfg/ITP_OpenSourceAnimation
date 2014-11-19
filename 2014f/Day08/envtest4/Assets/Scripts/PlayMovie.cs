using UnityEngine;
using System.Collections;

public class PlayMovie : MonoBehaviour {

    //public MovieTexture movTexture;
	public bool loop = true;

	// Use this for initialization
	void Start () {
		MovieTexture movTexture = (MovieTexture) renderer.material.mainTexture;
		movTexture.loop=loop; 
		movTexture.Play();	
	}
	
	// Update is called once per frame
	void Update () {
	    //
	}
}
