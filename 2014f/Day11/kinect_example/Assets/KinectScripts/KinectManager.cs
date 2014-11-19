using UnityEngine;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.IO;
using System.Text; 

public class KinectManager : MonoBehaviour
{
	// Public Bool to determine how many players there are. Default of one user.
	public bool TwoUsers = false;
	
	// Public Bool to determine if the sensor is used in near mode.
	public bool NearMode = false;
	
	// Public Bool to determine whether to display user map after calibration.
	public bool DisplayUserMap = false;
	
	// Bools to keep track of who is currently calibrated.
	bool Player1Calibrated = false;
	bool Player2Calibrated = false;
	
	bool AllPlayersCalibrated = false;
	
	// Values to track which ID (assigned by the Kinect) is player 1 and player 2.
	uint Player1ID;
	uint Player2ID;
	
	// Lists of GameObjects that will be controlled by which player.
	public List<GameObject> Player1Avatars;
	public List<GameObject> Player2Avatars;
	
	// Lists of AvatarControllers that will let the models get updated.
	private List<AvatarController> Player1Controllers;
	private List<AvatarController> Player2Controllers;
	
	// Variables needed to track the users.
	private KinectWrapper.UserDelegate NewUser;
	private KinectWrapper.UserDelegate CalibrationStarted;
	private KinectWrapper.UserDelegate CalibrationFailed;
    private KinectWrapper.UserDelegate CalibrationSuccess;
    private KinectWrapper.UserDelegate UserLost;

	private KinectWrapper.SkeletonJointTransformation jointTransform;
	
	// User Map vars.
	private Texture2D usersLblTex;
	private Color[] usersMapColors;
	private Rect usersMapRect;
	private int usersMapSize;
	
	private short[] usersLabelMap;
	private short[] usersDepthMap;
	private float[] usersHistogramMap;
	
	// List of all users
	private List<uint> allUsers;
	
	// GUI Text to show messages.
	private GameObject CalibrationText;
	
	// Bool to keep track of whether OpenNI has been initialized
	private bool OpenNIInitialized = false; 
	
	// The single instance of KinectManager
	private static KinectManager instance;

	
    public static KinectManager Instance
    {
        get
        {
            return instance;
        }
    }
	
	public static bool IsKinectInitialized()
	{
		return instance != null ? instance.OpenNIInitialized : false;
	}
	
	public static bool IsCalibrationNeeded()
	{
		return true;
	}
	
	public bool IsUserDetected()
	{
		return OpenNIInitialized && (allUsers.Count > 0);
	}
	
	public uint GetPlayer1ID()
	{
		return Player1ID;
	}
	
	public uint GetPlayer2ID()
	{
		return Player2ID;
	}
	
	public Vector3 GetUserPosition(uint UserId)
	{
		KinectWrapper.GetJointTransformation(UserId, (int)KinectWrapper.SkeletonJoint.HIPS, ref jointTransform);
		KinectWrapper.SkeletonJointPosition pos = jointTransform.pos;
		
		return new Vector3(pos.x * 0.001f, pos.y * 0.001f, pos.z * 0.001f);
	}
	
	public Quaternion GetUserOrientation(uint UserId, bool flip)
	{
		KinectWrapper.GetJointTransformation(UserId, (int)KinectWrapper.SkeletonJoint.HIPS, ref jointTransform);
		KinectWrapper.SkeletonJointOrientation ori = jointTransform.ori;
		Quaternion quat = ConvertMatrixToQuat(ori, (int)KinectWrapper.SkeletonJoint.HIPS, flip);
		
		return quat;
	}
	
	public bool IsJointTracked(uint UserId, int joint)
	{
		KinectWrapper.GetJointTransformation(UserId, joint, ref jointTransform);
		return jointTransform.ori.confidence > 0.5;
	}
	
	public Vector3 GetJointPosition(uint UserId, int joint)
	{
		KinectWrapper.GetJointTransformation(UserId, joint, ref jointTransform);
		KinectWrapper.SkeletonJointPosition pos = jointTransform.pos;
		
		return new Vector3(pos.x * 0.001f, pos.y * 0.001f, pos.z * 0.001f);
	}
	
	public Quaternion GetJointOrientation(uint UserId, int joint, bool flip)
	{
		KinectWrapper.GetJointTransformation(UserId, joint, ref jointTransform);
		KinectWrapper.SkeletonJointOrientation ori = jointTransform.ori;
		Quaternion quat = ConvertMatrixToQuat(ori, joint, flip);
		
		return quat;
	}
	

	void Awake() 
	{
		// ensure that dll and config are in place
		string srcDllPath = Application.dataPath + "/Plugins/UnityInterface.dll";
		bool bDllCopied = false;
		
		if(!File.Exists("UnityInterface.dll") && File.Exists(srcDllPath))
		{
			Debug.Log("Copying UnityInterface.dll ...");
			File.Copy(srcDllPath, "UnityInterface.dll");
			
			bDllCopied = File.Exists("UnityInterface.dll");
		}

		if(!File.Exists("OpenNI.xml"))
		{
			Debug.Log("Copying OpenNI.xml ...");
			TextAsset textRes = Resources.Load("OpenNI", typeof(TextAsset)) as TextAsset;
			
			if(textRes != null)
			{
				File.WriteAllText("OpenNI.xml", textRes.text);
			}
		}
		
		if(bDllCopied)
		{
			// reload the same level
			Application.LoadLevel(Application.loadedLevel);
		}
	}

	void Start()
	{
		CalibrationText = GameObject.Find("CalibrationText");

		try 
		{
			// Make sure we have the Open NI file.
			uint rc = KinectWrapper.Init(new StringBuilder("OpenNI.xml"));
			
	        if (rc != 0)
	        {
	            throw new Exception(String.Format("Error initing OpenNI: {0}", Marshal.PtrToStringAnsi(KinectWrapper.GetStatusString(rc))));
	        }

	        // Initialize depth & label map related stuff
	        usersMapSize = KinectWrapper.GetDepthWidth() * KinectWrapper.GetDepthHeight();
	        usersLblTex = new Texture2D(KinectWrapper.GetDepthWidth(), KinectWrapper.GetDepthHeight());
	        usersMapColors = new Color[usersMapSize];
	        usersMapRect = new Rect(Screen.width - usersLblTex.width / 2, Screen.height - usersLblTex.height / 2, usersLblTex.width / 2, usersLblTex.height / 2);
	        usersLabelMap = new short[usersMapSize];
	        usersDepthMap = new short[usersMapSize];
	        usersHistogramMap = new float[5000];
	
	        // Initialize user list to contain ALL users.
	        allUsers = new List<uint>();
	        
	        // Initialize user callbacks.
	        NewUser = new KinectWrapper.UserDelegate(OnNewUser);
	        CalibrationStarted = new KinectWrapper.UserDelegate(OnCalibrationStarted);
	        CalibrationFailed = new KinectWrapper.UserDelegate(OnCalibrationFailed);
	        CalibrationSuccess = new KinectWrapper.UserDelegate(OnCalibrationSuccess);
	        UserLost = new KinectWrapper.UserDelegate(OnUserLost);
			
			// Pull the AvatarController from each of the players Avatars.
			Player1Controllers = new List<AvatarController>();
			Player2Controllers = new List<AvatarController>();
			
			// Add each of the avatars' controllers into a list for each player.
			foreach(GameObject avatar in Player1Avatars)
			{
				Player1Controllers.Add(avatar.GetComponent<AvatarController>());
			}
			
			foreach(GameObject avatar in Player2Avatars)
			{
				Player2Controllers.Add(avatar.GetComponent<AvatarController>());
			}
			
			// GUI Text.
			if(CalibrationText != null)
			{
				CalibrationText.guiText.text = "MATCH POSE TO CALIBRATE";
			}
			
	        // Start looking for users.
	        KinectWrapper.StartLookingForUsers(NewUser, CalibrationStarted, CalibrationFailed, CalibrationSuccess, UserLost);
			Debug.Log("Waiting for users to calibrate");
			
			// Set the default smoothing for the Kinect.
			KinectWrapper.SetSkeletonSmoothing(0.7);
			
			instance = this;
			OpenNIInitialized = true;
		} 
		catch(DllNotFoundException ex)
		{
			Debug.LogError(ex.ToString());
			if(CalibrationText != null)
				CalibrationText.guiText.text = "Please check the OpenNI and NITE installations.";
		}
		catch (Exception ex) 
		{
			Debug.LogError(ex.ToString());
			if(CalibrationText != null)
				CalibrationText.guiText.text = ex.Message;
		}
	}
	
	void Update()
	{
		if(OpenNIInitialized)
		{
	        // Update to the next frame.
			KinectWrapper.Update(false);
	
	        // If the players aren't all calibrated yet, draw the user map.
			if(!AllPlayersCalibrated || DisplayUserMap)
			{
	        	UpdateUserMap();
			}
			
			// Update player 1's models if he/she is calibrated and the model is active.
			if(Player1Calibrated)
			{
				foreach (AvatarController controller in Player1Controllers)
				{
					if(controller.Active)
					{
						controller.UpdateAvatar(Player1ID, NearMode);
					}
				}
			}
			
			// Update player 2's models if he/she is calibrated and the model is active.
			if(Player2Calibrated)
			{
				foreach (AvatarController controller in Player2Controllers)
				{
					if(controller.Active)
					{
						controller.UpdateAvatar(Player2ID, NearMode);
					}
				}
			}
		}
		
		// Kill the program with ESC.
		if(Input.GetKeyDown(KeyCode.Escape))
		{
			Application.Quit();
		}
	}
	
	// Make sure to kill the Kinect on quitting.
	void OnApplicationQuit()
	{
		if(OpenNIInitialized)
		{
			// Shutdown OpenNI
			KinectWrapper.Shutdown();
			instance = null;
		}
	}
	
	// Draw the Histogram Map on the GUI.
    void OnGUI()
    {
		if(OpenNIInitialized)
		{
	        if (!AllPlayersCalibrated || DisplayUserMap)
	        {
	            GUI.DrawTexture(usersMapRect, usersLblTex);
	        }
			
			// Find out if any of the currently seen users are trying to calibrate.
	        foreach (uint userId in allUsers)
	        {
	            float progress = KinectWrapper.GetUserPausePoseProgress(userId);
				
	            if (progress > 0.0)
	                break;
	        }
		}
    }
	
	// Update / draw the User Map
    void UpdateUserMap()
    {
        // copy over the maps
        Marshal.Copy(KinectWrapper.GetUsersLabelMap(), usersLabelMap, 0, usersMapSize);
        Marshal.Copy(KinectWrapper.GetUsersDepthMap(), usersDepthMap, 0, usersMapSize);

        // Flip the texture as we convert label map to color array
        int flipIndex, i;
        int numOfPoints = 0;
		Array.Clear(usersHistogramMap, 0, usersHistogramMap.Length);

        // Calculate cumulative histogram for depth
        for (i = 0; i < usersMapSize; i++)
        {
            // Only calculate for depth that contains users
            if (usersLabelMap[i] != 0)
            {
                usersHistogramMap[usersDepthMap[i]]++;
                numOfPoints++;
            }
        }
		
        if (numOfPoints > 0)
        {
            for (i = 1; i < usersHistogramMap.Length; i++)
	        {   
		        usersHistogramMap[i] += usersHistogramMap[i-1];
	        }
            for (i = 0; i < usersHistogramMap.Length; i++)
	        {
                usersHistogramMap[i] = 1.0f - (usersHistogramMap[i] / numOfPoints);
	        }
        }

        // Create the actual users texture based on label map and depth histogram
        for (i = 0; i < usersMapSize; i++)
        {
            flipIndex = usersMapSize - i - 1;
			
            if (usersLabelMap[i] == 0)
            {
                usersMapColors[flipIndex] = Color.clear;
            }
            else
            {
                // Create a blending color based on the depth histogram
                Color c = new Color(usersHistogramMap[usersDepthMap[i]], usersHistogramMap[usersDepthMap[i]], usersHistogramMap[usersDepthMap[i]], 0.9f);
                switch (usersLabelMap[i] % 4)
                {
                    case 0:
                        usersMapColors[flipIndex] = Color.red * c;
                        break;
                    case 1:
                        usersMapColors[flipIndex] = Color.green * c;
                        break;
                    case 2:
                        usersMapColors[flipIndex] = Color.blue * c;
                        break;
                    case 3:
                        usersMapColors[flipIndex] = Color.magenta * c;
                        break;
                }
            }
        }
		
		// Draw it!
        usersLblTex.SetPixels(usersMapColors);
        usersLblTex.Apply();
    }

//	// Add model to player list.
//	void AddAvatar(GameObject avatar, List<GameObject> whichPlayerList)
//	{
//		whichPlayerList.Add(avatar);
//	}
//	
//	// Remove model from player list.
//	void RemoveAvatar(GameObject avatar, List<GameObject> whichPlayerList)
//	{
//		whichPlayerList.Remove(avatar);
//	}
	
	// Functions that let you recalibrate either player 1 or player 2.
	void RecalibratePlayer1()
	{
		OnUserLost(Player1ID);
	}
	
	void RecalibratePlayer2()
	{
		OnUserLost(Player2ID);
	}
	
	// When a new user enters, add it to the list.
	void OnNewUser(uint UserId)
    {
        Debug.Log(String.Format("[{0}] New user", UserId));
        allUsers.Add(UserId);
    }   
	
	// Print out when the user begins calibration.
    void OnCalibrationStarted(uint UserId)
    {
		Debug.Log(String.Format("[{0}] Calibration started", UserId));
		
		if(CalibrationText != null)
		{
			CalibrationText.guiText.text = "CALIBRATING...\nPLEASE HOLD STILL";
		}
    }
	
	// Alert us when the calibration fails.
    void OnCalibrationFailed(uint UserId)
    {
        Debug.Log(String.Format("[{0}] Calibration failed", UserId));
		
		if(CalibrationText != null)
		{
			CalibrationText.guiText.text = "MATCH POSE TO CALIBRATE";
		}
    }
	
	// If a user successfully calibrates, assign him/her to player 1 or 2.
    void OnCalibrationSuccess(uint UserId)
    {
        Debug.Log(String.Format("[{0}] Calibration success", UserId));
		
		// If player 1 hasn't been calibrated, assign that UserID to it.
		if(!Player1Calibrated)
		{
			// Check to make sure we don't accidentally assign player 2 to player 1.
			if (UserId != Player2ID)
			{
				Player1Calibrated = true;
				Player1ID = UserId;
				
				foreach(AvatarController controller in Player1Controllers)
				{
					controller.SuccessfulCalibration(UserId);
				}
				
				// If we're not using 2 users, we're all calibrated.
				if(!TwoUsers)
				{
					AllPlayersCalibrated = true;
				}
			}
		}
		// Otherwise, assign to player 2.
		else
		{
			if (UserId != Player1ID)
			{
				Player2Calibrated = true;
				Player2ID = UserId;
				
				foreach(AvatarController controller in Player2Controllers)
				{
					controller.SuccessfulCalibration(UserId);
				}
				
				// All users are calibrated!
				AllPlayersCalibrated = true;
			}
		}
		
		// If all users are calibrated, stop trying to find them.
		if(AllPlayersCalibrated)
		{
			Debug.Log("");
			
			if(CalibrationText != null)
			{
				CalibrationText.guiText.text = "";
			}
			
			KinectWrapper.StopLookingForUsers();
		}
    }
	
	// If a user walks out of the kinects all-seeing eye, try to reassign them! Or, assign a new user to player 1.
    void OnUserLost(uint UserId)
    {
        Debug.Log(String.Format("[{0}] User lost", UserId));
		
		// If we lose player 1...
		if(UserId == Player1ID)
		{
			// Null out the ID and reset all the models associated with that ID.
			Player1ID = 0;
			
			foreach(AvatarController controller in Player1Controllers)
			{
				controller.RotateToCalibrationPose(UserId, IsCalibrationNeeded());
			}
			
			// Try to replace that user!
			Debug.Log("Starting to look for users");
			KinectWrapper.StartLookingForUsers(NewUser, CalibrationStarted, CalibrationFailed, CalibrationSuccess, UserLost);
		}
		
		// If we lose player 2...
		if(UserId == Player2ID)
		{
			// Null out the ID and reset all the models associated with that ID.
			Player2ID = 0;
			
			foreach(AvatarController controller in Player2Controllers)
			{
				controller.RotateToCalibrationPose(UserId, IsCalibrationNeeded());
			}
			
			// Try to replace that user!
			Debug.Log("Starting to look for users");
			KinectWrapper.StartLookingForUsers(NewUser, CalibrationStarted, CalibrationFailed, CalibrationSuccess, UserLost);
		}

        // remove from global users list
        allUsers.Remove(UserId);
    }
	
	// convert the matrix to quaternion, taking care of the mirroring
	private Quaternion ConvertMatrixToQuat(KinectWrapper.SkeletonJointOrientation ori, int joint, bool flip)
	{
		Vector3 vZ = Vector3.zero;
		Vector3 vY = Vector3.zero;
		
		if(ori.confidence > 0.5)
		{
			if(flip)
			{
				// For the spine and waist, we flip y rotation.
				//if(joint <= 4)
				{
					vZ = new Vector3(ori.m02, -ori.m12, ori.m22);
		            vY = new Vector3(-ori.m01, ori.m11, -ori.m21);
				}
//				// Everything else, we flip in a way that doesn't break the model (MAGICAL)
//				else
//				{
//					vZ = new Vector3(-ori.m02, ori.m12, -ori.m22);
//		            vY = new Vector3(ori.m01, -ori.m11, ori.m21);
//				}
			}
			else
			{
	            vZ = new Vector3(-ori.m02, -ori.m12, ori.m22);
	            vY = new Vector3(ori.m01, ori.m11, -ori.m21);
			}

			if(vZ.x != 0.0f || vZ.y != 0.0f || vZ.z != 0.0f)
			{
				return Quaternion.LookRotation(vZ, vY);
			}
		}

		return Quaternion.identity;
	}
	
}


