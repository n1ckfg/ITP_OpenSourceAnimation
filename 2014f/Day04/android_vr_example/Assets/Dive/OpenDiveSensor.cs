using UnityEngine;
using System.Collections;
using System.Runtime.InteropServices;



//Durovis Dive Head Tracking 
// copyright by Shoogee GmbH & Co. KG Refer to LICENCE.txt 



public class OpenDiveSensor : MonoBehaviour {
	
	// This is used for rotating the camera with another object
	//for example tilting the camera while going along a racetrack or rollercoaster

	
	public bool add_rotation_gameobject=false;
	
	// add the head of the player to enable tilting by gameobject
	public GameObject rotation_gameobject;
	public Texture nogyrotexture;
	private float q0,q1,q2,q3;
	Quaternion rot;
	private bool show_error_message;

	string errormessage;

#if UNITY_EDITOR

  #elif UNITY_ANDROID

	[DllImport("divesensor")]	private static extern void initialize_sensors();
	[DllImport("divesensor")]	private static extern int get_q(ref float q0,ref float q1,ref float q2,ref float q3);
	[DllImport("divesensor")]	private static extern int process();
	[DllImport("divesensor")]	private static extern void set_application_name(string name);
	[DllImport("divesensor")]	private static extern void use_udp(int switchon);
	[DllImport("divesensor")]	private static extern void get_version(string msg,int maxlength);
	[DllImport("divesensor")]	private static extern int get_error();



   
   #elif UNITY_IPHONE
	[DllImport("__Internal")]	private static extern void initialize_sensors();
	[DllImport("__Internal")]	private static extern float get_q0();
	[DllImport("__Internal")]	private static extern float get_q1();
	[DllImport("__Internal")]	private static extern float get_q2();
	[DllImport("__Internal")]	private static extern float get_q3();
	[DllImport("__Internal")]	private static extern void DiveUpdateGyroData();
    [DllImport("__Internal")]	private static extern int get_q(ref float q0,ref float q1,ref float q2,ref float q3);
	
	
#endif 	

	void Start () {

		show_error_message=true;

		rot=Quaternion.identity;
	    // Disable screen dimming
     	Screen.sleepTimeout = SleepTimeout.NeverSleep;
		Application.targetFrameRate = 60;






#if UNITY_EDITOR
  #elif UNITY_ANDROID
		Network.logLevel = NetworkLogLevel.Full;
		use_udp(1);
		initialize_sensors ();
		int err = get_error();
		if (err==0){ errormessage="";
			show_error_message=false;

		}
		if (err==1){
			show_error_message=true;
			errormessage="ERROR: Dive needs a Gyroscope and your telephone has none, we are trying to go to Accelerometer compatibility mode. Dont expect too much.";
		}


	#elif UNITY_IPHONE
		initialize_sensors();
#endif
		
	}
	
	
	void Update () {

		
#if UNITY_EDITOR

	#elif UNITY_ANDROID

		process();
		get_q(ref q0,ref q1,ref q2,ref q3);
		rot.x=-q2;rot.y=q3;rot.z=-q1;rot.w=q0;
		#elif UNITY_IPHONE
		DiveUpdateGyroData();
		get_q(ref q0,ref q1,ref q2,ref q3);
		rot.x=-q2;
		rot.y=q3;
		rot.z=-q1;
		rot.w=q0;
		transform.rotation = rot;
#endif

		if (add_rotation_gameobject){
						transform.rotation =rotation_gameobject.transform.rotation* rot;
		}
		else
		{
						transform.rotation = rot;
		}
	
		


	}
	
	void OnGUI ()
	{
		//GUI.Label(new Rect(100,100,400,100),errormessage);
		if (show_error_message)
		{
			if(GUI.Button(new Rect(0,0, Screen.width, Screen.height) , "button")) {
				show_error_message=false;
			}
			GUI.DrawTexture(new Rect(Screen.width/2-320, Screen.height/2-240, 640, 480), nogyrotexture, ScaleMode.ScaleToFit, true, 0);


		}

	}
}
