Shader "Nick/Composite/Multiply" {
 
Properties {
    _MainTex ("Texture", 2D) = ""
}
 
SubShader {
    Tags {Queue = Transparent}
    Blend Zero SrcColor
    ZWrite Off
	Fog {Mode Off}    
    
    Pass {
        SetTexture[_MainTex]
    } 
}
 
}