# MediaPipe Keypoint Backend System

## Features
- Upload image and extract pose keypoints
- Store in MySQL (Sequelize) and MongoDB
- Backup with cron job + email

## Setup
1. Install dependencies
2. Setup MySQL and MongoDB
3. Run server: `node cmd/server.js`
4. API: POST /api/extract-pose (multipart image)

## Cron
Runs at 11:59 PM daily to zip & email database.
