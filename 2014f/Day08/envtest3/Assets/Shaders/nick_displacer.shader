Shader "Nick/Displacer"{
    
    Properties{
        _MainTex ("Texture", 2D) = "white" {}
        _DispTex ("Displacement Texture", 2D) = "gray" {}
        _Displacement ("Displacement", Range(0, 1.0)) = 0.1
        _ChannelFactor ("ChannelFactor (r,g,b)", Vector) = (1,0,0)
        _Range ("Range (min,max)", Vector) = (0,0.5,0)
        _ClipRange ("ClipRange [0,1]", float) = 0.8
        //~~
		//_SpecMap("Specular Map", 2D) = "black"{ }
		//_SpecColor("Specular Color", Color) = (0.5, 0.5, 0.5, 1.0)
		//_SpecPower("Specular Power", Range(0, 1)) = 0.5
		//_EmitMap("Emissive Map", 2D) = "black"{ }
		//_EmitPower("Emit Power", Range(0,2)) = 1.0 //glow
	}
 
    SubShader{
        Tags { "RenderType"="Opaque" }
        Cull Off
        LOD 300
 
        CGPROGRAM
        #pragma surface surf Lambert vertex:disp nolightmap
        #pragma target 3.0
        #pragma glsl
 
        sampler2D _DispTex;
        float _Displacement;
        float3 _ChannelFactor;
        float2 _Range;
        float _ClipRange;
 
        struct Input{
            float2 uv_DispTex;
			float2 uv_MainTex; //(1.0, 1.0) U, V
			//float2 uv_SpecMap;
			//float2 uv_EmitMap;
        };
 
        void disp (inout appdata_full v){
            float3 dcolor = tex2Dlod (_DispTex, float4(v.texcoord.xy,0,0));
            float d = (dcolor.r*_ChannelFactor.r + dcolor.g*_ChannelFactor.g + dcolor.b*_ChannelFactor.b);
            v.vertex.xyz += v.normal * d * _Displacement;
        }
 
        sampler2D _MainTex;
		//sampler2D _SpecMap;
		//float _SpecPower;
		//sampler2D _EmitMap;
		//float _EmitPower;
		
		void surf(Input IN, inout SurfaceOutput o){
			//o.Albedo = 1;
			fixed4 mainTex = tex2D(_MainTex, IN.uv_MainTex);
			//fixed4 bumpTex = tex2D(_BumpMap, IN.uv_BumpMap);
			//fixed4 specTex = tex2D(_SpecMap, IN.uv_SpecMap);
			//fixed4 emitTex = tex2D(_EmitMap, IN.uv_EmitMap);
			//fixed4 alphaTex = tex2D(_AlphaMap, IN.uv_AlphaMap);
									
			o.Albedo = mainTex.rgb;
			//o.Normal = UnpackNormal(bumpTex);
			//o.Specular = _SpecPower;
			//o.Gloss = specTex.rgb;
			//o.Emission = emitTex.rgb * _EmitPower;
			//o.Alpha = alphaTex.a;
		}
        
        ENDCG
    }

    FallBack "Diffuse"

}