// Converted by iKriz <shaders@ikriz.nl>
// http://www.ikriz.nl/2011/06/11/unity-glsl-shaders/
//
// Original Source: http://www.iquilezles.org/apps/shadertoy/
// Thanks to Inigo Quilez

Shader "ShaderToy/MotionBlur"
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
                
                varying vec2 the_uv;
                
                void main()
                {          
					gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
					the_uv = gl_MultiTexCoord0.st;
                }
                #endif  
 
                #ifdef FRAGMENT
				#include "UnityCG.glslinc"
                uniform sampler2D _MainTex;
				varying vec2 the_uv;
				
				vec3 deform( in vec2 p, float scale )
				{
				    vec2 uv;
				   
				    float mtime = scale+_Time.y;
				    float a = atan(p.y,p.x);
				    float r = sqrt(dot(p,p));
				    float s = r * (1.0+0.5*cos(mtime*1.7));
				
				    uv.x = .1*mtime +.05*p.y+.05*cos(-mtime+a*3.0)/s;
				    uv.y = .1*mtime +.05*p.x+.05*sin(-mtime+a*3.0)/s;
				
				    float w = 0.8-0.2*cos(mtime+3.0*a);
				
				    vec3 res = texture2D(_MainTex,uv).xyz*w;
				    return  res*res;
				
				}
				
				void main(void)
				{
				    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / _ScreenParams.xy;
				    vec3 total = vec3(0.0);
				    float w = 0.0;
				    for( int i=0; i<20; i++ )
				    {
				        vec3 res = deform(p,w);
				        total += res;
				        w += 0.02;
				    }
				    total /= 20.0;
				
				    gl_FragColor = vec4( 3.0*total,1.0);
				}
			
                #endif                          
                ENDGLSL        
            }
     }
	FallBack "Diffuse"
}