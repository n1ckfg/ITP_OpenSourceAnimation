Shader "Nick/Composite/Additive" {
 
Properties {
    _MainTex ("Texture", 2D) = ""
}
 
SubShader {
    Tags {Queue = Transparent}
    Blend One One
    ZWrite Off
	Fog {Mode Off}
   
    Pass {
        SetTexture[_MainTex]
    } 
}
 
}