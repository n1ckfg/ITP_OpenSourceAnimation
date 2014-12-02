// Converted by iKriz <shaders@ikriz.nl>
// http://www.ikriz.nl/2011/06/11/unity-glsl-shaders/
//
// Original Source: http://www.iquilezles.org/apps/shadertoy/
// Thanks to Inigo Quilez

Shader "ShaderToy/Pulse"
{    
    Properties
    {
    	_MainTex ("Base (RGB)", 2D) = "white" {}
    }
    SubShader
    {
        Tags { "Queue" = "Geometry" }
        Pass
            {            
                GLSLPROGRAM                          
                #ifdef VERTEX  
                void main()
                {          
					gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
                }
                #endif  
 
                #ifdef FRAGMENT
				#include "UnityCG.glslinc"
                uniform sampler2D _MainTex;
                
                void main(void)
				{
				    vec2 halfres = _ScreenParams.xy/2.0;
				    vec2 cPos = gl_FragCoord.xy;
				
				    cPos.x -= 0.5*halfres.x*sin(_Time.y/2.0)+0.3*halfres.x*cos(_Time.y)+halfres.x;
				    cPos.y -= 0.4*halfres.y*sin(_Time.y/5.0)+0.3*halfres.y*cos(_Time.y)+halfres.y;
				    float cLength = length(cPos);
				
				    vec2 uv = gl_FragCoord.xy/_ScreenParams.xy+(cPos/cLength)*sin(cLength/30.0-_Time.y*10.0)/25.0;
				    vec3 col = texture2D(_MainTex,uv).xyz*50.0/cLength;
				
				    gl_FragColor = vec4(col,1.0);
				}
                #endif                          
                ENDGLSL        
            }
     }
	FallBack "Diffuse"
}