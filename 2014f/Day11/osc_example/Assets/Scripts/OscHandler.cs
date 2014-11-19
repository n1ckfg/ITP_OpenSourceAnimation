using UnityEngine;
using System.Collections;

public class OscHandler : MonoBehaviour {

	//You can set these variables in the scene because they are public 
	public bool activate = true;
	public string RemoteIP = "127.0.0.1";
	public int SendToPort = 57131;
	public int ListenerPort = 7300;
	public bool absolute = true;
	public Vector3 scaler = new Vector3(100.0f,100.0f,100.0f);
	public Vector3 offset = new Vector3(0.0f,0.0f,0.0f);
	//~~~~~~~~~~~~
	
	private string[] oscInputNames = {
	  "player1"
	};
	private Vector3[] pos;
	private Vector3[] ppos;
	public Transform[] controller = new Transform[1]; //hard-code this? oscInputNames.Length won't initialize the Transform correctly!

	//~~~~~~~~~~~~
	private UDPPacketIO udp;
	private Osc handler;

	void Stop(){
		try{
			udp.Close();
			handler.Cancel();
		}catch(System.Exception e){ }
	}

	void Start(){
		pos = new Vector3[oscInputNames.Length];
		ppos = new Vector3[oscInputNames.Length];

		//Initializes on start up to listen for messages
		//make sure this game object has both UDPPackIO and OSC script attached
		udp = (UDPPacketIO) GetComponent("UDPPacketIO");
		udp.init(RemoteIP, SendToPort, ListenerPort);
		handler = (Osc) GetComponent("Osc");
		handler.init(udp);

		/*
		handler.SetAddressHandler("/objects/ID-centralXYZ", receiveKinectA); //KinectA blob tracker
		handler.SetAddressHandler("/skeletons/ID-centralXYZ", receiveKinectA); //KinectA blob tracker
				
		handler.SetAddressHandler("/tracker", receiveSoniskel); //Processing SimpleOpenNI skeleton tracker

		handler.SetAddressHandler("/kinect/blobs", receiveKvl); //KVL blob tracker
		*/

		handler.SetAddressHandler("/joint", receiveOsceleton); //OSCeleton skeleton tracker

		//handler.SetAddressHandler("/wii/1/accel/pry", receiveWiimoteAccel); //Osculator Wiimote tracker
		handler.SetAddressHandler("/wii/1/accel/xyz", receiveWiimoteAccel);
		//handler.SetAddressHandler("/wii/1/motion/angles", receiveWiimoteAccel);
		//handler.SetAddressHandler("/wii/1/motion/velo", receiveWiimoteAccel);

		//handler.SetAddressHandler("/wii/1/ir", receiveWiimoteIR);
	}

	void Update(){
		if(activate){
			for(int i=0;i<oscInputNames.Length;i++){
				if(absolute){
					controller[i].transform.position = pos[i] + offset;
				}else{
					controller[i].transform.Translate((pos[i]-ppos[i]) + offset);
				}
			}
		}
		//oscSend("/servo/1/position 512");
	}

	/*
	an example OSC address string would look like:
	/servo/1/position 

	The second part of an OSC message is a list of values to be sent to the specified address: integers, floats, and strings.
	The values in this list are simply separated by spaces, and the list can be arbitrarily long. 
	Most devices on the Make Controller Kit expect only one value.

	/servo/1/position 512 
	*/

	public void oscSend(string text){
		OscMessage oscM = Osc.StringToOscMessage(text);
		handler.Send(oscM);
	} 

	void updatePos(int _i, float _x, float _y, float _z){
		try{
		  ppos[_i] = pos[_i];
		}catch{ }
		pos[_i] = new Vector3(_x,_y,_z);
	}

	//these fucntions are called when messages are received
	void receiveKinectA(OscMessage oscMessage){	
		Debug.Log("Received KinectA > " + Osc.OscMessageToString(oscMessage));
		for(int i=0;i<oscInputNames.Length;i++){
			float x = scaler.x * (float) oscMessage.Values[1];
			float y = pos[i].y;
			float z = -1.0f * scaler.z * (float) oscMessage.Values[3];
			updatePos(i,x,y,z);
		}
	} 

	void receiveSoniskel(OscMessage oscMessage){	
		Debug.Log("Received Soniskel > " + Osc.OscMessageToString(oscMessage));
		for(int i=0;i<oscInputNames.Length;i++){
			float x = scaler.x * (float) oscMessage.Values[0];
			float y = pos[i].y;
			float z = -1.0f * scaler.z * (float) oscMessage.Values[2];
			updatePos(i,x,y,z);
		}
	} 

	void receiveKvl(OscMessage oscMessage){	
		Debug.Log("Received KVL Tracker > " + Osc.OscMessageToString(oscMessage));
		for(int i=0;i<oscInputNames.Length;i++){
			if((int) oscMessage.Values[0] == 1){ //KVL tracker starts numbering at 1!
				float x = scaler.x * (float) oscMessage.Values[3];
				float y = pos[i].y;
				float z = -1.0f * scaler.z * (float) oscMessage.Values[5];
				updatePos(i,x,y,z);
			}
		}
	} 

	void receiveOsceleton(OscMessage oscMessage){	
		Debug.Log("Received Osceleton > " + Osc.OscMessageToString(oscMessage));
		for(int i=0;i<oscInputNames.Length;i++){
			if((string) oscMessage.Values[0] == (string) oscInputNames[i]){
				float x = scaler.x * (float) oscMessage.Values[2];
				float y = pos[i].y;
				float z = -1.0f * scaler.z * (float) oscMessage.Values[4];
				updatePos(i,x,y,z);
			}
		}
	} 

	void receiveWiimoteAccel(OscMessage oscMessage){	
		Debug.Log("Received Wiimote > " + Osc.OscMessageToString(oscMessage));
		for(int i=0;i<oscInputNames.Length;i++){
			float x = scaler.x * (float) oscMessage.Values[0];
			float y = pos[i].y;
			float z = scaler.z * (float) oscMessage.Values[2];
			updatePos(i,x,y,z);
		}
	} 		

	void receiveWiimoteIR(OscMessage oscMessage){	
		Debug.Log("Received Wiimote > " + Osc.OscMessageToString(oscMessage));
		for(int i=0;i<oscInputNames.Length;i++){
			float x = scaler.x * (float) oscMessage.Values[0];
			float y = pos[i].y;
			float z = -1.0f * scaler.z * (float) oscMessage.Values[1];
			updatePos(i,x,y,z);
		}
	} 

}
