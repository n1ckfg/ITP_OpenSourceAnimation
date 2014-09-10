/************************************************************************************

Filename    :   OVRCameraController.cs
Content     :   Camera controller interface. 
				This script is used to interface the OVR cameras.
Created     :   January 8, 2013
Authors     :   Peter Giokaris, David Borel

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
using System.Collections.Generic;

//-------------------------------------------------------------------------------------
// ***** OVRCameraController

[RequireComponent(typeof(OVRDistortionCamera))]
/// <summary>
/// OVR camera controller.
/// OVRCameraController is a component that allows for easy handling of the lower level cameras.
/// It is the main interface between Unity and the cameras. 
/// This is attached to a prefab that makes it easy to add a Rift into a scene.
///
/// All camera control should be done through this component.
///
/// </summary>
public class OVRCameraController : OVRComponent
{		
	// PRIVATE MEMBERS
	private bool   UpdateCamerasDirtyFlag = false;
	private Camera CameraLeft, CameraRight = null;
	private float  AspectRatio = 1.0f;						
	// Initial orientation of the camera, can be used to always set the 
	// zero orientation of the cameras to follow a set forward facing orientation.
	private Quaternion OrientationOffset = Quaternion.identity;	
	// Set Y rotation here; this will offset the y rotation of the cameras. 
	private float   YRotation = 0.0f;

	// IPD
	[SerializeField]
	private float  		ipd 		= 0.064f; 				// in millimeters
	public 	float 		IPD
	{
		get{return ipd;}
		set{ipd = value; UpdateCamerasDirtyFlag = true;}
	}

	// VERTICAL FOV
	[SerializeField]
	private float  		verticalFOV = 90.0f;	 			// in degrees
	public 	float		VerticalFOV
	{
		get{return verticalFOV;}
		set
		{
			verticalFOV = Mathf.Clamp(value, 40.0f, 170.0f);
			UpdateCamerasDirtyFlag = true;
		}
	}

	// If true, renders to a RenderTexture to allow super-sampling.
	public bool UseCameraTexture = false;

	// A constant multiple of the ideal resolution, which enables supersampling for higher image quality.
	public float CameraTextureScale = 1.0f;

	// SCALE RENDER TARGET
	[SerializeField]
	private float		scaleRenderTarget = 1.0f;
	public	float 		ScaleRenderTarget
	{
		get{return scaleRenderTarget;}
		set
		{
			scaleRenderTarget = value;
			if(scaleRenderTarget > 1.0f)
				scaleRenderTarget = 1.0f;
			else if (scaleRenderTarget < 0.01f)
				scaleRenderTarget = 0.01f;

			// We will call this initially to grab the serialized value
			SetScaleRenderTarget();
		}
	}

	// Camera positioning:
	// CameraRootPosition will be used to calculate NeckPosition and Eye Height
	public Vector3 		CameraRootPosition = new Vector3(0.0f, 1.0f, 0.0f);					
	// From CameraRootPosition to neck
	public Vector3 		NeckPosition      = new Vector3(0.0f, 0.7f,  0.0f);	
	// From neck to eye (rotation and translation; x will be different for each eye, based on IPD)
	public Vector3 		EyeCenterPosition = new Vector3(0.0f, 0.15f, 0.09f);
	// Use player eye height as set in the Rift config tool
	public  bool 		UsePlayerEyeHeight     = false;
	private bool 		PrevUsePlayerEyeHeight = false;
	// Set this transform with an object that the camera orientation should follow.
	// NOTE: Best not to set this with the OVRCameraController IF TrackerRotatesY is
	// on, since this will lead to uncertain output
	public Transform 	FollowOrientation = null;
	// Set to true if we want the rotation of the camera controller to be influenced by tracker
	public bool  		TrackerRotatesY	= false;
	// Use this to enable / disable Tracker orientation
	public bool         EnableOrientation = true;
	// Use this to turn on/off Prediction
	public bool			PredictionOn 	= true;
	// Use this to decide where tracker sampling should take place
	// Setting to true allows for better latency, but some systems
	// (such as Pro water) will break
	public bool			CallInPreRender = false;
	// Use this to turn on wire-mode
	public bool			WireMode  		= false;
	// Turn lens distortion on/off; use Chromatic Aberration in lens distortion calculation
	public bool 		LensCorrection  	= true;
	public bool 		Chromatic			= true;
	public bool 		FlipCorrectionInY	= false;
	public bool			ShowDistortionWire 	= false;

	// UNITY CAMERA FIELDS
	// Set the background color for both cameras
	[SerializeField]
	private Color 		backgroundColor = new Color(0.192f, 0.302f, 0.475f, 1.0f);
	public  Color       BackgroundColor
	{
		get{return backgroundColor;}
		set{backgroundColor = value; UpdateCamerasDirtyFlag = true;}
	}
	// Set the near and far clip plane for both cameras
	[SerializeField]
	private float 		nearClipPlane   = 0.15f;
	public  float 		NearClipPlane
	{
		get{return nearClipPlane;}
		set{nearClipPlane = value; UpdateCamerasDirtyFlag = true;}
	}
	[SerializeField]
	private float 		farClipPlane    = 1000.0f;  
	public  float 		FarClipPlane
	{
		get{return farClipPlane;}
		set{farClipPlane = value; UpdateCamerasDirtyFlag = true;}
	}
	
	// * * * * * * * * * * * * *
		
	/// <summary>
	/// Awake this instance.
	/// </summary>
	new void Awake()
	{
		base.Awake();
		
		// Get the cameras
		OVRCamera[] cameras = gameObject.GetComponentsInChildren<OVRCamera>();
		
		for (int i = 0; i < cameras.Length; i++)
		{
			if(cameras[i].RightEye)
				SetCameras (CameraLeft, cameras[i].camera);
			else
                SetCameras(cameras[i].camera, CameraRight);
		}
		
		if(CameraLeft == null)
			Debug.LogWarning("No left camera found for OVRCameraController!");
		if(CameraRight == null)
			Debug.LogWarning("No right camera found for OVRCameraController!");
	}

	/// <summary>
	/// Start this instance.
	/// </summary>
	new void Start()
	{
		base.Start();
		
		// Get the required Rift infromation needed to set cameras
		InitCameraControllerVariables();
		
		// Initialize the cameras
		UpdateCamerasDirtyFlag = true;
		UpdateCameras();
		SetScaleRenderTarget();
		SetMaximumVisualQuality();
		
	}
		
	/// <summary>
	/// Update this instance.
	/// </summary>
	new void Update()
	{
		base.Update();		
		UpdateCameras();
	}
		
	/// <summary>
	/// Inits the camera controller variables.
	/// Made public so that it can be called by classes that require information about the
	/// camera to be present when initing variables in 'Start'
	/// </summary>
	public void InitCameraControllerVariables()
	{
		// Get the IPD value (distance between eyes in meters)
		OVRDevice.GetIPD(ref ipd);

		// Using the calculated FOV, based on distortion parameters, yeilds the best results.
		// However, public functions will allow to override the FOV if desired
		VerticalFOV = CameraLeft.GetComponent<OVRCamera>().GetIdealVFOV();
		// Get aspect ratio as well
		AspectRatio = CameraLeft.GetComponent<OVRCamera>().CalculateAspectRatio();

		// Get our initial world orientation of the cameras from the scene (we can grab it from 
		// the set FollowOrientation object or this OVRCameraController gameObject)
		if(FollowOrientation != null)
			OrientationOffset = FollowOrientation.rotation;
		else
			OrientationOffset = transform.rotation;

		// Set initial head model
//		OVRDevice.SetHeadModel(EyeCenterPosition.x, EyeCenterPosition.y, EyeCenterPosition.z);
	}

	/// <summary>
	/// Sets the scale render target.
	/// </summary>
	void SetScaleRenderTarget()
	{
		// OPTIMIZE ME!!!
		if((CameraLeft != null && CameraRight != null))
		{
			// Aquire and scale the cameras
			OVRCamera[] cameras = gameObject.GetComponentsInChildren<OVRCamera>();
			for (int i = 0; i < cameras.Length; i++)
			{
				Rect r = new Rect(0.5f - (scaleRenderTarget * 0.5f) + ((cameras[i].RightEye) ? 0.5f : 0f), 
				                  0.5f - (scaleRenderTarget * 0.5f), 
				                  0.5f * scaleRenderTarget, 
				                  scaleRenderTarget);

				cameras[i].camera.rect = r;
			}
			
			// Aquire and Scale the lens correction components
			OVRLensCorrection[] lc = gameObject.GetComponentsInChildren<OVRLensCorrection>();
			for (int i = 0; i < lc.Length; i++)
			{
				lc[i].dynamicScale = scaleRenderTarget;
			}
		}
	}
	
	/// <summary>
	/// Updates the cameras.
	/// </summary>
	void UpdateCameras()
	{
		// Values that influence the stereo camera orientation up and above the tracker
		if(FollowOrientation != null)
			OrientationOffset = FollowOrientation.rotation;

		// Handle positioning of eye height and other things here
		UpdatePlayerEyeHeight();
		
		// Handle all other camera updates here
		if(UpdateCamerasDirtyFlag == false)
			return;

		// Turn off dirty flag
		UpdateCamerasDirtyFlag = false;

		// Configure left and right cameras
		float eyePositionOffset = -IPD * 0.5f;
		ConfigureCamera(CameraLeft, eyePositionOffset);

		eyePositionOffset       = IPD * 0.5f;
		ConfigureCamera(CameraRight, eyePositionOffset);
	}

	/// <summary>
	/// Configures the camera.
	/// </summary>
	/// <returns><c>true</c>, if camera was configured, <c>false</c> otherwise.</returns>
	/// <param name="camera">Camera.</param>
	/// <param name="eyePositionOffset">Eye position offset.</param>
	bool ConfigureCamera(Camera camera, float eyePositionOffset)
	{				
		// Always set  camera fov and aspect ration
		camera.fieldOfView = VerticalFOV;
		camera.aspect      = AspectRatio;
			
		// Push params also into the mesh distortion instance (if there is one)
		bool cameraRight = (camera == CameraRight) ? true : false;
		OVRLensCorrection lc = camera.GetComponent<OVRLensCorrection>();
		camera.GetComponent<OVRCamera>().UpdateDistortionMeshParams(ref lc, cameraRight, FlipCorrectionInY);
					
		// Set camera variables that pertain to the neck and eye position
		// NOTE: We will want to add a scale vlue here in the event that the player 
		// grows or shrinks in the world. This keeps head modelling behaviour
		// accurate
		camera.GetComponent<OVRCamera>().NeckPosition = NeckPosition;

		Vector3 EyePosition = EyeCenterPosition;
		EyePosition.x = eyePositionOffset; 
		camera.GetComponent<OVRCamera>().EyePosition = EyePosition;		
					
		// Background color
		camera.backgroundColor = BackgroundColor;
		
		// Clip Planes
		camera.nearClipPlane = NearClipPlane;
		camera.farClipPlane = FarClipPlane;
			
		return true;
	}
	
	/// <summary>
	/// Updates the height of the player eye.
	/// </summary>
	void UpdatePlayerEyeHeight()
	{
		if((UsePlayerEyeHeight == true) && (PrevUsePlayerEyeHeight == false))
		{
			// Calculate neck position to use based on Player configuration
			float  peh = 0.0f;
			
			if(OVRDevice.GetPlayerEyeHeight(ref peh) != false)
			{
				NeckPosition.y = peh - CameraRootPosition.y - EyeCenterPosition.y;
			}
		}
		
		PrevUsePlayerEyeHeight = UsePlayerEyeHeight;
	}
	
	///////////////////////////////////////////////////////////
	// PUBLIC FUNCTIONS
	///////////////////////////////////////////////////////////

	/// <summary>
	/// Sets the cameras - Should we want to re-target the cameras
	/// </summary>
	/// <param name="cameraLeft">Camera left.</param>
	/// <param name="cameraRight">Camera right.</param>
	public void SetCameras(Camera cameraLeft, Camera cameraRight)
	{
		CameraLeft  = cameraLeft;
		CameraRight = cameraRight;
		
		var dc = GetComponent<OVRDistortionCamera>();		
		if (dc != null)
		{
			dc.CameraLeft = CameraLeft;
			dc.CameraRight = CameraRight;
		}

		UpdateCamerasDirtyFlag = true;
	}
	
	/// <summary>
	/// Gets the IPD.
	/// </summary>
	/// <param name="ipd">Ipd.</param>
	public void GetIPD(ref float ipd)
	{
		ipd = IPD;
	}
	/// <summary>
	/// Sets the IPD.
	/// </summary>
	/// <param name="ipd">Ipd.</param>
	public void SetIPD(float ipd)
	{
		IPD = ipd;
		UpdateCamerasDirtyFlag = true;
	}
			
	/// <summary>
	/// Gets the vertical FOV.
	/// </summary>
	/// <param name="verticalFOV">Vertical FO.</param>
	public void GetVerticalFOV(ref float verticalFOV)
	{
		verticalFOV = VerticalFOV;
	}
	/// <summary>
	/// Sets the vertical FOV.
	/// </summary>
	/// <param name="verticalFOV">Vertical FO.</param>
	public void SetVerticalFOV(float verticalFOV)
	{
		VerticalFOV = verticalFOV;
		UpdateCamerasDirtyFlag = true;
	}
	
	/// <summary>
	/// Gets the aspect ratio.
	/// </summary>
	/// <param name="aspecRatio">Aspec ratio.</param>
	public void GetAspectRatio(ref float aspecRatio)
	{
		aspecRatio = AspectRatio;
	}
	/// <summary>
	/// Sets the aspect ratio.
	/// </summary>
	/// <param name="aspectRatio">Aspect ratio.</param>
	public void SetAspectRatio(float aspectRatio)
	{
		AspectRatio = aspectRatio;
		UpdateCamerasDirtyFlag = true;
	}
		
	/// <summary>
	/// Gets the camera root position.
	/// </summary>
	/// <param name="cameraRootPosition">Camera root position.</param>
	public void GetCameraRootPosition(ref Vector3 cameraRootPosition)
	{
		cameraRootPosition = CameraRootPosition;
	}
	/// <summary>
	/// Sets the camera root position.
	/// </summary>
	/// <param name="cameraRootPosition">Camera root position.</param>
	public void SetCameraRootPosition(ref Vector3 cameraRootPosition)
	{
		CameraRootPosition = cameraRootPosition;
		UpdateCamerasDirtyFlag = true;
	}

	/// <summary>
	/// Gets the neck position.
	/// </summary>
	/// <param name="neckPosition">Neck position.</param>
	public void GetNeckPosition(ref Vector3 neckPosition)
	{
		neckPosition = NeckPosition;
	}
	/// <summary>
	/// Sets the neck position.
	/// </summary>
	/// <param name="neckPosition">Neck position.</param>
	public void SetNeckPosition(Vector3 neckPosition)
	{
		// This is locked to the NeckPosition that is set by the
		// Player profile.
		if(UsePlayerEyeHeight != true)
		{
			NeckPosition = neckPosition;
			UpdateCamerasDirtyFlag = true;
		}
	}
	
	/// <summary>
	/// Gets the eye center position.
	/// </summary>
	/// <param name="eyeCenterPosition">Eye center position.</param>
	public void GetEyeCenterPosition(ref Vector3 eyeCenterPosition)
	{
		eyeCenterPosition = EyeCenterPosition;
	}
	/// <summary>
	/// Sets the eye center position.
	/// </summary>
	/// <param name="eyeCenterPosition">Eye center position.</param>
	public void SetEyeCenterPosition(Vector3 eyeCenterPosition)
	{
		EyeCenterPosition = eyeCenterPosition;
		OVRDevice.SetHeadModel(EyeCenterPosition.x, EyeCenterPosition.y, EyeCenterPosition.z);
		UpdateCamerasDirtyFlag = true;
	}
	
	/// <summary>
	/// Gets the orientation offset.
	/// </summary>
	/// <param name="orientationOffset">Orientation offset.</param>
	public void GetOrientationOffset(ref Quaternion orientationOffset)
	{
		orientationOffset = OrientationOffset;
	}
	/// <summary>
	/// Sets the orientation offset.
	/// </summary>
	/// <param name="orientationOffset">Orientation offset.</param>
	public void SetOrientationOffset(Quaternion orientationOffset)
	{
		OrientationOffset = orientationOffset;
	}
	
	/// <summary>
	/// Gets the Y rotation.
	/// </summary>
	/// <param name="yRotation">Y rotation.</param>
	public void GetYRotation(ref float yRotation)
	{
		yRotation = YRotation;
	}
	/// <summary>
	/// Sets the Y rotation.
	/// </summary>
	/// <param name="yRotation">Y rotation.</param>
	public void SetYRotation(float yRotation)
	{
		YRotation = yRotation;
	}
	
	/// <summary>
	/// Gets the tracker rotates y flag.
	/// </summary>
	/// <param name="trackerRotatesY">Tracker rotates y.</param>
	public void GetTrackerRotatesY(ref bool trackerRotatesY)
	{
		trackerRotatesY = TrackerRotatesY;
	}
	/// <summary>
	/// Sets the tracker rotates y flag.
	/// </summary>
	/// <param name="trackerRotatesY">If set to <c>true</c> tracker rotates y.</param>
	public void SetTrackerRotatesY(bool trackerRotatesY)
	{
		TrackerRotatesY = trackerRotatesY;
	}
	
	// GetCameraOrientationEulerAngles
	/// <summary>
	/// Gets the camera orientation euler angles.
	/// </summary>
	/// <returns><c>true</c>, if camera orientation euler angles was gotten, <c>false</c> otherwise.</returns>
	/// <param name="angles">Angles.</param>
	public bool GetCameraOrientationEulerAngles(ref Vector3 angles)
	{
		if(CameraRight == null)
			return false;
		
		angles = CameraRight.transform.rotation.eulerAngles;
		return true;
	}
	
	/// <summary>
	/// Gets the camera orientation.
	/// </summary>
	/// <returns><c>true</c>, if camera orientation was gotten, <c>false</c> otherwise.</returns>
	/// <param name="quaternion">Quaternion.</param>
	public bool GetCameraOrientation(ref Quaternion quaternion)
	{
		if(CameraRight == null)
			return false;
		
		quaternion = CameraRight.transform.rotation;
		return true;
	}
	
	/// <summary>
	/// Gets the camera position.
	/// </summary>
	/// <returns><c>true</c>, if camera position was gotten, <c>false</c> otherwise.</returns>
	/// <param name="position">Position.</param>
	public bool GetCameraPosition(ref Vector3 position)
	{
		if(CameraRight == null)
			return false;
		
		position = CameraRight.transform.position;
	
		return true;
	}
	
	/// <summary>
	/// Gets the camera.
	/// </summary>
	/// <param name="camera">Camera.</param>
	public void GetCamera(ref Camera camera)
	{
		camera = CameraRight;
	}
	
	/// <summary>
	/// Attachs a game object to the right (main) camera.
	/// </summary>
	/// <returns><c>true</c>, if game object to camera was attached, <c>false</c> otherwise.</returns>
	/// <param name="gameObject">Game object.</param>
	public bool AttachGameObjectToCamera(ref GameObject gameObject)
	{
		if(CameraRight == null)
			return false;

		gameObject.transform.parent = CameraRight.transform;
	
		return true;
	}

	/// <summary>
	/// Detachs the game object from the right (main) camera.
	/// </summary>
	/// <returns><c>true</c>, if game object from camera was detached, <c>false</c> otherwise.</returns>
	/// <param name="gameObject">Game object.</param>
	public bool DetachGameObjectFromCamera(ref GameObject gameObject)
	{
		if((CameraRight != null) && (CameraRight.transform == gameObject.transform.parent))
		{
			gameObject.transform.parent = null;
			return true;
		}				
		
		return false;
	}

	/// <summary>
	/// Gets the camera depth.
	/// </summary>
	/// <returns>The camera depth.</returns>
	public float GetCameraDepth()
	{
		return CameraRight.depth;
	}

	// Get Misc. values from CameraController
	
	/// <summary>
	/// Gets the height of the player eye.
	/// </summary>
	/// <returns><c>true</c>, if player eye height was gotten, <c>false</c> otherwise.</returns>
	/// <param name="eyeHeight">Eye height.</param>
	public bool GetPlayerEyeHeight(ref float eyeHeight)
	{
		eyeHeight = CameraRootPosition.y + NeckPosition.y + EyeCenterPosition.y;  
		
		return true;
	}

	/// <summary>
	/// Sets the maximum visual quality.
	/// </summary>
	public void SetMaximumVisualQuality()
	{
		QualitySettings.softVegetation  = 		true;
		QualitySettings.maxQueuedFrames = 		0;
		QualitySettings.anisotropicFiltering = 	AnisotropicFiltering.ForceEnable;
		QualitySettings.vSyncCount = 			1;
	}

}

