using UnityEngine;
using System.Collections;

[RequireComponent (typeof(AudioSource))]

public class LipSyncVolume : MonoBehaviour {

	[HideInInspector]
	public float intensity;
	public enum Smoothing { Noisiest = 0, Noisier, Normal, Smoother, Smoothest };
	public Smoothing smoothing = Smoothing.Normal;
	public bool useMicrophone = false;
	public int micNumber = 0;
	public int micSampleRate = 44100;
	public int delay = 1;
	public float noiseFloor = 0.0f;

	private int winWidth = 1024*8;
	private	 float[] samples;

	public void Start(){
		SetSmoothing(smoothing);
		if (useMicrophone){
			audio.playOnAwake = false;
			audio.loop = true;
			if (delay < 1) Debug.LogError ("Microphone Delay must be at least 1");
			//audio.clip = Microphone.Start("", true, delay, micSampleRate);
			if (Microphone.devices.Length > 0 && Microphone.devices.Length > micNumber){
				audio.clip = Microphone.Start(Microphone.devices[micNumber], true, delay, micSampleRate);
				//*** this is necessary or you get extreme latency problems ***
				while(Microphone.GetPosition(audio.name) <= 0);
			}
			audio.Play();
		}
	}

	public void SetSmoothing(Smoothing s){
		smoothing = s;
		switch(s){
			case Smoothing.Noisiest:
				winWidth = 1024;
				break;
			case Smoothing.Noisier:
				winWidth = 1024*2;
				break;
			case Smoothing.Normal:
				winWidth = 1024*4;
				break;
			case Smoothing.Smoother:
				winWidth = 1024*8;
				break;
			case Smoothing.Smoothest:
				winWidth = 1024*16;
				break;
		}
		samples = new float[winWidth];
	}

	public void Update(){
		//if (!audio.isPlaying){
		if (audio==null){
			intensity = 0.0f;
		}else{
			float min = 10000000.0f;
			float max = -10000000.0f;
			audio.GetOutputData (samples, 0);
			float average = 0.0f;
			for (int i = 0; i < winWidth; i++){
				float abs = Mathf.Abs(samples[i]);
				if (abs < min)
					min = abs;
				if (abs > max)
					max = abs;
				average += abs;
			}
			average /= winWidth;
			if(average<noiseFloor){
				intensity = 0.0f;
			}else{
				intensity = average;
			}
			Debug.Log("intensity: " + intensity);
		}
	}

}