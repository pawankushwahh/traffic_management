const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');
require('dotenv').config();
const { spawn } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Serve static files from the React app
const buildPath = path.join(__dirname, 'build');
console.log('Attempting to serve static files from:', buildPath);

if (fs.existsSync(buildPath)) {
  console.log('Build directory exists, contents:', fs.readdirSync(buildPath));
  app.use(express.static(buildPath));
} else {
  console.log('Build directory does not exist at:', buildPath);
  console.log('Current directory contents:', fs.readdirSync(__dirname));
}

// Serve manifest.json with correct content type
app.get('/manifest.json', (req, res) => {
  const manifestPath = path.join(buildPath, 'manifest.json');
  const publicManifestPath = path.join(__dirname, 'frontend', 'public', 'manifest.json');
  
  if (fs.existsSync(manifestPath)) {
    res.set('Content-Type', 'application/json');
    res.sendFile(manifestPath);
  } else if (fs.existsSync(publicManifestPath)) {
    res.set('Content-Type', 'application/json');
    res.sendFile(publicManifestPath);
  } else {
    // Provide a default manifest if none exists
    res.set('Content-Type', 'application/json');
    res.json({
      "short_name": "Traffic Dashboard",
      "name": "Traffic and Women Safety Dashboard",
      "icons": [
        {
          "src": "favicon.ico",
          "sizes": "64x64 32x32 24x24 16x16",
          "type": "image/x-icon"
        }
      ],
      "start_url": ".",
      "display": "standalone",
      "theme_color": "#000000",
      "background_color": "#ffffff"
    });
  }
});

// Configure multer for file uploads with no size limit
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/avi', 'video/quicktime'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// File upload configuration
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload2 = multer({ storage: storage2 });

// Mock YOLO analysis results
const mockResults = {
  vehicle_counts: {
    car: 45,
    truck: 12,
    bus: 8,
    motorcycle: 25,
    bicycle: 5
  },
  traffic_density: Array.from({ length: 50 }, (_, i) => ({
    time: i * 2,
    density: 0.3 + Math.random() * 0.4
  })),
  total_vehicles: 95,
  duration: 100,
  average_density: 0.45,
  peak_density: 0.75
};

// Mock ANPR analysis results
const mockANPRResults = {
  plate_number: "KA01M1234",
  confidence: 0.95,
  vehicle_type: "Car",
  timestamp: new Date().toISOString(),
  violations: {
    speed: 12,
    red_light: 3,
    lane: 8,
    tax_due: 2,
    other: 4
  },
  recent_violations: [
    {
      date: "2025-01-11",
      description: "Speed limit exceeded by 20km/h"
    },
    {
      date: "2025-01-10",
      description: "Red light violation"
    },
    {
      date: "2025-01-09",
      description: "Improper lane change"
    }
  ],
  payment_history: [
    {
      date: "2025-01-01",
      amount: 250,
      status: "Paid"
    },
    {
      date: "2024-12-15",
      amount: 180,
      status: "Pending"
    }
  ]
};

// Video Analysis Routes
app.post('/api/video/upload', upload2.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file uploaded' });
  }

  const taskId = Date.now().toString();

  res.json({
    message: 'Video upload successful',
    taskId: taskId
  });
});

app.get('/api/video/progress/:taskId', (req, res) => {
  const progress = Math.min(100, Math.random() * 100 + 10);
  
  res.json({
    progress: progress,
    current_results: progress > 90 ? mockResults : null
  });
});

// ANPR Routes
app.post('/api/anpr/upload', upload2.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const taskId = Date.now().toString();

  res.json({
    message: 'Image upload successful',
    taskId: taskId
  });
});

app.get('/api/anpr/progress/:taskId', (req, res) => {
  const progress = Math.min(100, Math.random() * 100 + 10);
  
  res.json({
    progress: progress,
    current_results: progress > 90 ? mockANPRResults : null
  });
});

// ANPR endpoint
app.post('/api/anpr/analyze', upload.single('file'), (req, res) => {
  console.log('Received file analysis request');
  
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('Processing file:', req.file.path);

  const pythonProcess = spawn('python', [
    path.join(__dirname, 'backend', 'anpr_processor.py'),
    req.file.path
  ]);

  let result = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    console.log('Python output:', data.toString());
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error('Python error:', data.toString());
    errorOutput += data.toString();
  });

  pythonProcess.on('close', (code) => {
    console.log('Python process exited with code:', code);
    
    try {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      
      if (code !== 0) {
        console.error('Python process failed:', errorOutput);
        return res.status(500).json({ 
          error: 'Error processing image',
          details: errorOutput
        });
      }

      try {
        const parsedResult = JSON.parse(result);
        if (parsedResult.error) {
          return res.status(400).json(parsedResult);
        }
        res.json(parsedResult);
      } catch (parseError) {
        console.error('Error parsing Python output:', parseError);
        res.status(500).json({ 
          error: 'Error parsing analysis results',
          details: result
        });
      }
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ 
        error: 'Server error',
        details: error.message
      });
    }
  });

  pythonProcess.on('error', (error) => {
    console.error('Failed to start Python process:', error);
    res.status(500).json({ 
      error: 'Failed to start analysis process',
      details: error.message
    });
  });
});

// Traffic density endpoint
app.get('/api/traffic-density', (req, res) => {
  const mockData = {
    locations: [
      {
        id: 1,
        lat: 12.9716,
        lng: 77.5946,
        density: 'high',
        vehicleCount: 150
      },
      {
        id: 2,
        lat: 12.9815,
        lng: 77.5921,
        density: 'medium',
        vehicleCount: 89
      }
    ]
  };
  res.json(mockData);
});

// Signal status endpoint
app.get('/api/signal-status', (req, res) => {
  const mockData = {
    signals: [
      {
        id: 1,
        intersection: "Main St & 1st Ave",
        status: "red",
        timer: 30,
        waitTime: 45
      },
      {
        id: 2,
        intersection: "Market St & 2nd Ave",
        status: "green",
        timer: 20,
        waitTime: 15
      }
    ]
  };
  res.json(mockData);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  console.log('Catch-all route hit for:', req.path);
  
  const indexPath = path.join(buildPath, 'index.html');
  console.log('Looking for index.html at:', indexPath);
  
  if (fs.existsSync(indexPath)) {
    console.log('Found index.html, sending file');
    res.sendFile(indexPath);
  } else {
    console.log('index.html not found');
    res.status(404).send(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            .error { color: red; }
            .code { background: #f0f0f0; padding: 10px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1 class="error">Application Error</h1>
          <p>The application could not be loaded. Here's some debug information:</p>
          
          <h3>Current Directory Structure:</h3>
          <pre class="code">${JSON.stringify(fs.readdirSync(__dirname), null, 2)}</pre>
          
          <h3>Build Path:</h3>
          <p class="code">${buildPath}</p>
          
          <h3>Index Path:</h3>
          <p class="code">${indexPath}</p>
          
          <h3>Environment:</h3>
          <pre class="code">
NODE_ENV: ${process.env.NODE_ENV}
PORT: ${process.env.PORT}
PWD: ${process.env.PWD}
          </pre>

          <h3>Build Directory Contents (if exists):</h3>
          <pre class="code">${fs.existsSync(buildPath) ? JSON.stringify(fs.readdirSync(buildPath), null, 2) : 'Build directory does not exist'}</pre>
        </body>
      </html>
    `);
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  // Simulate real-time updates
  const trafficInterval = setInterval(() => {
    socket.emit('trafficUpdate', {
      timestamp: new Date(),
      locations: [
        {
          id: 1,
          lat: 12.9716,
          lng: 77.5946,
          density: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          vehicleCount: Math.floor(Math.random() * 200)
        }
      ]
    });
  }, 5000);

  socket.on('disconnect', () => {
    clearInterval(trafficInterval);
    console.log('Client disconnected');
  });
});

// Database configuration
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/traffic_dashboard', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Start server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('Server running on port', port);
  console.log('Current directory:', __dirname);
  console.log('Build path:', buildPath);
  console.log('Directory contents:', fs.readdirSync(__dirname));
}).on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please try a different port or kill the process using this port.`);
  } else {
    console.error('Error starting server:', error);
  }
});
