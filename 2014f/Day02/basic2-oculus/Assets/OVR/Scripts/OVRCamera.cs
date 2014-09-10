/************************************************************************************

Filename    :   OVRCamera.cs
Content     :   Interface to camera class
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
using System.Collections;
using System.Runtime.InteropServices;

[RequireComponent(typeof(Camera))]

/// <summary>
/// OVRCamera is used to render into a Unity Camera class. 
/// This component handles reading the Rift tracker and positioning the camera position
/// and rotation. It also is responsible for properly rendering the final output, which
/// also the final lens correction pass.
/// </summary>
public class OVRCamera : OVRComponent
{
	#region Member Variables
	// PRIVATE MEMBERS
	// We will search for camera controller and set it here for access to its members
	private OVRCameraController CameraController = null;

	// PUBLIC MEMBERS
	// DistortionMesh is faster then pixel shader distortion method
	public readonly OVRDistortionMesh eyeMesh = new OVRDistortionMesh();
	// camera position,	from root of camera to neck (translation only)
	[HideInInspector]
	public Vector3 NeckPosition = new Vector3(0.0f, 0.0f,  0.0f);	
	// From neck to eye (rotation and translation; x will be different for each eye)
	[HideInInspector]
	public Vector3 EyePosition  = new Vector3(0.0f, 0.09f, 0.16f);

    // True if this camera corresponds to the right eye.
    public bool RightEye = false;

	// STATIC MEMBERS
	// We will grab the actual orientation that is used by the cameras in a shared location.
	// This will allow multiple OVRCameraControllers to eventually be used in a scene, and 
	// only one orientation will be used to syncronize all camera orientation
	static private Quaternion CameraOrientation = Quaternion.identity;
	//  This is absolute camera location from vision
	static private Vector3 CameraPosition = Vector3.zero;
	// Set an offset to the camera that will adjust our location from the 
	// cameras center of origin (set when reset is called)
	static private Vector3 CameraPositionOffset = Vector3.zero;
	// List of game objects to update with local camera center of origin
	// {allows for objects that are at 0,0,0 relative to the camera to stay 
	// rendered in camera space, to allow for visual aid).
	static private List<OVRCameraGameObject> CameraLocalSetList = new List<OVRCameraGameObject>();

	// An optional texture to which the undistorted image will be rendered.
    static public RenderTexture CameraTexture;
	#endregion
	
	#region Monobehaviour Member Functions	
	/// <summary>
	/// Awake
	/// </summary>
	new void Awake()
	{
		base.Awake ();
	}

	/// <summary>
	/// Start
	/// </summary>
	new void Start()
	{
		base.Start ();
		
		// Get the OVRCameraController
		CameraController = gameObject.transform.parent.GetComponent<OVRCameraController>();
		
		if(CameraController == null)
		{
			Debug.LogWarning("WARNING: OVRCameraController not found!");
			this.enabled = false;
			return;
		}

		if (!CameraController.UseCameraTexture)
			return;

		// This will scale the render texture based on ideal resolution
		if (CameraTexture == null)
			CreateRenderTexture (CameraController.CameraTextureScale);
					
		camera.targetTexture = CameraTexture;
	}
	
	/// <summary>
	/// Raises the pre cull event.
	/// </summary>
	void OnPreCull()
	{
		// NOTE: Setting the camera here increases latency, but ensures
		// that all Unity sub-systems that rely on camera location before
		// being set to render are satisfied. 
		if(CameraController.CallInPreRender == false)
			SetCameraOrientation();
	}
	
	/// <summary>
	/// Raises the pre render event.
	/// </summary>
	void OnPreRender()
	{
		// NOTE: Better latency performance here, but messes up water rendering and other
		// systems that rely on the camera to be set before PreCull takes place.
		if(CameraController.CallInPreRender == true)
			SetCameraOrientation();
		
		if(CameraController.WireMode == true)
			GL.wireframe = true;
	}
	
	/// <summary>
	/// Raises the post render event.
	/// </summary>
	void OnPostRender()
	{
		if(CameraController.WireMode == true)
			GL.wireframe = false;
	}
	#endregion
	
	#region OVRCamera Functions

	/// <summary>
	/// Sets the camera orientation.
	/// </summary>
	void SetCameraOrientation()
	{	
		// Main camera has a depth of 0, so it will be rendered first
		if(camera.depth == 0.0f)
		{			
			// If desired, update parent transform y rotation here
			// This is useful if we want to track the current location of
			// of the head.
			// TODO: Future support for x and z, and possibly change to a quaternion
			// NOTE: This calculation is one frame behind 
			if(CameraController.TrackerRotatesY == true)
			{
				Vector3 a = camera.transform.rotation.eulerAngles;
				a.x = 0; 
				a.z = 0;
				transform.parent.transform.eulerAngles = a;
			}
			/*
			else
			{
				// We will still rotate the CameraController in the y axis
				// based on the fact that we have a Y rotation being passed 
				// in from above that still needs to take place (this functionality
				// may be better suited to be calculated one level up)
				Vector3 a = Vector3.zero;
				float y = 0.0f;
				CameraController.GetYRotation(ref y);
				a.y = y;
				gameObject.transform.parent.transform.eulerAngles = a;
			}
			*/	
			// Read shared data from CameraController	
			if(CameraController.EnableOrientation == true)
			{
				// Get camera orientation and position from vision
				OVRDevice.GetCameraPositionOrientation(ref CameraPosition, ref CameraOrientation);
//					Debug.LogWarning(System.String.Format("CP: {0:F2} {1:F2} {2:F2}",
//								    CameraPosition.x, CameraPosition.y, CameraPosition.z));
			}
			
			// This needs to go as close to reading Rift orientation inputs
			OVRDevice.ProcessLatencyInputs();			
		}
		
		// Calculate the rotation Y offset that is getting updated externally
		// (i.e. like a controller rotation)
		float yRotation = 0.0f;
		CameraController.GetYRotation(ref yRotation);
		Quaternion qp = Quaternion.Euler(0.0f, yRotation, 0.0f);
		Vector3 dir = qp * Vector3.forward;
		qp.SetLookRotation(dir, Vector3.up);
	
		// Multiply the camera controllers offset orientation (allow follow of orientation offset)
		Quaternion orientationOffset = Quaternion.identity;
		CameraController.GetOrientationOffset(ref orientationOffset);
		qp = orientationOffset * qp;
		
		// Multiply in the current HeadQuat (q is now the latest best rotation)
		Quaternion q = qp * CameraOrientation;
		
		// * * *
		// Update camera rotation
		camera.transform.rotation = q;
		
		// * * *
		// Update camera position (first add Offset to parent transform)
		camera.transform.localPosition = NeckPosition;
	
		// Adjust neck by taking eye position and transforming through q
		// Get final camera position as well as the clipping difference 
		// (to allow for absolute location of center of camera grid space)
		Vector3 newCamPos = Vector3.zero;
		CameraPositionOffsetAndClip(ref CameraPosition, ref newCamPos);

		// Update list of game objects with new CameraOrientation / newCamPos here
		// For example, this location is used to update the GridCube
		foreach(OVRCameraGameObject obj in CameraLocalSetList)
		{
			if(obj.CameraController.GetCameraDepth() == camera.depth)
			{
				// Initial difference
				Vector3 newPos = -(qp * CameraPositionOffset);
				// Final position
				newPos += camera.transform.position;
			
				// Set the game object info
				obj.CameraGameObject.transform.position = newPos;
				obj.CameraGameObject.transform.rotation = qp;
			}
		}

		// Adjust camera position with offset/clipped cam location
		camera.transform.localPosition += Quaternion.Inverse(camera.transform.parent.rotation) * qp * newCamPos;

		// PGG: Call delegate function with new CameraOrientation / newCamPos here
		// This location will be used to update the arrow pointer
		// NOTE: Code below might not be needed. Please Look at OVRVisionGuide for potential
		// location for arrow pointer
/*
		// This will set the orientation of the arrow
		if (camera.depth == 2.0f)
		{
			// Set the location of the top node to follow the camera
			OVRMainMenu.PointerSetPosition(camera.transform.position);
			OVRMainMenu.PointerSetOrientation(camera.transform.rotation);
			Quaternion foo = Quaternion.LookRotation(-CameraPosition);
			OVRMainMenu.PointerRotatePointerGeometry(qp * foo);
		}
*/
		// move eyes out by x (IPD)
		Vector3 newEyePos = Vector3.zero;
		newEyePos.x = EyePosition.x;
		camera.transform.localPosition += camera.transform.localRotation * newEyePos;
	}

	/// <summary>
	/// Based on offset and clip values, adjust camera position
	/// </summary>
	/// <param name="inCam">In cam.</param>
	/// <param name="outCam">Out cam.</param>
	void CameraPositionOffsetAndClip(ref Vector3 inCam, ref Vector3 outCam)
	{
		outCam = inCam - CameraPositionOffset;
	}


	///////////////////////////////////////////////////////////
	// PUBLIC FUNCTIONS
	///////////////////////////////////////////////////////////

	/// <summary>
	/// Call this in CameraController to set up the ideal FOV as
	/// defined by the SDK
	/// </summary>
	/// <returns>The ideal FOV.</returns>
	public float GetIdealVFOV()
	{
		return eyeMesh.GetIdealFOV().y;
	}

	/// <summary>
	/// Calculates the aspect ratio.
	/// </summary>
	/// <returns>The aspect ratio.</returns>
	public float CalculateAspectRatio()
	{
		Vector2 fov = eyeMesh.GetIdealFOV();
		return fov.x / fov.y;
	}

	/// <summary>
	/// Gets the ideal resolution.
	/// </summary>
	/// <returns>The ideal resolution.</returns>
	public void GetIdealResolution(ref int w, ref int h)
	{
		eyeMesh.GetIdealResolution(ref w, ref h);
	}

	/// <summary>
	/// UpdateDistortionMeshParams
	/// Query the camera fielf of view and then set up the appropriate values
	/// </summary>
	/// <param name="lc">Lc.</param>
	/// <param name="rightEye">If set to <c>true</c> right eye.</param>
	/// <param name="flipY">If set to <c>true</c> flip y.</param>
	public void UpdateDistortionMeshParams (ref OVRLensCorrection lc, bool rightEye, bool flipY)
	{
		float fovH = GetHorizontalFOV();
		eyeMesh.SetFOV(fovH, camera.fieldOfView);
		eyeMesh.UpdateParams(ref lc, rightEye, flipY);
	}
	
	/// <summary>
	/// We must calculate this to return back to mesh distortion
	/// </summary>
	/// <returns>The horizontal FO.</returns>
	public float GetHorizontalFOV()
	{
//		return camera.fieldOfView * camera.aspect;

		float vFOVInRads =  camera.fieldOfView * Mathf.Deg2Rad;
		float hFOVInRads = 2 * Mathf.Atan( Mathf.Tan(vFOVInRads / 2) * camera.aspect);
		float hFOV = hFOVInRads * Mathf.Rad2Deg;

		return hFOV;
	}

	/// <summary>
	/// Creates the render texture.
	/// </summary>
	/// <param name="scale">Scale.</param>
	public void CreateRenderTexture(float scale)
	{
		// Set CameraTextureScale (increases the size of the texture we are rendering into
		// for a better pixel match when post processing the image through lens distortion)
		// If CameraTextureScale is not 1.0f, create a new texture and assign to target texture
		// Otherwise, fall back to normal camera rendering
		int w = 0;
		int h = 0;

		GetIdealResolution(ref w, ref h);

		w = 2 * (int)((float)w * scale);
		h = (int)((float)h * scale);
		
		if ( camera.hdr )
			CameraTexture = new RenderTexture(  w, h, 24, RenderTextureFormat.ARGBFloat );	
		else
			CameraTexture = new RenderTexture(w, h, 24);
		
		// Use MSAA settings in QualitySettings for new RenderTexture
		CameraTexture.antiAliasing = (QualitySettings.antiAliasing == 0) ? 1 : QualitySettings.antiAliasing;
	}

	///////////////////////////////////////////////////////////
	// VISION FUNCTIONS
	///////////////////////////////////////////////////////////
	
	/// <summary>
	/// Mainly to be used to reset camera position orientation
	/// camOffset will move the center eye position to an optimal location
	/// clampX/Y/Z will zero out the offset that is used (restricts offset in a given axis)
	/// </summary>
	/// <param name="camOffset">Cam offset.</param>
	/// <param name="clampX">If set to <c>true</c> clamp x.</param>
	/// <param name="clampY">If set to <c>true</c> clamp y.</param>
	/// <param name="clampZ">If set to <c>true</c> clamp z.</param>
	static public void ResetCameraPositionOrientation(ref Vector3 camOffset, 
	                                                  bool clampX, bool clampY, bool clampZ)
	{
		Vector3 camPos  = Vector3.zero;
		Quaternion camO = Quaternion.identity;
		OVRDevice.GetCameraPositionOrientation(ref camPos, ref camO);
		
		// Set position offset
		CameraPositionOffset   = camPos;
		
		// restrict offset in the desired axis
		if(clampX == true)
			CameraPositionOffset.x   = 0.0f;
		if(clampY == true)
			CameraPositionOffset.y   = 0.0f;
		if(clampZ == true)
			CameraPositionOffset.z   = 0.0f;
		
		// Adjust for optimal offset from zero (for eye position from neck etc.)
		CameraPositionOffset -= camOffset;
	}
	
	/// <summary>
	/// Set offset directly (for initial positioning that reflects the players
	/// eye location
	/// </summary>
	/// <param name="offset">Offset.</param>
	static public void SetCameraPositionOffset(ref Vector3 offset)
	{
		CameraPositionOffset = -offset;
	}

	/// <summary>
	/// Adds to local camera set list.
	/// </summary>
	/// <param name="obj">Object.</param>
	static public void AddToLocalCameraSetList(ref OVRCameraGameObject obj)
	{
		CameraLocalSetList.Add (obj);
	}
	
	/// <summary>
	/// Removes from local camera set list.
	/// </summary>
	/// <param name="obj">Object.</param>
	static public void RemoveFromLocalCameraSetList(ref OVRCameraGameObject obj)
	{
		CameraLocalSetList.Remove (obj);
	}
	
	/// <summary>
	/// Gets the camera orientation.
	/// </summary>
	/// <param name="orientation">Orientation.</param>
	static public void GetCameraOrientation(ref Quaternion orientation)
	{
		orientation = CameraOrientation;
	}
	
	/// <summary>
	/// Gets the absolute camera from vision position.
	/// </summary>
	/// <param name="pos">Position.</param>
	static public void GetAbsoluteCameraFromVisionPosition(ref Vector3 pos)
	{
		pos = CameraPosition;
	}
	
	/// <summary>
	/// Gets the relative camera from vision position.
	/// Takes into account position offset.
	/// </summary>
	/// <param name="pos">Position.</param>
	static public void GetRelativeCameraFromVisionPosition(ref Vector3 pos)
	{
		pos = CameraPosition - CameraPositionOffset;
	}
	
	#endregion	
}

//-------------------------------------------------------------------------------------
// ***** OVRCameraGameObject

/// <summary>
/// OVR camera game object.
/// Used to extend a GameObject for updates within an OVRCamera
/// </summary>
public class OVRCameraGameObject
{
	public GameObject 		   CameraGameObject = null;
	public OVRCameraController CameraController = null;
}

