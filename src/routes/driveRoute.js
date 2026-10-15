const express = require('express');
const router = express.Router();
const { uploadToDrive } = require('../services/googleDriveService');

router.post('/export-drive', async (req, res) => {
    try {
        const { fileName, content, mimeType } = req.body;
        const result = await uploadToDrive(fileName || 'sentinela-relatorio.json', JSON.stringify(content, null, 2), mimeType);
        res.json({ success: true, file: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
