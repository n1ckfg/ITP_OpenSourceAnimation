using UnityEngine;
using System.Collections;

//so that we can see changes we make without having to run the game

[ExecuteInEditMode]
public class PostProcessDepth : MonoBehaviour {

	[HideInInspector]
    public bool activate = true;

    public Material mat;

    void Start() {
        camera.depthTextureMode = DepthTextureMode.Depth;
    }

    void OnRenderImage(RenderTexture source, RenderTexture destination) {
        //mat is the material which contains the shader
        //we are passing the destination RenderTexture to
        if (activate) Graphics.Blit(source,destination,mat);
    }

}