import sys
import json
import mediapipe as mp
import cv2

file_path = sys.argv[1]
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True)
img = cv2.imread(file_path)
results = pose.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

keypoints = {}
if results.pose_landmarks:
    for idx, lm in enumerate(results.pose_landmarks.landmark):
        keypoints[f"{idx}"] = {'x': lm.x, 'y': lm.y, 'z': lm.z, 'visibility': lm.visibility}

print(json.dumps(keypoints))
