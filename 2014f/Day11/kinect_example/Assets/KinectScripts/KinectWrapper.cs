/* Kinect Wrapper for C# / Unity
 * 4/11/2011
 * Dave Bennett
 * 
 * Based off of the Unity Wrapper by PrimeSense Ltd.
 * Special thanks to Shlomo Zippel for making the code this was based on.
 * 
 * This script pulls out all the functions from the DLL for use within Unity / C#.
 * 
 * HOW TO USE:
 * 
 * Just keep this script in the same folder as the rest of your scripts (preferrably, in a scripts folder inside the
 * assets folder). You don't need to attach it to anything within the scene.
 * 
 * The other scripts consume these fucntions.
 * 
 */

// 

using UnityEngine;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.IO;
using System.Text; 

// Wrapper class that holds the various structs, variables, and dll imports
// needed to set up a model with the Kinect.
public class KinectWrapper : MonoBehaviour
{
	// Kinect-given Variables to keep track of the skeleton's joints.
	public enum SkeletonJoint
	{ 
		NONE = 0,
		HEAD = 1,
        NECK = 2,
        SPINE = -1,
		HIPS = 3,

		LEFT_COLLAR = 5,
		LEFT_SHOULDER = 6,
        LEFT_ELBOW = 7,
        LEFT_WRIST = 8,
        LEFT_HAND = 9,
        LEFT_FINGERTIP = 10,

        RIGHT_COLLAR = 11,
		RIGHT_SHOULDER = 12,
		RIGHT_ELBOW = 13,
		RIGHT_WRIST = 14,
		RIGHT_HAND = 15,
        RIGHT_FINGERTIP = 16,

        LEFT_HIP = 17,
        LEFT_KNEE = 18,
        LEFT_ANKLE = 19,
        LEFT_FOOT = 20,

        RIGHT_HIP = 21,
		RIGHT_KNEE = 22,
        RIGHT_ANKLE = 23,
		RIGHT_FOOT = 24,
		
		END 
	};
	
	// NOTE: The following structs had [StructLayout(LayoutKind.Sequential)]. This is unecessary so it was removed.
	
	// Struct to store the joint's poision.
    public struct SkeletonJointPosition
    {
        public float x, y, z;
        public float confidence;
    }
	
	// Struct that will hold the joints orientation.
    public struct SkeletonJointOrientation
    {
        public float    m00, m01, m02,
                        m10, m11, m12,
                        m20, m21, m22;
        public float confidence;
    }
	
	// Struct that combines the previous two and makes the transform.
    public struct SkeletonJointTransformation
    {
        public SkeletonJointPosition pos;
        public SkeletonJointOrientation ori;
    }
	
	// 3D Vector Struct
    public struct XnVector3D
    {
        public float x, y, z;
    }
	
	// DLL Imports to pull in the necessary Unity functions to make the Kinect go.
	[DllImport("UnityInterface.dll")]
	public static extern uint Init(StringBuilder strXmlPath);
	[DllImport("UnityInterface.dll")]
	public static extern void Update(bool async);
	[DllImport("UnityInterface.dll")]
	public static extern void Shutdown();
	
	[DllImport("UnityInterface.dll")]
	public static extern IntPtr GetStatusString(uint rc);
	[DllImport("UnityInterface.dll")]
	public static extern int GetDepthWidth();
	[DllImport("UnityInterface.dll")]
	public static extern int GetDepthHeight();
	[DllImport("UnityInterface.dll")]
	public static extern IntPtr GetUsersLabelMap();
    [DllImport("UnityInterface.dll")]
    public static extern IntPtr GetUsersDepthMap();

	[DllImport("UnityInterface.dll")]
    public static extern void SetSkeletonSmoothing(double factor);

    [DllImport("UnityInterface.dll")]
    public static extern bool GetJointTransformation(uint userID, int joint, ref SkeletonJointTransformation pTransformation);
	
	// Overload to instead use the skeleton joint enum.
	public static bool GetJointTransformation(uint userID, SkeletonJoint joint, ref SkeletonJointTransformation pTransformation)
	{
		return GetJointTransformation(userID, (int)joint, ref pTransformation);
	}
	
	

    [DllImport("UnityInterface.dll")]
    public static extern void StartLookingForUsers(IntPtr NewUser, IntPtr CalibrationStarted, IntPtr CalibrationFailed, IntPtr CalibrationSuccess, IntPtr UserLost);
    [DllImport("UnityInterface.dll")]
    public static extern void StopLookingForUsers();
    [DllImport("UnityInterface.dll")]
    public static extern void LoseUsers();
    [DllImport("UnityInterface.dll")]
    public static extern bool GetUserCenterOfMass(uint userID, ref XnVector3D pCenterOfMass);
    [DllImport("UnityInterface.dll")]
    public static extern float GetUserPausePoseProgress(uint userID);

    public delegate void UserDelegate(uint userId);

    public static void StartLookingForUsers(UserDelegate NewUser, UserDelegate CalibrationStarted, UserDelegate CalibrationFailed, UserDelegate CalibrationSuccess, UserDelegate UserLost)
    {
        StartLookingForUsers(
            Marshal.GetFunctionPointerForDelegate(NewUser),
            Marshal.GetFunctionPointerForDelegate(CalibrationStarted),
            Marshal.GetFunctionPointerForDelegate(CalibrationFailed),
            Marshal.GetFunctionPointerForDelegate(CalibrationSuccess),
            Marshal.GetFunctionPointerForDelegate(UserLost)
		);
    }
}