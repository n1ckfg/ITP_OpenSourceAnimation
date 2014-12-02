// Converted by iKriz <shaders@ikriz.nl>
// http://www.ikriz.nl/2011/06/11/unity-glsl-shaders/
//
// Original Source: http://www.iquilezles.org/apps/shadertoy/
// Thanks to Inigo Quilez

Shader "ShaderToy/MultiTexture"
{    
    Properties
    {
    	_MainTex1 ("Base (RGB)", 2D) = "white" {}
    	_MainTex2 ("Base (RGB)", 2D) = "white" {}
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
                uniform sampler2D _MainTex1;
                uniform sampler2D _MainTex2;
                
                void main(void)
				{
				    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / _ScreenParams.xy;
				    // a rotozoom
				    vec2 cst = vec2( cos(.5*_Time.y), sin(.5*_Time.y) );
				    mat2 rot = 0.5*cst.x*mat2(cst.x,-cst.y,cst.y,cst.x);
				    vec3 col1 = texture2D(_MainTex1,rot*p).xyz;
				
				    // scroll
				    vec3 col2 = texture2D(_MainTex2,0.5*p+sin(0.1*_Time.y)).xyz;
				
				    // blend layers
				    vec3 col = col2*col1;
				
				    gl_FragColor = vec4(col,1.0);
				}
                #endif                          
                ENDGLSL        
            }
     }
	FallBack "Diffuse"
}