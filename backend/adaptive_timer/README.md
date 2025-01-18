# Adaptive Traffic Signal Timer

This implementation is based on the work from [mihir-m-gandhi/Adaptive-Traffic-Signal-Timer](https://github.com/mihir-m-gandhi/Adaptive-Traffic-Signal-Timer).

## Setup Instructions

1. Install Python Dependencies:
```bash
cd backend/adaptive_timer
pip install -r requirements.txt
```

2. Download YOLOv2 Weights:
- Download the weights file from [here](https://pjreddie.com/media/files/yolov2.weights)
- Place it in the `backend/adaptive_timer/bin` directory

3. Install Node.js Dependencies:
```bash
cd backend
npm install
```

4. Start the Backend Server:
```bash
node server.js
```

5. Start the Frontend Development Server:
```bash
cd frontend
npm start
```

## Features

1. **Vehicle Detection**:
   - Uses YOLO (You Only Look Once) for real-time vehicle detection
   - Classifies vehicles into categories: cars, buses, trucks, and bikes

2. **Signal Timing Algorithm**:
   - Dynamically adjusts signal timings based on vehicle density
   - Considers different vehicle types with appropriate weights
   - Maintains minimum and maximum green times for safety

3. **Simulation**:
   - Visual representation of traffic flow
   - Real-time updates of vehicle counts and signal states
   - Interactive controls for starting, stopping, and resetting simulation

## Implementation Details

### Vehicle Detection Module
- Uses YOLOv2 for object detection
- Processes video frames in real-time
- Provides vehicle counts by type

### Signal Switching Algorithm
- Updates signal timings based on:
  - Number of vehicles
  - Vehicle types
  - Waiting time
  - Lane capacity

### Simulation Module
- Built with Pygame
- Visualizes traffic flow
- Shows signal states and timings
- Displays vehicle movements

## Credits
Original implementation by [Mihir Gandhi](https://github.com/mihir-m-gandhi)
