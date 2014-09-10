/************************************************************************************

Filename    :   OVRDistortionCamera.cs
Content     :   Interface to camera class
Created     :   January 8, 2013
Authors     :   David Borel, Peter Giokaris

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
using System.Linq;
using System.Runtime.InteropServices;

//-------------------------------------------------------------------------------------
// ***** OVRDistortionCamera
//
/// <summary>
/// OVRDistortionCamera is used to render into a Unity Camera class. 
/// This component handles reading the Rift tracker and positioning the camera position
/// and rotation. It also is responsible for properly rendering the final output, which
/// also the final lens correction pass.
/// </summary>
[RequireComponent(typeof(Camera))]
public class OVRDistortionCamera : OVRComponent
{
	#region Member Variables
	// PRIVATE MEMBERS
	// We will search for camera controller and set it here for access to its members
	private OVRCameraController CameraController = null;
	// Color only material, used for drawing quads on-screen
	private Material 		ColorOnlyMaterial   = null;
	private Material 		UndistortedMaterial = null;
	private Color			QuadColor 			= Color.red;	

	// PUBLIC MEMBERS
	[HideInInspector]
	public Camera CameraLeft  = null;
	[HideInInspector]
	public Camera CameraRight = null;
	#endregion
	
	#region Monobehaviour Member Functions	
	/// <summary>
	/// Awake this instance.
	/// </summary>
	new void Awake()
	{
		base.Awake ();
				
		// Material used for drawing color only polys into a render texture
		// Used by Latency tester
		if(ColorOnlyMaterial == null)
		{
			ColorOnlyMaterial = new Material (

			    "Shader \"Solid Color\" {\n" +
    			"Properties {\n" +
                "_Color (\"Color\", Color) = (1,1,1)\n" +
                "}\n" +
    			"SubShader {\n" +
    			"Color [_Color]\n" +
    			"Pass {}\n" +
    			"}\n" +
    			"}"		
			);
		}

		if(UndistortedMaterial == null)
		{
			UndistortedMaterial = new Material(
				"Shader \"Hidden/Invert\" {" +
				"SubShader {" +
				"    Pass {" +
				"        ZTest Always Cull Off ZWrite Off" +
				"        SetTexture [_MainTex] { combine texture }" +
				"    }" +
				"}" +
				"}"
				);
		}

		camera.orthographic = true;
	}

	/// <summary>
	/// Start this instance.
	/// </summary>
	new void Start()
	{
		base.Start ();
		
		// Get the OVRCameraController
		CameraController = GetComponent<OVRCameraController>();
		
		if(CameraController == null)
			Debug.LogWarning("WARNING: OVRCameraController not found!");

		// Without this, we will be drawing 1 frame behind
		camera.depth = Mathf.Max (CameraLeft.depth, CameraRight.depth) + 1;
		
		// Don't want the camera to render anything..
		camera.cullingMask = 0;
		camera.eventMask = 0;
		camera.useOcclusionCulling = false;
		camera.backgroundColor = Color.black;
		camera.clearFlags = (!CameraController.UseCameraTexture) ? CameraClearFlags.Nothing :
			CameraClearFlags.SolidColor; // TBD: This may be a performance loss on mobile.
		camera.renderingPath = RenderingPath.Forward;
		camera.orthographic = true;
	}
	
	/// <summary>
	/// Raises the render image event.
	/// </summary>
	/// <param name="source">Source.</param>
	/// <param name="destination">Destination.</param>
	void  OnRenderImage(RenderTexture source, RenderTexture destination)
	{	
		if(CameraLeft == null || CameraRight == null)
		{
			Debug.LogError("No cameras to distort!");
			return;
		}

		// Make the destination texture the target for all rendering
		RenderTexture.active = destination;
		// Clear the destination
		GL.Clear (false, true, Color.black);

		RenderTexture undistorted = (CameraController.UseCameraTexture) ? OVRCamera.CameraTexture : source;
		DistortEye (false, undistorted);
        DistortEye (true, undistorted);

        //Flush and end distortion timing.
        GL.IssuePluginEvent(1);

		// Run latency test by drawing out quads to the destination buffer
		LatencyTest(destination);
	}
	#endregion
	
	#region OVRDistortionCamera Functions
	/// <summary>
	/// Applies lens correction to the image for the given eye.
	/// </summary>
	void DistortEye(bool rightEye, RenderTexture undistorted)
	{
		Camera activeCam = (rightEye) ? CameraRight : CameraLeft;
		var ovrCam = activeCam.GetComponent<OVRCamera>();
		
		if(!CameraController.LensCorrection)
		{
			UndistortedMaterial.mainTexture = undistorted;
			var rect = new Rect(rightEye ? 0.5f : 0f, 0f, 0.5f, 1f);
			DrawFullScreenQuad (UndistortedMaterial, rect);
			return;
		}

		// Replace null material with lens correction material
		Material material = null;
		
		var lc = ovrCam.GetComponent<OVRLensCorrection>();
		
		if(CameraController.Chromatic == true)
			material = lc.GetMaterial_MeshDistort_CA();
		else
			material = lc.GetMaterial_MeshDistort();
		
		// Assign the source texture to a property from a shader
		material.mainTexture = undistorted;

		float halfWidth = 0.5f * Screen.width;
		GL.Viewport(new Rect(rightEye ? halfWidth : 0f, 0f, halfWidth, Screen.height));
		
		if(CameraController.ShowDistortionWire)
			GL.wireframe = true;
		
		// Set up the simple Matrix
		GL.PushMatrix ();
		GL.LoadOrtho ();
		for(int i = 0; i < material.passCount; i++)
		{
			material.SetPass(i);
			ovrCam.eyeMesh.DrawMesh();
		}
		GL.PopMatrix ();

		if (CameraController.ShowDistortionWire)
			GL.wireframe = false;
	}

	/// <summary>
	/// Render quad for latency tester
	/// </summary>
	/// <param name="dest">Destination.</param>
	void LatencyTest(RenderTexture dest)
	{
		byte r = 0,g = 0, b = 0;
		
		// See if we get a string back to send to the debug out
		string s = Marshal.PtrToStringAnsi(OVRDevice.GetLatencyResultsString());
		if (s != null)
		{
			string result = 
			"\n\n---------------------\nLATENCY TEST RESULTS:\n---------------------\n";
			result += s;
			result += "\n\n\n";
			print(result);
		}
		
		if(OVRDevice.DisplayLatencyScreenColor(ref r, ref g, ref b) == false)
			return;
		
		RenderTexture.active = dest;  		
		Material material = ColorOnlyMaterial;
		QuadColor.r = (float)r / 255.0f;
		QuadColor.g = (float)g / 255.0f;
		QuadColor.b = (float)b / 255.0f;
		material.SetColor("_Color", QuadColor);
		GL.PushMatrix();
    	material.SetPass(0);
    	GL.LoadOrtho();
    	GL.Begin(GL.QUADS);
    	GL.Vertex3(0.3f,0.3f,0);
    	GL.Vertex3(0.3f,0.7f,0);
    	GL.Vertex3(0.7f,0.7f,0);
    	GL.Vertex3(0.7f,0.3f,0);
    	GL.End();
    	GL.PopMatrix();
		
	}

	/// <summary>
	/// Draws a full-screen rectangle with the given material.
	/// </summary>
	/// <param name="material">The material to render to the quad.</param>
	/// <param name="rect">An optional rectangle region of the screen to render to.</param>
	public static void DrawFullScreenQuad(Material material, Rect? rect = null)
	{
		if (rect == null)
			rect = new Rect (0, 0, 1, 1);
		Rect r = rect.Value;

		GL.PushMatrix();
		GL.LoadOrtho();

		for (int i = 0; i < material.passCount; ++i)
		{
			material.SetPass(i);
			GL.Begin(GL.QUADS);
			GL.Color(Color.white);
			GL.TexCoord2(0, 0);
			GL.Vertex3(r.xMin, r.yMin, 0.1f);
			
			GL.TexCoord2(1, 0);
			GL.Vertex3(r.xMax, r.yMin, 0.1f);
			
			GL.TexCoord2(1, 1);
			GL.Vertex3(r.xMax, r.yMax, 0.1f);
			
			GL.TexCoord2(0, 1);
			GL.Vertex3(r.xMin, r.yMax, 0.1f);
			GL.End();
		}
		
		GL.PopMatrix();
	}
	
	#endregion	
}