//************************************************************************************
//
// Filename    :   OVRLensCorrection_Mesh.shader
// Content     :   Full screen shader
//				   This shader warps the final camera image to match the lens curvature on the Rift.
// Created     :   February 14, 2014
// Authors     :   Peter Giokaris
//
// Copyright   :   Copyright 2014 Oculus VR, Inc. All Rights reserved.
//
// Use of this software is subject to the terms of the Oculus LLC license
// agreement provided at the time of installation or download, or which
// otherwise accompanies this software in either electronic or hard copy form.
//
//************************************************************************************/

Shader "Custom/OVRLensCorrection_Mesh"
{
	Properties 
	{
		_MainTex ("Base (RGB)", 2D) = "" {}
	}
	
	// Shader code pasted into all further CGPROGRAM blocks
	CGINCLUDE
	
	#include "UnityCG.cginc"
	
	struct v2f 
	{
		float4 pos : POSITION;
		float2 uv  : TEXCOORD0;
		float4 c   : COLOR0;
	};
	
	sampler2D _MainTex;
	
	float2 _DMScale  = float2(0,0);
	float2 _DMOffset = float2(0,0);
	
	v2f vert( appdata_img v ) 
	{
		v2f o;
		
		o.pos = v.vertex;
		o.uv  = v.texcoord.xy * _DMScale + _DMOffset;
		o.c   = o.pos.z;
		
		return o;
	} 
		
	half4 frag(v2f i) : COLOR 
	{
    	return tex2D(_MainTex, i.uv) * i.c;
	}

	ENDCG 
	
Subshader 
{
 Pass 
 {
	  ZTest Always Cull Off ZWrite Off
	  Fog { Mode off }      

      CGPROGRAM
      #pragma fragmentoption ARB_precision_hint_fastest
      #pragma vertex vert
      #pragma fragment frag
      ENDCG
  }
}

Fallback off
	
} // shader