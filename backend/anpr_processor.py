import cv2
import numpy as np
import easyocr
import json
import sys
import os
import logging
from datetime import datetime

# Configure logging to file instead of console to avoid encoding issues
log_file = os.path.join(os.path.dirname(__file__), 'anpr.log')
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file, encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ANPRProcessor:
    def __init__(self):
        logger.info("Initializing ANPR Processor")
        try:
            # Set download directory for EasyOCR models
            model_dir = os.path.join(os.path.dirname(__file__), 'models')
            if not os.path.exists(model_dir):
                os.makedirs(model_dir)
            os.environ['EASYOCR_MODULE_PATH'] = model_dir
            
            # Initialize EasyOCR with model storage directory
            self.reader = easyocr.Reader(['en'], model_storage_directory=model_dir, download_enabled=True)
            logger.info("EasyOCR initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing EasyOCR: {str(e)}")
            raise
        self.min_confidence = 0.5

    def preprocess_image(self, image):
        logger.info("Preprocessing image")
        try:
            # Resize image if too large
            max_dimension = 1024
            height, width = image.shape[:2]
            if max(height, width) > max_dimension:
                scale = max_dimension / max(height, width)
                image = cv2.resize(image, None, fx=scale, fy=scale)
                logger.info(f"Resized image to {image.shape[1]}x{image.shape[0]}")

            # Convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply bilateral filter
            bilateral = cv2.bilateralFilter(gray, 11, 17, 17)
            
            # Find edges
            edges = cv2.Canny(bilateral, 30, 200)
            
            # Find contours
            contours, _ = cv2.findContours(edges.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            contours = sorted(contours, key=cv2.contourArea, reverse=True)[:10]
            logger.info(f"Found {len(contours)} contours")
            
            return edges, contours
        except Exception as e:
            logger.error(f"Error in preprocessing: {str(e)}")
            raise

    def find_license_plate(self, image, contours):
        logger.info("Looking for license plate")
        try:
            for contour in contours:
                perimeter = cv2.arcLength(contour, True)
                approx = cv2.approxPolyDP(contour, 0.02 * perimeter, True)
                
                if len(approx) == 4:
                    x, y, w, h = cv2.boundingRect(approx)
                    aspect_ratio = w/h
                    
                    # Adjusted aspect ratio range for better detection
                    if 1.5 <= aspect_ratio <= 5.5:
                        plate = image[y:y+h, x:x+w]
                        logger.info(f"Found potential plate with aspect ratio: {aspect_ratio}")
                        return plate, (x, y, w, h)
            
            logger.warning("No license plate found")
            return None, None
        except Exception as e:
            logger.error(f"Error finding license plate: {str(e)}")
            raise

    def enhance_plate_image(self, plate_image):
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(plate_image, cv2.COLOR_BGR2GRAY)
            
            # Apply adaptive thresholding
            thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
            
            # Denoise
            denoised = cv2.fastNlMeansDenoising(thresh)
            
            return denoised
        except Exception as e:
            logger.error(f"Error enhancing plate image: {str(e)}")
            raise

    def extract_plate_text(self, plate_image):
        if plate_image is None:
            logger.warning("No plate image provided for text extraction")
            return None, 0

        try:
            logger.info("Extracting text from plate")
            
            # Enhance plate image
            enhanced = self.enhance_plate_image(plate_image)
            
            # Save debug image
            debug_path = os.path.join(os.path.dirname(__file__), 'debug_plate.jpg')
            cv2.imwrite(debug_path, enhanced)
            logger.info(f"Saved debug plate image to {debug_path}")
            
            # Perform OCR with multiple attempts
            results = self.reader.readtext(enhanced)
            if not results:
                # Try with original image if enhanced fails
                results = self.reader.readtext(plate_image)
            
            logger.info(f"OCR Results: {results}")
            
            if not results:
                logger.warning("No text found in plate image")
                return None, 0
            
            # Get best result
            text, confidence = max(results, key=lambda x: x[2], default=(None, None, 0))[1:]
            
            if confidence < self.min_confidence:
                logger.warning(f"Text found but confidence too low: {confidence}")
                return None, confidence
            
            # Clean text
            text = ''.join(e for e in text if e.isalnum()).upper()
            logger.info(f"Extracted plate text: {text} with confidence: {confidence}")
            return text, confidence
        except Exception as e:
            logger.error(f"Error extracting plate text: {str(e)}")
            raise

    def check_registration_status(self, plate_number):
        logger.info(f"Checking registration for plate: {plate_number}")
        try:
            # Mock data for demo
            mock_data = {
                'valid_until': '2025-06-30',
                'vehicle_type': 'Sedan',
                'owner_name': 'John Doe',
                'tax_status': 'Paid',
                'violations': [
                    {
                        'type': 'Speed Violation',
                        'date': '2024-01-10',
                        'location': 'MG Road',
                        'status': 'Pending',
                        'fine': 1000,
                        'details': 'Exceeded speed limit by 20km/h'
                    }
                ]
            }
            
            valid_until = datetime.strptime(mock_data['valid_until'], '%Y-%m-%d')
            is_valid = valid_until > datetime.now()
            
            result = {
                'plate_number': plate_number,
                'vehicle_type': mock_data['vehicle_type'],
                'registration_valid': is_valid,
                'tax_status': mock_data['tax_status'],
                'violations': mock_data['violations'],
                'action_required': 'Please clear pending violations' if mock_data['violations'] else None,
                'due_amount': sum(v['fine'] for v in mock_data['violations'])
            }
            
            logger.info(f"Registration check complete: {result}")
            return result
        except Exception as e:
            logger.error(f"Error checking registration: {str(e)}")
            raise

    def process_image(self, image_path):
        logger.info(f"Processing image: {image_path}")
        try:
            # Read image
            image = cv2.imread(image_path)
            if image is None:
                error_msg = "Could not read image"
                logger.error(error_msg)
                return json.dumps({'error': error_msg})

            # Save debug original
            debug_dir = os.path.join(os.path.dirname(__file__), 'debug')
            if not os.path.exists(debug_dir):
                os.makedirs(debug_dir)
            debug_original = os.path.join(debug_dir, 'debug_original.jpg')
            cv2.imwrite(debug_original, image)
            logger.info(f"Saved debug original image to {debug_original}")

            # Preprocess image
            edges, contours = self.preprocess_image(image)
            
            # Find license plate
            plate_image, plate_coords = self.find_license_plate(image, contours)
            
            if plate_image is None:
                error_msg = "No license plate detected in the image"
                logger.warning(error_msg)
                return json.dumps({'error': error_msg})
            
            # Extract text from plate
            plate_text, confidence = self.extract_plate_text(plate_image)
            
            if plate_text is None:
                error_msg = "Could not read license plate text"
                logger.warning(error_msg)
                return json.dumps({'error': error_msg})
            
            # Get registration status and details
            result = self.check_registration_status(plate_text)
            logger.info("Analysis complete")
            return json.dumps(result)

        except Exception as e:
            error_msg = f"Error processing image: {str(e)}"
            logger.error(error_msg)
            return json.dumps({'error': error_msg})

def main():
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'Please provide an image path'}))
        sys.exit(1)

    image_path = sys.argv[1]
    if not os.path.exists(image_path):
        print(json.dumps({'error': 'Image file does not exist'}))
        sys.exit(1)

    try:
        processor = ANPRProcessor()
        result = processor.process_image(image_path)
        print(result)
    except Exception as e:
        print(json.dumps({'error': f'Fatal error: {str(e)}'}))
        sys.exit(1)

if __name__ == "__main__":
    main()
