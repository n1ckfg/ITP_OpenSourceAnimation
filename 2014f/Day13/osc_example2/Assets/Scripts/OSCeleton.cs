using UnityEngine;
using System.Collections;

public class OSCeleton : MonoBehaviour {

	//You can set these variables in the scene because they are public 
	public string RemoteIP = "127.0.0.1";
	public int SendToPort = 7111;
	public int ListenerPort = 7110;
	public bool absolute = true;
	public bool mirrorY = true;

	//~~~~~~~~~~~~
	private string[] osceletonNames;
	private Vector3[] pos;
	public GameObject[] target;

	//~~~~~~~~~~~~

	private Osc handler;
	private UDPPacketIO udp;

	void Start(){
		osceletonNames = new string[] { //standard non-mirrored
			"head", "neck", "torso", "l_shoulder", "l_elbow", "l_hand", "r_shoulder", "r_elbow", "r_hand", "l_hip", "l_knee", "l_foot", "r_hip", "r_knee", "r_foot"
		};
		pos = new Vector3[osceletonNames.Length];
		//target = new Transform[osceletonNames.Length];

		//Initializes on start up to listen for messages
		//make sure this game object has both UDPPackIO and OSC script attached
		udp = (UDPPacketIO) GetComponent("UDPPacketIO");
		udp.init(RemoteIP, SendToPort, ListenerPort);
		handler = (Osc) GetComponent("Osc");
		handler.init(udp);
				
		handler.SetAddressHandler("/joint", Example1);
		handler.SetAddressHandler("/example2", Example2);
	}

	void Update(){
		for(int i=0;i<osceletonNames.Length;i++){
			try{
				if(absolute){
					target[i].transform.position = pos[i];
				}else{
					target[i].transform.Translate(pos[i]);
				}
			}catch (UnityException e){ }
		}
	}

	void Stop(){
		try{
			udp.Close();
			handler.Cancel();
		}catch(System.Exception e){ }
	}

	//these functions are called when messages are received
	void Example1(OscMessage oscMessage) {	
		//How to access values: 
		//oscMessage.Values[0], oscMessage.Values[1], etc
		Debug.Log("Called Example One > " + Osc.OscMessageToString(oscMessage));
		for(int i=0;i<osceletonNames.Length;i++){
			string name = (string) oscMessage.Values[0];
			if(name == osceletonNames[i]){
				float x = (float) oscMessage.Values[2];
				float y = (float) oscMessage.Values[3];
				float z = (float) oscMessage.Values[4];
				pos[i] = new Vector3(x,y,z);
				if (mirrorY) pos[i].y *= -1.0f;
			}
		}
	} 

	//these functions are called when messages are received
	void Example2(OscMessage oscMessage) {
		//How to access values: 
		//oscMessage.Values[0], oscMessage.Values[1], etc
		Debug.Log("Called Example Two > " + Osc.OscMessageToString(oscMessage));
	} 

}
