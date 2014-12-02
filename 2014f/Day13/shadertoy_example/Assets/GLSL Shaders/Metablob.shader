// Converted by iKriz <shaders@ikriz.nl>
// http://www.ikriz.nl/2011/06/11/unity-glsl-shaders/
//
// Original Source: http://www.iquilezles.org/apps/shadertoy/
// Thanks to Inigo Quilez

Shader "ShaderToy/Metablob"
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
				    //the centre point for each blob
				    vec2 move1;
				    move1.x = _CosTime.w*0.4;
				    move1.y = sin(_Time.y*1.5)*0.4;
				    vec2 move2;
				    move2.x = cos(_Time.z)*0.4;
				    move2.y = sin(_Time.w)*0.4;
				    
				    //screen coordinates
				    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / _ScreenParams.xy;
				  
				    //radius for each blob
				    float r1 =(dot(p-move1,p-move1))*8.0;
				    float r2 =(dot(p+move2,p+move2))*16.0;
				
				    //sum the meatballs
				    float metaball =(1.0/r1+1.0/r2);
				    //alter the cut-off power
				    float col = pow(metaball,8.0);
				
				    //set the output color
				    gl_FragColor = vec4(col,col,col,1.0);
				}
                #endif                          
                ENDGLSL        
            }
     }
	FallBack "Diffuse"
}