import cv2
import numpy as np
from ultralytics import YOLO
import json
import os
from datetime import datetime

class YOLOProcessor:
    def __init__(self):
        self.model = YOLO('yolov8n.pt')  # Load the YOLOv8 model
        self.vehicle_classes = ['car', 'truck', 'bus', 'motorcycle', 'bicycle']
        self.results_cache = {}

    def process_video(self, video_path, task_id):
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        analysis_results = {
            'vehicle_counts': {class_name: 0 for class_name in self.vehicle_classes},
            'frame_by_frame': [],
            'traffic_density': [],
            'total_frames': total_frames,
            'fps': fps,
            'duration': total_frames / fps if fps else 0,
            'timestamp': datetime.now().isoformat()
        }

        frame_count = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Process every 5th frame to improve performance
            if frame_count % 5 == 0:
                results = self.model(frame)
                frame_data = self._analyze_frame(results[0], frame_count, fps)
                analysis_results['frame_by_frame'].append(frame_data)
                
                # Update total counts
                for vehicle_type, count in frame_data['counts'].items():
                    analysis_results['vehicle_counts'][vehicle_type] += count

                # Calculate traffic density
                density = len(results[0].boxes) / (frame.shape[0] * frame.shape[1])
                analysis_results['traffic_density'].append({
                    'frame': frame_count,
                    'density': density,
                    'time': frame_count / fps
                })

            frame_count += 1
            
            # Save intermediate results
            if frame_count % 100 == 0:
                self.results_cache[task_id] = {
                    'progress': (frame_count / total_frames) * 100,
                    'current_results': analysis_results
                }

        cap.release()
        
        # Calculate averages and final statistics
        analysis_results['average_density'] = np.mean([d['density'] for d in analysis_results['traffic_density']])
        analysis_results['peak_density'] = max([d['density'] for d in analysis_results['traffic_density']])
        analysis_results['total_vehicles'] = sum(analysis_results['vehicle_counts'].values())
        
        # Save final results
        self.results_cache[task_id] = {
            'progress': 100,
            'current_results': analysis_results
        }
        
        return analysis_results

    def _analyze_frame(self, result, frame_number, fps):
        frame_data = {
            'frame_number': frame_number,
            'timestamp': frame_number / fps,
            'counts': {class_name: 0 for class_name in self.vehicle_classes},
            'detections': []
        }

        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = result.names[class_id]
            confidence = float(box.conf[0])
            
            if class_name in self.vehicle_classes and confidence > 0.5:
                frame_data['counts'][class_name] += 1
                
                # Get bounding box coordinates
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                frame_data['detections'].append({
                    'class': class_name,
                    'confidence': confidence,
                    'bbox': [float(x1), float(y1), float(x2), float(y2)]
                })

        return frame_data

    def get_task_progress(self, task_id):
        return self.results_cache.get(task_id, {'progress': 0, 'current_results': None})
