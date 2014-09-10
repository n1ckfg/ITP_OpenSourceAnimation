/************************************************************************************

Filename    :   OVRLensCorrection.cs
Content     :   Full screen image effect. 
				This script is used to add full-screen lens correction on a camera
				component
Created     :   January 17, 2013
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

[AddComponentMenu("Image Effects/OVRLensCorrection")]

//-------------------------------------------------------------------------------------
// ***** OVRLensCorrection
//
// OVRLensCorrection contains the variables required to set material properties
// for the lens correction image effect.
//
public class OVRLensCorrection : OVRImageEffectBase 
{
	[HideInInspector]
	public Vector2 _Center       		= new Vector2(0.5f, 0.5f);
	[HideInInspector]
	public Vector2 _ScaleIn      		= new Vector2(1.0f,  1.0f);
	[HideInInspector]
	public Vector2 _Scale        		= new Vector2(1.0f, 1.0f);	
	[HideInInspector]
	public Vector4 _HmdWarpParam 		= new Vector4(1.0f, 0.0f, 0.0f, 0.0f);
	[HideInInspector]
	public Vector4 _ChromaticAberration = new Vector4(0.996f, 0.992f, 1.014f, 1.014f);
	[HideInInspector]
	public Vector2 _DMScale				= new Vector2(0.0f, 0.0f);
	[HideInInspector]
	public Vector2 _DMOffset			= new Vector2(0.0f, 0.0f);

	[HideInInspector]
	public float dynamicScale 			= 1.0f;

	//
	// Called by camera to get lens correction values
	// Use default material for this type of lens correction
	public Material GetMaterial()
	{
		material.SetVector("_HmdWarpParam",	_HmdWarpParam);

		return material;
	}

	//
	// Called by camera to get lens correction values w/Chromatic aberration
	public Material material_CA;
	public Material GetMaterial_CA()
	{
		material_CA.SetVector("_HmdWarpParam",	      _HmdWarpParam);
		material_CA.SetVector("_ChromaticAberration", _ChromaticAberration);
		
		return material_CA;
	}

	//
	// Called by camera to get lens correction values for mesh distortion
	public Material material_MeshDistort;
	public Material GetMaterial_MeshDistort()
	{
		material_MeshDistort.SetVector("_DMScale",	_DMScale * dynamicScale);
		material_MeshDistort.SetVector("_DMOffset", _DMOffset);
		return material_MeshDistort;
	}

	//
	// Called by camera to get lens correction values for mesh distortion
	public Material material_MeshDistort_CA;
	public Material GetMaterial_MeshDistort_CA()
	{
		material_MeshDistort_CA.SetVector("_DMScale",  _DMScale * dynamicScale);
		material_MeshDistort_CA.SetVector("_DMOffset", _DMOffset);

		return material_MeshDistort_CA;
	}	
}