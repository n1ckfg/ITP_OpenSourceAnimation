// Converted by iKriz <shaders@ikriz.nl>
// http://www.ikriz.nl/2011/06/11/unity-glsl-shaders/
//
// Original Source: http://www.iquilezles.org/apps/shadertoy/
// Thanks to Inigo Quilez

Shader "ShaderToy/Kaleidoscope"
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
				    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / _ScreenParams.xy;
				    vec2 uv;
				   
				    float a = atan(p.y,p.x);
				    float r = sqrt(dot(p,p));
				
				    uv.x =          7.0*a/3.1416;
				    uv.y = -_Time.y+ sin(7.0*r+_Time.y) + .7*cos(_Time.y+7.0*a);
				
				    float w = .5+.5*(sin(_Time.y+7.0*r)+ .7*cos(_Time.y+7.0*a));
				
				    vec3 col =  texture2D(_MainTex,uv*.5).xyz;
				
				    gl_FragColor = vec4(col*w,1.0);
				}
				#endif                          
                ENDGLSL        
            }
     }
	FallBack "Diffuse"
}