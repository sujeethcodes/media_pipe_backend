require("dotenv").config();

const cron = require('node-cron');
const { runBackup } = require('../controller/backupController');
const express = require('express');
const app = express();
require('../config/database').sync();
require('../config/mongo');
app.use(express.json());
app.use('/api', require('../routes'));
cron.schedule('59 23 * * *', runBackup);
app.listen(3000, () => console.log('Server running on port 3000'));
