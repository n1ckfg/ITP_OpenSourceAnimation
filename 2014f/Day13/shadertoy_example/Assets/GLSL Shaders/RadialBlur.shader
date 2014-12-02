// Converted by iKriz <shaders@ikriz.nl>
// http://www.ikriz.nl/2011/06/11/unity-glsl-shaders/
//
// Original Source: http://www.iquilezles.org/apps/shadertoy/
// Thanks to Inigo Quilez

Shader "ShaderToy/RadialBlur"
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
					//the_uv = gl_MultiTexCoord0.st;
                }
                #endif  
 
                #ifdef FRAGMENT
				#include "UnityCG.glslinc"
                uniform sampler2D _MainTex;
				uniform sampler2D tex0;
				
				
				vec3 deform( in vec2 p )
				{
				    vec2 uv;
				
				    vec2 q = vec2( sin(1.1*_Time.y+p.x),sin(1.2*_Time.y+p.y) );
				
				    float a = atan(q.y,q.x);
				    float r = sqrt(dot(q,q));
				
				    uv.x = sin(0.0+1.0*_Time.y)+p.x*sqrt(r*r+1.0);
				    uv.y = sin(0.6+1.1*_Time.y)+p.y*sqrt(r*r+1.0);
				
				    return texture2D(_MainTex,uv*.5).xyz;
				}
				
				void main(void)
				{
				    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / _ScreenParams.xy;
				    vec2 s = p;
				
				    vec3 total = vec3(0.0);
				    vec2 d = (vec2(0.0,0.0)-p)/40.0;
				    float w = 1.0;
				    for( int i=0; i<40; i++ )
				    {
				        vec3 res = deform(s);
				        res = smoothstep(0.1,1.0,res*res);
				        total += w*res;
				        w *= .99;
				        s += d;
				    }
				    total /= 40.0;
				    float r = 1.5/(1.0+dot(p,p));
				    gl_FragColor = vec4( total*r,1.0);
				}
                #endif                          
                ENDGLSL        
            }
     }
	FallBack "Diffuse"
}