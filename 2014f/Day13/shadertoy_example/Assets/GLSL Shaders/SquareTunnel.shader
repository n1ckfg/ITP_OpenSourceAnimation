// Converted by iKriz <shaders@ikriz.nl>
// http://www.ikriz.nl/2011/06/11/unity-glsl-shaders/
//
// Original Source: http://www.iquilezles.org/apps/shadertoy/
// Thanks to Inigo Quilez

Shader "ShaderToy/Square Tunnel"
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
				
				    float r = pow( pow(p.x*p.x,16.0) + pow(p.y*p.y,16.0), 1.0/32.0 );
				    uv.x = .5*_Time.y + 0.5/r;
				    uv.y = 1.0*atan(p.y,p.x)/3.1416;
				
				    vec3 col =  texture2D(_MainTex,uv).xyz;
				
				    gl_FragColor = vec4(col*r*r*r,1.0);
				}
                #endif                          
                ENDGLSL        
            }
     }
	FallBack "Diffuse"
}