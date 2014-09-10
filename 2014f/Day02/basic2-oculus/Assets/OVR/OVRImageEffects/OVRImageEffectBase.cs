/************************************************************************************

Filename    :   OVRImageEffectBase.cs
Content     :   Full screen image effect. 
				This script is a base class for Unity image effects
				component
Created     :   February 21, 2013
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

[RequireComponent(typeof(Camera))]
[AddComponentMenu("")]

//-------------------------------------------------------------------------------------
// ***** OVRImageEffectBase
//
// OVRImageEffectBase is a base class to be used for full screen image effects.
// It will keep the effect from being enabled if Unity does not support it.
//
public class OVRImageEffectBase : MonoBehaviour
{
	/// Provides a shader property that is set in the inspector
	/// and a material instantiated from the shader
	public Material material;

	protected void Start ()
	{
		// Disable if we don't support image effects
		if (!SystemInfo.supportsImageEffects)
		{
			enabled = false;
			return;
		}
	}
}
