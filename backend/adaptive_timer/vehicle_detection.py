import cv2
import numpy as np
from darkflow.net.build import TFNet
import json
import base64

class VehicleDetection:
    def __init__(self):
        self.options = {
            'model': 'cfg/yolo.cfg',
            'load': 'bin/yolov2.weights',
            'threshold': 0.3,
            'gpu': 1.0
        }
        self.tfnet = TFNet(self.options)
        
    def detect_vehicles(self, image):
        results = self.tfnet.return_predict(image)
        vehicles = {'car': 0, 'bus': 0, 'truck': 0, 'bike': 0}
        
        for result in results:
            label = result['label']
            if label in vehicles:
                vehicles[label] += 1
                
        return vehicles
        
    def process_frame(self, frame):
        vehicles = self.detect_vehicles(frame)
        return vehicles
        
    def adjust_signal_timing(self, vehicles):
        total_vehicles = sum(vehicles.values())
        if total_vehicles == 0:
            return 30  # default time
            
        # Weight different vehicle types
        weights = {'car': 1, 'bus': 2.5, 'truck': 2.5, 'bike': 0.5}
        weighted_count = sum(vehicles[v] * weights[v] for v in vehicles)
        
        # Calculate green time based on weighted vehicle count
        min_time = 20
        max_time = 60
        base_time = 30
        
        green_time = base_time + (weighted_count - total_vehicles) * 5
        green_time = max(min_time, min(max_time, green_time))
        
        return int(green_time)
