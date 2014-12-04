using UnityEngine;
using System.Collections;

public class ChaseTarget : MonoBehaviour {

    public GameObject target;
    public Vector3 p = new Vector3(0f,0f,0f);
    public Vector3 t = new Vector3(0f,0f,0f);
    public Vector3 e = new Vector3(10f,10f,10f);
    
	private bool randomize = false;
	private Vector3 tt = new Vector3(0f,0f,0f);

    void Start() {
    }

    void Update() {
		p = transform.position; //this object's position
		t = target.transform.position; //the target's position
		p = tween3D(p,t,e);
		transform.position = p;

        if (randomize) {
            t = tween3D(t,tt,e);

            if (hitDetect3D(p,new Vector3(0.5f,0.5f,0.5f),t,new Vector3(0.5f,0.5f,0.5f))) {
                tt = randomizer(new Vector3(5,5,0));
            }

			target.transform.position = t;        
		}

	}

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    Vector3 tween3D(Vector3 v1, Vector3 v2, Vector3 e) {
        v1.x += (v2.x-v1.x)/e.x;
        v1.y += (v2.y-v1.y)/e.y;
        v1.z += (v2.z-v1.z)/e.z;
        return v1;
    }

    Vector3 randomizer(Vector3 spread) {
        float x = Random.Range(-1f * spread.x, spread.x);
        float y = Random.Range(-1f * spread.y, spread.y);
        float z = Random.Range(-1f * spread.z, spread.z);
        Vector3 r = new Vector3(x,y,z);   
        return r;     
    }

    //3D Hit Detect.  Assumes center.  xyz, whd of object 1, xyz, whd of object 2.
    bool hitDetect3D(Vector3 p1, Vector3 s1, Vector3 p2, Vector3 s2) {
        s1.x /= 2;
        s1.y /= 2;
        s1.z /= 2;
        s2.x /= 2;
        s2.y /= 2; 
        s2.z /= 2; 
        if (  p1.x + s1.x >= p2.x - s2.x && 
              p1.x - s1.x <= p2.x + s2.x && 
              p1.y + s1.y >= p2.y - s2.y && 
              p1.y - s1.y <= p2.y + s2.y &&
              p1.z + s1.z >= p2.z - s2.z && 
              p1.z - s1.z <= p2.z + s2.z
          ) {
          return true;
        } else {
          return false;
        }
    }

}