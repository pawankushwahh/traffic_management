const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure storage for audio files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/audio');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Handle emergency reports
router.post('/report', async (req, res) => {
  try {
    const {
      vehicleNumber,
      justHappened,
      location,
      timestamp
    } = req.body;

    // Store the report in database
    const report = await SafetyReport.create({
      vehicleNumber,
      justHappened,
      location,
      timestamp,
      status: 'pending'
    });

    // If it just happened, send immediate notifications
    if (justHappened) {
      // Notify nearby authorities
      notifyAuthorities(location, report);
      
      // If vehicle number is provided, fetch vehicle details
      if (vehicleNumber) {
        const vehicleDetails = await fetchVehicleDetails(vehicleNumber);
        await report.update({ vehicleDetails });
      }

      // Fetch nearby CCTV footage
      const cctvFootage = await fetchNearbyCCTVFootage(location, timestamp);
      if (cctvFootage) {
        await report.update({ cctvFootageUrl: cctvFootage.url });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      reportId: report.id
    });
  } catch (error) {
    console.error('Error processing safety report:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing report'
    });
  }
});

// Handle audio upload
router.post('/audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file provided'
      });
    }

    const audioUrl = `/uploads/audio/${req.file.filename}`;
    
    // Process audio for keywords and context
    const audioAnalysis = await processAudioComplaint(audioUrl);

    res.status(201).json({
      success: true,
      audioUrl,
      analysis: audioAnalysis
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing audio'
    });
  }
});

// Get report status
router.get('/report/:id', async (req, res) => {
  try {
    const report = await SafetyReport.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report'
    });
  }
});

module.exports = router;
