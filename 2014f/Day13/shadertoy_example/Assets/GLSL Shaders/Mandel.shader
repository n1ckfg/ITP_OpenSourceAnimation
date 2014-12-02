// Converted by iKriz <shaders@ikriz.nl>
// http://www.ikriz.nl/2011/06/11/unity-glsl-shaders/
//
// Original Source: http://www.iquilezles.org/apps/shadertoy/
// Thanks to Inigo Quilez

Shader "ShaderToy/Mandel"
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
				    p.x *= _ScreenParams.x/_ScreenParams.y;
				
				    float zoo = .62+.38*sin(.1*_Time.y);
				    float coa = cos( 0.1*(1.0-zoo)*_Time.y );
				    float sia = sin( 0.1*(1.0-zoo)*_Time.y );
				    zoo = pow( zoo,8.0);
				    vec2 xy = vec2( p.x*coa-p.y*sia, p.x*sia+p.y*coa);
				    vec2 cc = vec2(-.745,.186) + xy*zoo;
				
				    vec2 z  = vec2(0.0);
				    vec2 z2 = z*z;
				    float m2;
				    float co = 0.0;
				    for( int i=0; i<256; i++ )
				    {
				        z = cc + vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y );
				        m2 = dot(z,z);
				        if( m2>1024.0 ) break;
				        co += 1.0;
				        }
				    co = co + 1.0 - log2(.5*log2(m2));
				
				    co = sqrt(co/256.0);
				    gl_FragColor = vec4( .5+.5*cos(6.2831*co+0.0),
				                         .5+.5*cos(6.2831*co+0.4),
				                         .5+.5*cos(6.2831*co+0.7),
				                         1.0 );
				}
                #endif                          
                ENDGLSL        
            }
     }
	FallBack "Diffuse"
}