/************************************************************************************

Filename    :   OVRDevice.cs
Content     :   Interface for the Oculus Rift Device
Created     :   February 14, 2013
Authors     :   Peter Giokaris

Copyright   :   Copyright 2014 Oculus VR, Inc. All Rights reserved.

Licensed under the Oculus VR Rift SDK License Version 3.1 (the "License"); 
you may not use the Oculus VR Rift SDK except in compliance with the License, 
which is provided at the time of installation or download, or which 
otherwise accompanies this software in either electronic or hard copy form.

You may obtain a copy of the License at

http://www.oculusvr.com/licenses/LICENSE-3.1 

Unless required by applicable law or agreed to in writing, the Oculus VR SDK 
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

************************************************************************************/

using UnityEngine;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

//-------------------------------------------------------------------------------------
// ***** OVRDevice
//
/// <summary>
/// OVRDevice is the main interface to the Oculus Rift hardware. It includes wrapper functions
/// for  all exported C++ functions, as well as helper functions that use the stored Oculus
/// variables to help set up camera behavior.
///
/// This component is added to the OVRCameraController prefab. It can be part of any 
/// game object that one sees fit to place it. However, it should only be declared once,
/// since there are public members that allow for tweaking certain Rift values in the
/// Unity inspector.
///
/// </summary>
public class OVRDevice : MonoBehaviour 
{
	// Imported functions from 
	// OVRPlugin.dll 	(PC)
	// OVRPlugin.bundle (OSX)
	// OVRPlugin.so 	(Linux, Android)
	
	// MessageList
	[StructLayout(LayoutKind.Sequential)]
	public struct MessageList
	{
		public byte isHMDSensorAttached;
		public byte isHMDAttached;
		public byte isLatencyTesterAttached;
		
		public MessageList(byte HMDSensor, byte HMD, byte LatencyTester)
		{
			isHMDSensorAttached = HMDSensor;
			isHMDAttached = HMD;
			isLatencyTesterAttached = LatencyTester;
		}
	}

	public const string strOvrLib = "OculusPlugin";

	[DllImport (strOvrLib)]
	private static extern bool OVR_Initialize();
	[DllImport (strOvrLib)]
	private static extern bool OVR_Update(ref MessageList messageList);	
	[DllImport (strOvrLib)]
	private static extern bool OVR_Destroy();
	// SENSOR FUNCTIONS
	[DllImport (strOvrLib)]
	private static extern bool OVR_IsSensorPresent();
	[DllImport (strOvrLib)]
	private static extern bool OVR_UseSensorPrediction(bool predictionOn);
	[DllImport (strOvrLib)]
    private static extern bool OVR_GetSensorPredictionTime(ref float predictionTime);
	[DllImport (strOvrLib)]
    private static extern bool OVR_SetSensorPredictionTime(float predictionTime);
	[DllImport (strOvrLib)]
    private static extern bool OVR_ResetSensorOrientation();	
	[DllImport (strOvrLib)]
    private static extern bool OVR_GetAcceleration(ref float x, ref float y, ref float z);
	[DllImport (strOvrLib)]
    private static extern bool OVR_GetAngularVelocity(ref float x, ref float y, ref float z);
	[DllImport (strOvrLib)]
    private static extern bool OVR_GetMagnetometer(ref float x, ref float y, ref float z);
	// CAMERA VISION FUNCTIONS	
	[DllImport (strOvrLib)]
	private static extern bool OVR_IsCameraPresent();
	[DllImport (strOvrLib)]
	private static extern bool OVR_IsCameraTracking();
	[DllImport (strOvrLib)]
	private static extern void OVR_ResetCameraOffset();
	[DllImport (strOvrLib)]
	private static extern void OVR_SetHeadModel(float x, float y, float z);
	[DllImport (strOvrLib)]
	private static extern bool OVR_GetCameraPositionOrientation(ref float px, ref float py, ref float pz,
									 							ref float ox, ref float oy, ref float oz, ref float ow);
	[DllImport (strOvrLib)]
	private static extern void OVR_SetVisionEnabled(bool on);		
	// HMD FUNCTIONS
	[DllImport (strOvrLib)]
	private static extern bool OVR_IsHMDPresent();
	[DllImport (strOvrLib)]
	private static extern void OVR_SetLowPersistenceMode(bool on); 
	[DllImport (strOvrLib)]	
	private static extern bool OVR_GetPlayerEyeHeight(ref float eyeHeight);
	[DllImport (strOvrLib)]
	private static extern bool OVR_GetInterpupillaryDistance(ref float interpupillaryDistance);
	// LATENCY TEST FUNCTIONS
	[DllImport (strOvrLib)]
    private static extern void OVR_ProcessLatencyInputs();
	[DllImport (strOvrLib)]
    private static extern bool OVR_DisplayLatencyScreenColor(ref byte r, ref byte g, ref byte b);
	[DllImport (strOvrLib)]
    private static extern System.IntPtr OVR_GetLatencyResultsString();
	// MAGNETOMETER YAW-DRIFT CORRECTION FUNCTIONS
	[DllImport (strOvrLib)]
	private static extern bool OVR_IsMagCalibrated();
	[DllImport (strOvrLib)]
	private static extern bool OVR_EnableMagYawCorrection(bool enable);
	[DllImport (strOvrLib)]
	private static extern bool OVR_IsYawCorrectionEnabled();	
	
	// PUBLIC
	public float PredictionTime 								= 0.03f; // 30 ms
	public bool  ResetTrackerOnLoad								= true;  // if off, tracker will not reset when new scene																 	 // is loaded
	// STATIC
	private static MessageList MsgList 							= new MessageList(0, 0, 0);
	private static bool  OVRInit 								= false;
		
	// * * * * * * * * * * * * *

	/// <summary>
	/// Awake this instance.
	/// </summary>
	void Awake () 
	{	
		// Init
		OVRInit = OVR_Initialize();
		if(OVRInit == false) return;

		// Set initial prediction time
		SetPredictionTime(PredictionTime);
	}
   
	/// <summary>
	/// Start this instance.
	/// (Note: make sure to always have a Start function for classes that have
	/// editors attached to them)
	/// </summary>
	void Start()
	{
	}
	
	/// <summary>
	/// We can detect if our devices have been plugged or unplugged, as well as
	/// run things that need to be updated in our game thread
	/// </summary>
	void Update()
	{	
		MessageList oldMsgList = MsgList;
		OVR_Update(ref MsgList);
		
		// HMD SENSOR
		if((MsgList.isHMDSensorAttached != 0) && 
		   (oldMsgList.isHMDSensorAttached == 0))
		{
			OVRMessenger.Broadcast<OVRMainMenu.Device, bool>("Sensor_Attached", OVRMainMenu.Device.HMDSensor, true); 
			//Debug.Log("HMD SENSOR ATTACHED");
		}
		else if((MsgList.isHMDSensorAttached == 0) && 
		   (oldMsgList.isHMDSensorAttached != 0))
		{
			OVRMessenger.Broadcast<OVRMainMenu.Device, bool>("Sensor_Attached", OVRMainMenu.Device.HMDSensor, false);
			//Debug.Log("HMD SENSOR DETACHED");
		}

		// HMD
		if((MsgList.isHMDAttached != 0) && 
		   (oldMsgList.isHMDAttached == 0))
		{
			OVRMessenger.Broadcast<OVRMainMenu.Device, bool>("Sensor_Attached", OVRMainMenu.Device.HMD, true); 
			//Debug.Log("HMD ATTACHED");
		}
		else if((MsgList.isHMDAttached == 0) && 
		   (oldMsgList.isHMDAttached != 0))
		{
			OVRMessenger.Broadcast<OVRMainMenu.Device, bool>("Sensor_Attached", OVRMainMenu.Device.HMD, false); 
			//Debug.Log("HMD DETACHED");
		}

		// LATENCY TESTER
		if((MsgList.isLatencyTesterAttached != 0) && 
		   (oldMsgList.isLatencyTesterAttached == 0))
		{
			OVRMessenger.Broadcast<OVRMainMenu.Device, bool>("Sensor_Attached", OVRMainMenu.Device.LatencyTester, true); 
			//Debug.Log("LATENCY TESTER ATTACHED");
		}
		else if((MsgList.isLatencyTesterAttached == 0) && 
		   (oldMsgList.isLatencyTesterAttached != 0))
		{
			OVRMessenger.Broadcast<OVRMainMenu.Device, bool>("Sensor_Attached", OVRMainMenu.Device.LatencyTester, false); 
			//Debug.Log("LATENCY TESTER DETACHED");
		}

		// Update prediction if being changed from outside
		PredictionTime = GetPredictionTime();
	}
		
	/// <summary>
	/// Raises the destroy event.
	/// </summary>
	void OnDestroy()
	{
		// We may want to turn this off so that values are maintained between level / scene loads
		if(ResetTrackerOnLoad == true)
		{
			OVR_Destroy();
			OVRInit = false;
		}
	}
	
	
	// * * * * * * * * * * * *
	// PUBLIC FUNCTIONS
	// * * * * * * * * * * * *
	
	/// <summary>
	/// Inited - Check to see if system has been initialized
	/// </summary>
	/// <returns><c>true</c> if is initialized; otherwise, <c>false</c>.</returns>
	public static bool IsInitialized()
	{
		return OVRInit;
	}
	
	/// <summary>
	/// Determines if is HMD present.
	/// </summary>
	/// <returns><c>true</c> if is HMD present; otherwise, <c>false</c>.</returns>
	public static bool IsHMDPresent()
	{
		return OVR_IsHMDPresent();
	}

	/// <summary>
	/// Determines if is sensor present.
	/// </summary>
	/// <returns><c>true</c> if is sensor present; otherwise, <c>false</c>.</returns>
	public static bool IsSensorPresent()
	{
		return OVR_IsSensorPresent();
	}

	/// <summary>
	/// Resets the orientation.
	/// </summary>
	/// <returns><c>true</c>, if orientation was reset, <c>false</c> otherwise.</returns>
	public static bool ResetOrientation()
	{
        return OVR_ResetSensorOrientation();
	}
	
	// Latest absolute sensor readings (note: in right-hand co-ordinates)
	
	/// <summary>
	/// Gets the acceleration.
	/// </summary>
	/// <returns><c>true</c>, if acceleration was gotten, <c>false</c> otherwise.</returns>
	/// <param name="x">The x coordinate.</param>
	/// <param name="y">The y coordinate.</param>
	/// <param name="z">The z coordinate.</param>
	public static bool GetAcceleration(ref float x, ref float y, ref float z)
	{
        return OVR_GetAcceleration(ref x, ref y, ref z);
	}

	/// <summary>
	/// Gets the angular velocity.
	/// </summary>
	/// <returns><c>true</c>, if angular velocity was gotten, <c>false</c> otherwise.</returns>
	/// <param name="x">The x coordinate.</param>
	/// <param name="y">The y coordinate.</param>
	/// <param name="z">The z coordinate.</param>
	public static bool GetAngularVelocity(ref float x, ref float y, ref float z)
	{
        return OVR_GetAngularVelocity(ref x, ref y, ref z);
	}
	
	/// <summary>
	/// Gets the magnetometer.
	/// </summary>
	/// <returns><c>true</c>, if magnetometer was gotten, <c>false</c> otherwise.</returns>
	/// <param name="x">The x coordinate.</param>
	/// <param name="y">The y coordinate.</param>
	/// <param name="z">The z coordinate.</param>
	public static bool GetMagnetometer(ref float x, ref float y, ref float z)
	{
        return OVR_GetMagnetometer(ref x, ref y, ref z);
	}

	/// <summary>
	/// Uses the prediction.
	/// </summary>
	/// <param name="on">If set to <c>true</c> on.</param>
	public static void UsePrediction(bool on)
	{
		OVR_UseSensorPrediction(on);
	}

	/// <summary>
	/// Gets the prediction time.
	/// </summary>
	/// <returns>The prediction time.</returns>
	public static float GetPredictionTime()
	{		
		float pt = 0.0f;
		OVR_GetSensorPredictionTime(ref pt);
		return pt;
	}

	/// <summary>
	/// Sets the prediction time.
	/// </summary>
	/// <returns><c>true</c>, if prediction time was set, <c>false</c> otherwise.</returns>
	/// <param name="predictionTime">Prediction time.</param>
	public static bool SetPredictionTime(float predictionTime)
	{
		return OVR_SetSensorPredictionTime(predictionTime);
	}
					
	/// <summary>
	/// Gets the IPD.
	/// </summary>
	/// <returns><c>true</c>, if IP was gotten, <c>false</c> otherwise.</returns>
	/// <param name="IPD">IP.</param>
	public static bool GetIPD(ref float IPD)
	{
		if(!OVRInit) return false;

		OVR_GetInterpupillaryDistance(ref IPD);
		
		return true;
	}
	
	/// <summary>
	/// Processes the latency inputs.
	/// </summary>
    public static void ProcessLatencyInputs()
	{
        OVR_ProcessLatencyInputs();
	}
	
	/// <summary>
	/// Displays the color of the latency screen.
	/// </summary>
	/// <returns><c>true</c>, if latency screen color was displayed, <c>false</c> otherwise.</returns>
	/// <param name="r">The red component.</param>
	/// <param name="g">The green component.</param>
	/// <param name="b">The blue component.</param>
    public static bool DisplayLatencyScreenColor(ref byte r, ref byte g, ref byte b)
	{
        return OVR_DisplayLatencyScreenColor(ref r, ref g, ref b);
	}
	
	/// <summary>
	/// Gets the latency results string.
	/// </summary>
	/// <returns>The latency results string.</returns>
    public static System.IntPtr GetLatencyResultsString()
	{
        return OVR_GetLatencyResultsString();
	}

	// MAG YAW-DRIFT CORRECTION FUNCTIONS

	/// <summary>
	/// Determines if is mag calibrated.
	/// </summary>
	/// <returns><c>true</c> if is mag calibrated; otherwise, <c>false</c>.</returns>
	public static bool IsMagCalibrated()
	{
		return OVR_IsMagCalibrated();
	}
	
	/// <summary>
	/// Enables the mag yaw correction.
	/// </summary>
	/// <returns><c>true</c>, if mag yaw correction was enabled, <c>false</c> otherwise.</returns>
	/// <param name="enable">If set to <c>true</c> enable.</param>
	public static bool EnableMagYawCorrection(bool enable)
	{
		return OVR_EnableMagYawCorrection(enable);
	}
	
	/// <summary>
	/// Determines if is yaw correction enabled.
	/// </summary>
	/// <returns><c>true</c> if is yaw correction enabled; otherwise, <c>false</c>.</returns>
	public static bool IsYawCorrectionEnabled()
	{
		return OVR_IsYawCorrectionEnabled();
	}

	/// <summary>
	/// Orients the sensor.
	/// </summary>
	/// <param name="q">Q.</param>
	public static void OrientSensor(ref Quaternion q)
	{
		// Change the co-ordinate system from right-handed to Unity left-handed
		/*
		q.x =  x; 
		q.y =  y;
		q.z =  -z; 
		q = Quaternion.Inverse(q);
		*/
			
		// The following does the exact same conversion as above
		q.x = -q.x; 
		q.y = -q.y;	
	}

	/// <summary>
	/// Gets the height of the player eye.
	/// </summary>
	/// <returns><c>true</c>, if player eye height was gotten, <c>false</c> otherwise.</returns>
	/// <param name="eyeHeight">Eye height.</param>
	public static bool GetPlayerEyeHeight(ref float eyeHeight)
	{
		return OVR_GetPlayerEyeHeight(ref eyeHeight);
	}
	
	// CAMERA VISION FUNCTIONS

	/// <summary>
	/// Determines if is camera present.
	/// </summary>
	/// <returns><c>true</c> if is camera present; otherwise, <c>false</c>.</returns>
	public static bool IsCameraPresent()
	{	
		return OVR_IsCameraPresent();
	}
	
	/// <summary>
	/// Determines if is camera tracking.
	/// </summary>
	/// <returns><c>true</c> if is camera tracking; otherwise, <c>false</c>.</returns>
	public static bool IsCameraTracking()
	{
		return OVR_IsCameraTracking ();
	}
	
	/// <summary>
	/// Resets the camera offsdet.
	/// </summary>
	public static void ResetCameraOffsdet()
	{	
		OVR_ResetCameraOffset();
	}
	
	/// <summary>
	/// Sets the head model.
	/// </summary>
	/// <param name="x">The x coordinate.</param>
	/// <param name="y">The y coordinate.</param>
	/// <param name="z">The z coordinate.</param>
	public static void SetHeadModel(float x, float y, float z)
	{
		// make sure to negate z, so that the position is right-handed CS
		OVR_SetHeadModel(x,y,-z);
	}
	
	/// <summary>
	/// Gets the camera position orientation.
	/// </summary>
	/// <returns><c>true</c>, if camera position orientation was gotten, <c>false</c> otherwise.</returns>
	/// <param name="p">P.</param>
	/// <param name="o">O.</param>
	public static bool 
	GetCameraPositionOrientation(ref Vector3 p, ref Quaternion o)
	{
		float px = 0, py = 0, pz = 0, ow = 0, ox = 0, oy = 0, oz = 0;
		
		bool result = OVR_GetCameraPositionOrientation(ref  px, ref  py, ref  pz, 
		                                               ref  ox, ref  oy, ref  oz, ref  ow);
		
		p.x = px; p.y = py; p.z = -pz;
		o.w = ow; o.x = ox; o.y = oy; o.z = oz;

		// Convert to Left hand CS
		OrientSensor(ref o);
		return result;
	}

	/// <summary>
	/// Sets the vision enabled.
	/// </summary>
	/// <param name="on">If set to <c>true</c> on.</param>
	public static void SetVisionEnabled(bool on)
	{
		OVR_SetVisionEnabled (on);
	}
	
	/// <summary>
	/// Sets the low Persistence mode.
	/// </summary>
	/// <param name="on">If set to <c>true</c> on.</param>
	public static void SetLowPersistenceMode(bool on)
	{
		OVR_SetLowPersistenceMode(on);
	}
}
