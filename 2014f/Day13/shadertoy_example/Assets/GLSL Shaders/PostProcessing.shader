// Converted by iKriz <shaders@ikriz.nl>
// http://www.ikriz.nl/2011/06/11/unity-glsl-shaders/
//
// Original Source: http://www.iquilezles.org/apps/shadertoy/
// Thanks to Inigo Quilez

Shader "ShaderToy/PostProcessing"
{    
    Properties
    {
    	_MainTex ("Base (RGB)", 2D) = "white" {}
    	_Blend ("Blend Percentage", Range(0,1)) = 0
    	_Tint ("Tint Color", Color) = (0.8,1.0,0.7)
    }
    SubShader
    {
        Tags { "Queue" = "Geometry" }
        Pass
            {            
                GLSLPROGRAM                          
                #ifdef VERTEX
                varying vec2 uv;
                void main()
                {          
					gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
					uv = gl_MultiTexCoord0.st;
                }
                #endif  
 
                #ifdef FRAGMENT
				#include "UnityCG.glslinc"
                uniform sampler2D _MainTex;
                uniform vec3 _Tint;
                uniform float _Blend;
                varying vec2 uv;
                
                void main(void)
				{
				    vec2 q = gl_FragCoord.xy / _ScreenParams.xy;
				    // vec2 uv = 0.5 + (q-0.5)*(0.9 + 0.1*sin(0.2*_Time.y));
				
				    //vec3 oricol = texture2D(_MainTex,vec2(q.x,1.0-(-q.y))).xyz;
				    vec3 oricol = texture2D(_MainTex,uv).xyz;
				    vec3 col;
				
				    col.r = texture2D(_MainTex,vec2(uv.x+0.003,uv.y)).x;
				    col.g = texture2D(_MainTex,vec2(uv.x+0.000,uv.y)).y;
				    col.b = texture2D(_MainTex,vec2(uv.x-0.003,uv.y)).z;
				
				    col = clamp(col*0.5+0.5*col*col*1.2,0.0,1.0);
				
				    col *= 0.5 + 0.5*16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y);
				
				    col *= _Tint;
				
				    col *= 0.9+0.1*sin(10.0*_Time.y+uv.y*1000.0);
				
				    col *= 0.97+0.03*sin(110.0*_Time.y);
				
				    float comp = smoothstep( 0.2, 0.7, sin(_Time.y) );
					col = mix( col, oricol, _Blend );
				    gl_FragColor = vec4(col,1.0);
				}
                #endif                          
                ENDGLSL        
            }
    }
    SubShader
    {
        Pass
            {
				CGPROGRAM
				#pragma vertex vert
				#pragma fragment frag
				
				#include "UnityCG.cginc"
				
				float4 _Tint;
				sampler2D _MainTex;
				float _Blend;
				
				struct v2f
				{
				    float4 pos : SV_POSITION;
				    float2  uv : TEXCOORD0;
				};
				
				float4 _MainTex_ST;
				
				v2f vert (appdata_base v)
				{
				    v2f o;
				    o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
				    o.uv = TRANSFORM_TEX (v.texcoord, _MainTex);
				    return o;
				}
				
				half4 frag (v2f i) : COLOR
				{
				    half4 texcol = tex2D (_MainTex, i.uv);
				    half4 col;
				    col.r = tex2D(_MainTex,float2(i.uv.x+0.003,i.uv.y)).x;
				   	col.g = tex2D(_MainTex,float2(i.uv.x+0.000,i.uv.y)).y;
				    col.b = tex2D(_MainTex,float2(i.uv.x-0.003,i.uv.y)).z;
					col = clamp(col*0.5+0.5*col*col*1.2,0.0,1.0);
				    col *= 0.5 + 0.5*16.0*i.uv.x*i.uv.y*(1.0-i.uv.x)*(1.0-i.uv.y);
				    col *= _Tint;
				    col *= 0.9+0.1*sin(10.0*_Time.y+i.uv.y*1000.0); //LineMotion
				    col *= 0.97+0.03*sin(110.0*_Time.y); //Flcker
				    col = lerp( col, texcol, _Blend ); //Blending
				    return col;
				}
				ENDCG
            }
     }
    
     FallBack "Diffuse"
}