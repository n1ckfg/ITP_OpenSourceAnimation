Shader "Syphon/Transparent/Alpha Shadow" {
Properties {
	_Color ("Main Color", Color) = (1,1,1,1)
	_SpecColor ("Spec Color", Color) = (1,1,1,0)
	_Emission ("Emissive Color", Color) = (0,0,0,0)
	_Shininess ("Shininess", Range (0.1, 1)) = 0.7
	_MainTex ("Base (RGB) Trans (A)", 2D) = "white" {}
	_Cutoff ("Alpha cutoff", Range(0,1)) = 0.5
}

// 2/3 texture stage GPUs
SubShader {
	Tags {"IgnoreProjector"="True" "Queue"="Geometry+100"  "RenderType"="TransparentCutout"}
	LOD 100
	
	// Non-lightmapped
	Pass {
		Tags { "LightMode" = "Vertex" }
		Cull Off
		Alphatest Greater [_Cutoff]
//		AlphaToMask True
//		ColorMask RGB
		Material {
			Diffuse [_Color]
			Ambient [_Color]
			Shininess [_Shininess]
			Specular [_SpecColor]
			Emission [_Emission]	
		}
		Lighting On
		SeparateSpecular On
		SetTexture [_MainTex] {
			Combine texture * primary DOUBLE, texture * primary 
		} 
	}
	
	// Lightmapped, encoded as dLDR
	Pass {
		Tags { "LightMode" = "VertexLM" }
		Alphatest Greater [_Cutoff]
//		AlphaToMask True
//		ColorMask RGB
		
		BindChannels {
			Bind "Vertex", vertex
			Bind "normal", normal
			Bind "texcoord1", texcoord0 // lightmap uses 2nd uv
			Bind "texcoord", texcoord1 // main uses 1st uv
		}
		SetTexture [unity_Lightmap] {
			matrix [unity_LightmapMatrix]
			constantColor [_Color]
			combine texture * constant
		}
		SetTexture [_MainTex] {
			combine texture * previous DOUBLE, texture * primary
		}
	}
	
	// Lightmapped, encoded as RGBM
	Pass {
		Tags { "LightMode" = "VertexLMRGBM" }
		Alphatest Greater [_Cutoff]
//		AlphaToMask True
//		ColorMask RGB
		
		BindChannels {
			Bind "Vertex", vertex
			Bind "normal", normal
			Bind "texcoord1", texcoord0 // lightmap uses 2nd uv
			Bind "texcoord1", texcoord1 // unused
			Bind "texcoord", texcoord2 // main uses 1st uv
		}
		
		SetTexture [unity_Lightmap] {
			matrix [unity_LightmapMatrix]
			combine texture * texture alpha DOUBLE
		}
		SetTexture [unity_Lightmap] {
			constantColor [_Color]
			combine previous * constant
		}
		SetTexture [_MainTex] {
			combine texture * previous QUAD, texture * primary
		}
	}
	
	// Pass to render object as a shadow caster
	Pass {
		Name "Caster"
		Tags { "LightMode" = "ShadowCaster" }
		Offset 1, 1
		
		Fog {Mode Off}
		ZWrite On ZTest Less Cull Off

CGPROGRAM
#pragma vertex vert
#pragma fragment frag
#pragma multi_compile_shadowcaster
#pragma fragmentoption ARB_precision_hint_fastest
#include "UnityCG.cginc"

struct v2f { 
	V2F_SHADOW_CASTER;
	float2  uv : TEXCOORD1;
};

uniform float4 _MainTex_ST;

v2f vert( appdata_base v )
{
	v2f o;
	TRANSFER_SHADOW_CASTER(o)
	o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);
	return o;
}

uniform sampler2D _MainTex;
uniform float _Cutoff;
uniform float4 _Color;

float4 frag( v2f i ) : COLOR
{
	half4 texcol = tex2D( _MainTex, i.uv );
	clip( texcol.a*_Color.a - _Cutoff );
	
	SHADOW_CASTER_FRAGMENT(i)
}
ENDCG

	}
	
	// Pass to render object as a shadow collector
	Pass {
		Name "ShadowCollector"
		Tags { "LightMode" = "ShadowCollector" }
		
		Fog {Mode Off}
		ZWrite On
		ZTest Less
		ColorMask 0 
	

CGPROGRAM
#pragma vertex vert
#pragma fragment frag
#pragma fragmentoption ARB_precision_hint_fastest
#pragma multi_compile_shadowcollector

#define SHADOW_COLLECTOR_PASS
#include "UnityCG.cginc"

struct v2f {
	V2F_SHADOW_COLLECTOR;
	float2  uv : TEXCOORD5;
};

uniform float4 _MainTex_ST;

v2f vert (appdata_base v)
{
	v2f o;
	TRANSFER_SHADOW_COLLECTOR(o)
	o.uv = TRANSFORM_TEX(v.texcoord, _MainTex);
	return o;
}

uniform sampler2D _MainTex;
uniform float _Cutoff;
uniform float4 _Color;

half4 frag (v2f i) : COLOR
{
	half4 texcol = tex2D( _MainTex, i.uv );
	clip( texcol.a*_Color.a - _Cutoff );
	
	SHADOW_COLLECTOR_FRAGMENT(i)
}
ENDCG

	}
}

// 1 texture stage GPUs
SubShader {
	Tags {"IgnoreProjector"="True" "RenderType"="TransparentCutout"}
	LOD 100
	
	Pass {
		Tags { "LightMode" = "Always" }
		Alphatest Greater [_Cutoff]
		AlphaToMask True
//		ColorMask RGB
		Material {
			Diffuse [_Color]
			Ambient [_Color]
			Shininess [_Shininess]
			Specular [_SpecColor]
			Emission [_Emission]	
		}
		Lighting On
		SeparateSpecular On
		SetTexture [_MainTex] {
			Combine texture * primary DOUBLE, texture * primary 
		} 
	}	
}
}