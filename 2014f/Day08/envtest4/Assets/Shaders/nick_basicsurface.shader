//TUTORIAL 6. Alpha map v2
Shader "Nick/Basic Surface Shader"{ //Shader name goes here

	Properties{
		_MainTex("Texture", 2D) = "white"{ }
		_BumpMap("Bump Map", 2D) = "bump"{ }
		_SpecMap("Specular Map", 2D) = "black"{ }
		_SpecColor("Specular Color", Color) = (0.5, 0.5, 0.5, 1.0)
		_SpecPower("Specular Power", Range(0, 1)) = 0.5
		//_EmitMap("Emissive Map", 2D) = "black"{ }
		//_EmitPower("Emit Power", Range(0,2)) = 1.0 //glow
		//_AlphaMap("Alpha Map", 2D) = "black"{ }
		//_Cutoff("Alpha Cutoff", Range(0, 1)) = 0.5
	}
	SubShader{
		Tags {"RenderType" = "Opaque" "Queue" = "AlphaTest"}
		
		CGPROGRAM
		#pragma surface surf BlinnPhong alphatest:_Cutoff
		#pragma exclude_renderers flash
		
		sampler2D _MainTex;
		sampler2D _BumpMap;
		sampler2D _SpecMap;
		float _SpecPower;
		//sampler2D _EmitMap;
		//float _EmitPower;
		//sampler2D _AlphaMap;
								
		struct Input{
			float2 uv_MainTex; //(1.0, 1.0) U, V
			float2 uv_BumpMap;
			float2 uv_SpecMap;
			//float2 uv_EmitMap;
			//float2 uv_AlphaMap;
		//float4 color : COLOR; //(1.0, 1.0, 1.0, 1.0) R, G, B, A
		};
	
		void surf(Input IN, inout SurfaceOutput o){
			//o.Albedo = 1;
			fixed4 mainTex = tex2D(_MainTex, IN.uv_MainTex);
			fixed4 bumpTex = tex2D(_BumpMap, IN.uv_BumpMap);
			fixed4 specTex = tex2D(_SpecMap, IN.uv_SpecMap);
			//fixed4 emitTex = tex2D(_EmitMap, IN.uv_EmitMap);
			//fixed4 alphaTex = tex2D(_AlphaMap, IN.uv_AlphaMap);
									
			o.Albedo = mainTex.rgb;
			o.Normal = UnpackNormal(bumpTex);
			o.Specular = _SpecPower;
			o.Gloss = specTex.rgb;
			//o.Emission = emitTex.rgb * _EmitPower;
			//o.Alpha = alphaTex.a;
		}
		
		ENDCG
	}
	Fallback "Diffuse"
	
}