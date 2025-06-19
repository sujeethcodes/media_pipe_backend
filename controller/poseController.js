const { spawn } = require('child_process');
const fs = require('fs');
const Keypoint = require('../models/Keypoint');
const mongoose = require('../config/mongo');
const ImageModel = mongoose.model('Image', new mongoose.Schema({ data: Buffer, contentType: String }));
const { PYTHON_SCRIPT_PATH } = require('../config/constants');

exports.extractPose = (req, res) => {
  const imagePath = req.file.path;
  const python = spawn('python3', [PYTHON_SCRIPT_PATH, imagePath]);
  let result = '';

  python.stdout.on('data', (data) => result += data.toString());

  python.on('close', async () => {
    const keypoints = JSON.parse(result);
    await Keypoint.create({ imageName: req.file.filename, keypoints });
    const image = new ImageModel({ data: fs.readFileSync(imagePath), contentType: req.file.mimetype });
    await image.save();
    res.json({ message: 'Pose extracted', keypoints });
  });
};
