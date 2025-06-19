const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Keypoint = sequelize.define('Keypoint', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  imageName: DataTypes.STRING,
  keypoints: DataTypes.JSON,
});

module.exports = Keypoint;
