//************************************************************************************
//
// Filename    :   OVRLensCorrection_Mesh_CA.shader
// Content     :   Full screen shader
//				   This shader warps the final camera image to match the lens curvature on the Rift.
// Created     :   February 14, 2014
// Authors     :   Peter Giokaris
//
// Copyright   :   Copyright 2013 Oculus VR, Inc. All Rights reserved.
//
// Use of this software is subject to the terms of the Oculus LLC license
// agreement provided at the time of installation or download, or which
// otherwise accompanies this software in either electronic or hard copy form.
//
//************************************************************************************/

Shader "Custom/OVRLensCorrection_Mesh_CA"
{
	Properties 
	{
		_MainTex ("Base (RGB)", 2D) = "" {}
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

	float2 _DMScale  = float2(0,0);
	float2 _DMOffset = float2(0,0);		
							
	v2f vert( appdata v ) 
	{
		v2f o;
		
		o.pos = v.pos;
		o.c   = o.pos.z;
		o.uvR = v.uvR.xy * _DMScale + _DMOffset;
		o.uvG = v.uvG.xy * _DMScale + _DMOffset;
		o.uvB = v.uvB.xy * _DMScale + _DMOffset;
			
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