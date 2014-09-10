/************************************************************************************

Filename    :   OVRDistortionMesh.cs
Content     :   Implements the distortion mesh lens correction
Created     :   February 14, 2014
Authors     :   Peter Giokaris, Volga Aksoy

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

/// <summary>
/// OVR distortion mesh.
/// </summary>
public class OVRDistortionMesh
{	
	// Generic distortion mesh vertex
	// we can grow this as needed, and then set into
	// the arrays needed to render the mesh itself
	[StructLayout(LayoutKind.Sequential)]
	public struct DistMeshVert
	{
		public float	ScreenPosNDC_x;
		public float	ScreenPosNDC_y;
		public float	TimewarpLerp;
		public float	Shade;
		public float	TanEyeAnglesR_u;
		public float	TanEyeAnglesR_v;
		public float	TanEyeAnglesG_u;
		public float	TanEyeAnglesG_v;
		public float	TanEyeAnglesB_u;
		public float	TanEyeAnglesB_v;
	};

	// DistScaleOffsetUV
	[StructLayout(LayoutKind.Sequential)]
	public struct DistScaleOffsetUV
	{
		public float Scale_x;
		public float Scale_y;
		public float Offset_x;
		public float Offset_y;
	};

	// -----------------------------------------------------------------------------------
	// ***** Private Interface to libOVR
	public const string LibFile = "OculusPlugin";
	// Imported functions from 
	// OVRPlugin.dll 	(PC)
	// OVRPlugin.bundle (OSX)
	// OVRPlugin.so 	(Linux, Android)
	[DllImport(LibFile)]
	private static extern void OVR_GetDistortionMeshInfo(ref int resH, ref int resV, ref float fovH, ref float fovV );
	[DllImport(LibFile)]
	private static extern void OVR_SetDistortionMeshInfo(int resH, int resV, float fovH, float fovV );
	[DllImport(LibFile)]
	private static extern void OVR_GenerateDistortionMesh(ref int numVerts, ref int numIndicies, bool rightEye);
	[DllImport(LibFile)]
	private static extern void OVR_CopyDistortionMesh(DistMeshVert[] leftEye, int[] leftEyeIndicies, 
	                                                  ref DistScaleOffsetUV scaleOffset, bool rightEye, bool flipY);
	[DllImport(LibFile)]
	private static extern void OVR_DestroyDistortionMesh();
	[DllImport(LibFile)]
	private static extern void OVR_TestDistortionMesh();

	// We will fill in the mesh with distortion values
	private Mesh 		mesh = null;

	private Vector3[] 	positions = null;
	private Vector2[] 	uvR = null; 		// TEXCOORD0
	private Vector2[] 	uvG = null; 		// TEXCOORD1
	private Vector3[] 	uvB = null;			// NORMALS
	private int[] 		triIndices = null;

	DistMeshVert[] 		meshVerts;
	DistScaleOffsetUV scaleOffset;

	/// <summary>
	/// Gets the ideal vertical FO.
	/// </summary>
	/// <returns>The ideal FOV.</returns>
	public Vector2 GetIdealFOV()
	{
		// Set up distortion meshes
		int resH = 0; int resV = 0; float fovH = 0; float fovV = 0;
		OVR_GetDistortionMeshInfo(ref resH, ref resV, ref fovH, ref fovV);

		return new Vector2(fovH, fovV);
	}

	public void GetIdealResolution(ref int w, ref int h)
	{
		float fovH = 0; float fovV = 0;
		OVR_GetDistortionMeshInfo(ref w, ref h, ref fovH, ref fovV);
	}

	/// <summary>
	/// Sets the FOV.
	/// </summary>
	/// <param name="fovH">Fov h.</param>
	/// <param name="fovV">Fov v.</param>
	public void SetFOV(float fovH, float fovV)
	{
		OVR_SetDistortionMeshInfo(Screen.width / 2, Screen.height, fovH, fovV);
	}

	/// <summary>
	/// Updates the parameters.
	/// </summary>
	/// <param name="lc">Lc.</param>
	/// <param name="rightEye">If set to <c>true</c> right eye.</param>
	/// <param name="flipY">If set to <c>true</c> flip y.</param>
	public void UpdateParams (ref OVRLensCorrection lc, bool rightEye, bool flipY)
	{
		GenerateMesh(ref lc, rightEye, flipY);
	}

	/// <summary>
	/// Generates the mesh.
	/// This should only be done when fov changes.
	/// </summary>
	/// <param name="lc">Lc.</param>
	/// <param name="rightEye">If set to <c>true</c> right eye.</param>
	/// <param name="flipY">If set to <c>true</c> flip y.</param>
	public void GenerateMesh(ref OVRLensCorrection lc, bool rightEye, bool flipY)
	{
		// We only need to create the mesh once and re-use components when camera 
		// is dirty
		bool create = true;
		if (!mesh) 
		{
			mesh = new Mesh ();
			mesh.MarkDynamic();
		}
		else
			create = false;

		int numVerts = 0; int numIndicies = 0;
		// Generate OVR mesh for given eye
		OVR_GenerateDistortionMesh(ref numVerts, ref numIndicies, rightEye);

		// create space to copy mesh into
		if (create) 
		{
			meshVerts = new DistMeshVert[numVerts];
			triIndices = new int[numIndicies];
			scaleOffset = new DistScaleOffsetUV ();
		}
		// Copy mesh into above data

		bool needsFlip = (SystemInfo.graphicsDeviceVersion.Contains ("GL")) ? flipY : !flipY;

		OVR_CopyDistortionMesh(meshVerts, triIndices, ref scaleOffset, rightEye, needsFlip);
		// Set material scale and offset values
		lc._DMScale.x  = 0.5f * scaleOffset.Scale_x;
		lc._DMScale.y  = scaleOffset.Scale_y;
		lc._DMOffset.x = scaleOffset.Offset_x + ((rightEye) ? 0.25f : -0.25f);
		lc._DMOffset.y = scaleOffset.Offset_y;

		// Copy local mesh into proper Unity mesh structure
		if (create) 
		{
			positions = new Vector3[numVerts];
			uvR = new Vector2[numVerts];
			uvG = new Vector2[numVerts];
			uvB = new Vector3[numVerts];
		}

		for(int i = 0; i < numVerts; i++)
		{
			positions[i].x = meshVerts[i].ScreenPosNDC_x;
			positions[i].y = meshVerts[i].ScreenPosNDC_y;
			positions[i].z = meshVerts[i].Shade; 		// overload for shading on edges
			uvR[i].x       = meshVerts[i].TanEyeAnglesR_u;
			uvR[i].y       = meshVerts[i].TanEyeAnglesR_v;
			uvG[i].x       = meshVerts[i].TanEyeAnglesG_u;
			uvG[i].y       = meshVerts[i].TanEyeAnglesG_v;
			uvB[i].x       = meshVerts[i].TanEyeAnglesB_u;
			uvB[i].y       = meshVerts[i].TanEyeAnglesB_v;
		}

		mesh.vertices  = positions;
		mesh.uv        = uvR;
		mesh.uv1       = uvG;
		mesh.normals   = uvB;
		mesh.triangles = triIndices;

		// Destory internal distorion meshes
		OVR_DestroyDistortionMesh();
	}
	
	/// <summary>
	/// Draws the mesh.
	/// </summary>
	public void DrawMesh()
	{
		if(mesh != null)
		{
			Graphics.DrawMeshNow(mesh, Matrix4x4.identity);		
		}
	}
}