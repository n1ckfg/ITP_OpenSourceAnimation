// Converted by iKriz <shaders@ikriz.nl>
// http://www.ikriz.nl/2011/06/11/unity-glsl-shaders/
//
// Original Source: http://www.iquilezles.org/apps/shadertoy/
// Thanks to Inigo Quilez

Shader "ShaderToy/Relief Tunnel"
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
				
				    float r = sqrt( dot(p,p) );
				    float a = atan(p.y,p.x) + 0.5*sin(0.5*r-0.5*_Time.y);
				
				    float s = 0.5 + 0.5*cos(7.0*a);
				    s = smoothstep(0.0,1.0,s);
				    s = smoothstep(0.0,1.0,s);
				    s = smoothstep(0.0,1.0,s);
				    s = smoothstep(0.0,1.0,s);
				
				    uv.x = _Time.y + 1.0/( r + .2*s);
				    uv.y = 3.0*a/3.1416;
				
				    float w = (0.5 + 0.5*s)*r*r;
				
				    vec3 col = texture2D(_MainTex,uv).xyz;
				
				    float ao = 0.5 + 0.5*cos(7.0*a);
				    ao = smoothstep(0.0,0.4,ao)-smoothstep(0.4,0.7,ao);
				    ao = 1.0-0.5*ao*r;
				
				    gl_FragColor = vec4(col*w*ao,1.0);
				}

                #endif                          
                ENDGLSL        
            }
     }
	FallBack "Diffuse"
}