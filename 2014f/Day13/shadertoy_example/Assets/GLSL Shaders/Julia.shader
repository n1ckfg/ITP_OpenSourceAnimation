// Converted by iKriz <shaders@ikriz.nl>
// http://www.ikriz.nl/2011/06/11/unity-glsl-shaders/
//
// Original Source: http://www.iquilezles.org/apps/shadertoy/
// Thanks to Inigo Quilez

Shader "ShaderToy/Julia"
{    
    Properties
    {
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
                
                void main(void)
				{
				    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / _ScreenParams.xy;
				    vec2 cc = vec2( cos(.25*_Time.y), sin(.25*_Time.y*1.423) );
				
				    float dmin = 1000.0;
				    vec2 z  = p*vec2(1.33,1.0);
				    for( int i=0; i<64; i++ )
				    {
				        z = cc + vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y );
				        float m2 = dot(z,z);
				        if( m2>100.0 ) break;
				        dmin=min(dmin,m2);
				        }
				
				    float color = sqrt(sqrt(dmin))*0.7;
				    gl_FragColor = vec4(color,color,color,1.0);
				}
                #endif                          
                ENDGLSL        
            }
     }
	FallBack "Diffuse"
}