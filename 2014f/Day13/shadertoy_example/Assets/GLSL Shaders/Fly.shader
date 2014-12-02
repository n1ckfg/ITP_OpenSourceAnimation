// Converted by iKriz <shaders@ikriz.nl>
// http://www.ikriz.nl/2011/06/11/unity-glsl-shaders/
//
// Original Source: http://www.iquilezles.org/apps/shadertoy/
// Thanks to Inigo Quilez

Shader "ShaderToy/Fly"
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
				#include "UnityCG.glslinc"
                
                varying vec2 uvpos;
                
                void main()
                {          
					gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
					uvpos = gl_MultiTexCoord0.xy;
                }
                #endif  
 
                #ifdef FRAGMENT
				#include "UnityCG.glslinc"
				
                uniform sampler2D _MainTex;
                varying vec2 uvpos;
                
                void main(void)
				{
				    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / _ScreenParams.xy;

				    float an = _Time.y*.25;
				
				    float x = p.x*cos(an)-p.y*sin(an);
				    float y = p.x*sin(an)+p.y*cos(an);
				     
				    //uvpos.x = .25*x/abs(y);
				    //uvpos.y = .20*_Time.y + .25/abs(y);
					
				    gl_FragColor = vec4(texture2D(_MainTex,uvpos).xyz * y*y, 1.0);
				}
                #endif                          
                ENDGLSL        
            }
     }
	FallBack "Diffuse"
}