// Converted by iKriz <shaders@ikriz.nl>
// http://www.ikriz.nl/2011/06/11/unity-glsl-shaders/
//
// Original Source: http://www.iquilezles.org/apps/shadertoy/
// Thanks to Inigo Quilez

Shader "ShaderToy/Plasma"
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
					//gl_Position = ftransform();
					gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
                }
                #endif  
 
                #ifdef FRAGMENT
				#include "UnityCG.glslinc"
                void main(void)
				{
				   float x = gl_FragCoord.x;
				   float y = gl_FragCoord.y;
				   float mov0 = x+y+cos(sin(_Time.y)*2.)*100.+sin(x/100.)*1000.;
				   float mov1 = y / _ScreenParams.y / 0.2 + _Time.y;
				   float mov2 = x / _ScreenParams.x / 0.2;
				   float c1 = abs(sin(mov1+_Time.y)/2.+mov2/2.-mov1-mov2+_Time.y);
				   float c2 = abs(sin(c1+sin(mov0/1000.+_Time.y)+sin(y/40.+_Time.y)+sin((x+y)/100.)*3.));
				   float c3 = abs(sin(c2+cos(mov1+mov2+c2)+cos(mov2)+sin(x/1000.)));
				   gl_FragColor = vec4( c1,c2,c3,1.0);
				}
                #endif                          
                ENDGLSL        
            }
     }
	FallBack "Diffuse"
}