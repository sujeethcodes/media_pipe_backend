const express = require('express');
const router = express.Router();
const poseController = require('../controller/poseController');
const backupController = require('../controller/backupController');
const upload = require('../utils/multer');

router.post('/extract-pose', upload.single('image'), poseController.extractPose);
router.get('/trigger-backup', backupController.runBackup);

module.exports = router;
