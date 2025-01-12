from flask import Blueprint, request, jsonify
import os
import uuid
from werkzeug.utils import secure_filename
from yolo_processor import YOLOProcessor
import threading

video_bp = Blueprint('video', __name__)
yolo = YOLOProcessor()
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@video_bp.route('/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        task_id = str(uuid.uuid4())
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, f"{task_id}_{filename}")
        file.save(file_path)
        
        # Start processing in background
        thread = threading.Thread(target=yolo.process_video, args=(file_path, task_id))
        thread.start()
        
        return jsonify({
            'message': 'Video upload successful',
            'task_id': task_id
        }), 200
    
    return jsonify({'error': 'Invalid file type'}), 400

@video_bp.route('/progress/<task_id>', methods=['GET'])
def get_progress(task_id):
    result = yolo.get_task_progress(task_id)
    return jsonify(result)
