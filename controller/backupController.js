const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const mongoose = require('mongoose');
const { sequelize } = require('../db/sql'); // Sequelize instance
const Keypoint = require('../models/Keypoint'); // Sequelize model
const Image = require('../models/Image'); // Mongoose model
const sendEmail = require('../utils/sendEmail'); // Email helper

exports.runBackup = async () => {
  try {
    console.log('Starting backup process...');

    const dateStr = new Date().toISOString().split('T')[0];
    const backupDir = path.join(__dirname, `../backup`);
    const zipPath = path.join(backupDir, `${dateStr}-backup.zip`);

    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

    // 1. Fetch SQL data
    const keypoints = await Keypoint.findAll();
    fs.writeFileSync(`${backupDir}/keypoints.json`, JSON.stringify(keypoints, null, 2));

    // 2. Fetch MongoDB data
    const images = await Image.find();
    fs.writeFileSync(`${backupDir}/images.json`, JSON.stringify(images, null, 2));

    // 3. Create ZIP archive
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);
    archive.file(`${backupDir}/keypoints.json`, { name: 'keypoints.json' });
    archive.file(`${backupDir}/images.json`, { name: 'images.json' });
    await archive.finalize();

    console.log(`Backup created at ${zipPath}`);

    // 4. Email ZIP file
    await sendEmail({
      to: 'receiver@example.com',
      subject: `Daily DB Backup - ${dateStr}`,
      text: `Attached is the backup for ${dateStr}`,
      attachments: [{ filename: `${dateStr}-backup.zip`, path: zipPath }],
    });

    console.log('Email sent successfully!');
  } catch (err) {
    console.error('Backup failed:', err.message);
  }
};
