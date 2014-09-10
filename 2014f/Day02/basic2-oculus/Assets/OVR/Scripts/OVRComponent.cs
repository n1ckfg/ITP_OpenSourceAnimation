﻿/************************************************************************************

Filename    :   OVRComponent.cs
Content     :   Base component OVR class
Created     :   January 8, 2013
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
using System.Collections.Generic;


//-------------------------------------------------------------------------------------
// ***** OVRComponent
//

/// <summary>
/// OVRComponent is the base class for many of the OVR classes. It is used to provide base
/// functionality to classes derived from it.
///
/// NOTE: It is important that any overloaded functions in derived classes call 
/// base.<NAME OF FUNCTION (i.e. Awake)> to allow for base functionality.
/// 
/// </summary>
public class OVRComponent : MonoBehaviour
{
	protected float DeltaTime = 1.0f;

	/// <summary>
	/// Awake this instance.
	/// </summary>
	public virtual void Awake()
	{
	}

	/// <summary>
	/// Start this instance.
	/// </summary>
	public virtual void Start()
	{
	}

	/// <summary>
	/// Update this instance.
	/// </summary>
	public virtual void Update()
	{
		// If we are running at 60fps, DeltaTime will be set to 1.0 
		DeltaTime = (Time.deltaTime * 60.0f);
	}
}


