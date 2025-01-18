const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

let simulationProcess = null;

// Start simulation
router.post('/start', (req, res) => {
    if (simulationProcess) {
        return res.status(400).json({ error: 'Simulation already running' });
    }

    try {
        simulationProcess = spawn('python', [
            path.join(__dirname, '../adaptive_timer/simulation.py')
        ]);

        simulationProcess.stdout.on('data', (data) => {
            console.log(`Simulation output: ${data}`);
        });

        simulationProcess.stderr.on('data', (data) => {
            console.error(`Simulation error: ${data}`);
        });

        simulationProcess.on('close', (code) => {
            console.log(`Simulation process exited with code ${code}`);
            simulationProcess = null;
        });

        res.json({ message: 'Simulation started' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to start simulation' });
    }
});

// Stop simulation
router.post('/stop', (req, res) => {
    if (!simulationProcess) {
        return res.status(400).json({ error: 'No simulation running' });
    }

    try {
        simulationProcess.kill();
        simulationProcess = null;
        res.json({ message: 'Simulation stopped' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to stop simulation' });
    }
});

// Reset simulation
router.post('/reset', (req, res) => {
    if (simulationProcess) {
        simulationProcess.kill();
        simulationProcess = null;
    }

    try {
        simulationProcess = spawn('python', [
            path.join(__dirname, '../adaptive_timer/simulation.py')
        ]);
        res.json({ message: 'Simulation reset' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset simulation' });
    }
});

// Get simulation status
router.get('/status', (req, res) => {
    if (!simulationProcess) {
        return res.status(400).json({ error: 'No simulation running' });
    }

    // This would be replaced with actual data from your simulation
    const mockData = {
        vehicles: {
            car: Math.floor(Math.random() * 10),
            bus: Math.floor(Math.random() * 5),
            truck: Math.floor(Math.random() * 3),
            bike: Math.floor(Math.random() * 15)
        },
        signals: [
            { time: 30, state: 'green' },
            { time: 45, state: 'red' },
            { time: 15, state: 'yellow' },
            { time: 30, state: 'red' }
        ]
    };

    res.json(mockData);
});

module.exports = router;
