//************************************************************************************
//
// Filename    :   OVRLensCorrection_Mesh_CA_TW.shader
// Content     :   Full screen shader
//				   This shader warps the final camera image to match the lens curvature on the Rift.
//				   Includes time warp.
// Created     :   March 14, 2014
// Authors     :   Peter Giokaris
//
// Copyright   :   Copyright 2014 Oculus VR, Inc. All Rights reserved.
//
// Use of this software is subject to the terms of the Oculus LLC license
// agreement provided at the time of installation or download, or which
// otherwise accompanies this software in either electronic or hard copy form.
//
//************************************************************************************/

Shader "Custom/OVRLensCorrection_Mesh_CA_TW"
{
	Properties 
	{
		_MainTex ("Base (RGB)", 2D) = "" {}
		_TimeWarpConstants ("Time Warp Constants", 2D) = "" {}
	}
	
	// Shader code pasted into all further CGPROGRAM blocks
	CGINCLUDE
	
	#include "UnityCG.cginc"
	
	struct appdata 
	{
    	float4 pos      : POSITION;
    	float2 uvR      : TEXCOORD0;
    	float2 uvG      : TEXCOORD1;
    	float3 uvB		: NORMAL;
	};
	
	struct v2f 
	{
		float4 pos 		: POSITION;
		float2 uvR 		: TEXCOORD0;
		float2 uvG 		: TEXCOORD1;
		float2 uvB		: TEXCOORD2;
		float4 c		: COLOR;
	};
	
	sampler2D _MainTex;
	sampler2D _TimeWarpConstants;

	float2    _DMScale  = float2(0,0);
	float2 	  _DMOffset = float2(0,0);
	float4x4  _TimeWarpStart;
	float4x4  _TimeWarpEnd;
	
	float2 TimewarpTexCoordToWarpedPos(float2 inTexCoord, float4x4 rotMat)
	{
		// Vertex inputs are in TanEyeAngle space for the R,G,B channels 
		// (i.e. after chromatic aberration and distortion).
		// These are now "real world" vectors in direction (x,y,1) relative to the eye of the HMD.	
		// Apply the 3x3 timewarp rotation to these vectors.
		float3 transformed = float3( mul ( rotMat, float4(inTexCoord.xy, 1, 1) ).xyz);
		// Project them back onto the Z=1 plane of the rendered images.
		float2 flattened = transformed.xy / transformed.z;
		// Scale them into ([0,0.5],[0,1]) or ([0.5,0],[0,1]) UV lookup space (depending on eye)
		return flattened * _DMScale + _DMOffset;
	}
							
	v2f vert( appdata v ) 
	{
		v2f o;
		
		// set position for mesh
		o.pos = v.pos;

		// set color
		o.c   = o.pos.z;
		
		// calculate time-warp lerp matrix
		float twLerpEnd       = v.uvB.z;
		float twLerpStart     = 1.0f - v.uvB.z;
   		float4x4 lerpedEyeRot = (_TimeWarpStart * twLerpStart) + (_TimeWarpEnd * twLerpEnd);
		
		// sample texture for each color
		o.uvR = float3(TimewarpTexCoordToWarpedPos(v.uvR.xy, lerpedEyeRot), 1);
		o.uvG = float3(TimewarpTexCoordToWarpedPos(v.uvG.xy, lerpedEyeRot), 1);
		o.uvB = float3(TimewarpTexCoordToWarpedPos(v.uvB.xy, lerpedEyeRot), 1);
		
//    	o.c = float4(tex2Dlod(_TimeWarpConstants, float4(0, 0, 0, 0)).x,
//			    	  tex2Dlod(_TimeWarpConstants, float4(0, 1, 0, 0)).x,
//			    	  tex2Dlod(_TimeWarpConstants, float4(0, 2, 0, 0)).x,
//			    	  1);
		
		return o;
	} 
		
	float4 frag(v2f i) : COLOR 
	{
		float red   = tex2D (_MainTex, i.uvR).x;
		float green = tex2D (_MainTex, i.uvG).y;    
    	float blue  = tex2D (_MainTex, i.uvB).z;
    	float alpha = 1;
    	
    	// This is required to get multi-sampling in frag shader to work properly
    	if (any(clamp(i.uvG, float2(0, 0), float2(1, 1)) - i.uvG))
    	{
        	red   = 0;
    		green = 0;    
    		blue  = 0;
		}
    	
    	//return i.c;
    	return float4(red, green, blue, alpha) * i.c;
	}

	ENDCG 
	
	Subshader 
	{
 	Pass 
 	{
	 	ZTest Always Cull Off ZWrite Off
	  	Fog { Mode off }      

      	CGPROGRAM
      	//#pragma fragmentoption ARB_precision_hint_nicest
      	#pragma vertex vert
      	#pragma fragment frag
      	ENDCG
  	}
}

Fallback off
	
} // shader