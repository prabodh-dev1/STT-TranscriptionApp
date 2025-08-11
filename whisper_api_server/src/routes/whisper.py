import os
import tempfile
import whisper
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import torch

whisper_bp = Blueprint('whisper', __name__)

# Initialize Whisper model (using base model for balance of speed and accuracy)
# Check if CUDA is available, otherwise use CPU
device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("base", device=device)

ALLOWED_EXTENSIONS = {'wav', 'mp3', 'mp4', 'm4a', 'flac', 'aac', 'ogg', 'wma'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@whisper_bp.route('/transcribe', methods=['POST'])
def transcribe_audio():
    """
    Transcribe audio file to text using Whisper
    Expects: multipart/form-data with 'audio' file
    Returns: JSON with transcribed text
    """
    try:
        # Check if audio file is present
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        file = request.files['audio']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not supported. Supported formats: ' + ', '.join(ALLOWED_EXTENSIONS)}), 400
        
        # Save uploaded file to temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(secure_filename(file.filename))[1]) as temp_file:
            file.save(temp_file.name)
            temp_filename = temp_file.name
        
        try:
            # Transcribe audio using Whisper
            result = model.transcribe(temp_filename)
            
            # Extract text and segments
            transcribed_text = result["text"].strip()
            segments = []
            
            # Process segments for more detailed response
            for segment in result.get("segments", []):
                segments.append({
                    "start": segment["start"],
                    "end": segment["end"],
                    "text": segment["text"].strip()
                })
            
            response_data = {
                "text": transcribed_text,
                "segments": segments,
                "language": result.get("language", "unknown"),
                "success": True
            }
            
            return jsonify(response_data), 200
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_filename):
                os.unlink(temp_filename)
                
    except Exception as e:
        return jsonify({'error': f'Transcription failed: {str(e)}', 'success': False}), 500

@whisper_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint to verify Whisper service is running
    """
    try:
        # Check if model is loaded and device is available
        device_info = {
            "device": device,
            "cuda_available": torch.cuda.is_available(),
            "model_loaded": model is not None
        }
        
        if torch.cuda.is_available():
            device_info["gpu_name"] = torch.cuda.get_device_name(0)
            device_info["gpu_memory"] = f"{torch.cuda.get_device_properties(0).total_memory / 1024**3:.1f} GB"
        
        return jsonify({
            "status": "healthy",
            "service": "whisper-api",
            "device_info": device_info,
            "supported_formats": list(ALLOWED_EXTENSIONS)
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

@whisper_bp.route('/models', methods=['GET'])
def get_available_models():
    """
    Get list of available Whisper models
    """
    models = [
        {"name": "tiny", "size": "~39 MB", "speed": "fastest", "accuracy": "lowest"},
        {"name": "base", "size": "~74 MB", "speed": "fast", "accuracy": "good"},
        {"name": "small", "size": "~244 MB", "speed": "medium", "accuracy": "better"},
        {"name": "medium", "size": "~769 MB", "speed": "slow", "accuracy": "very good"},
        {"name": "large", "size": "~1550 MB", "speed": "slowest", "accuracy": "best"}
    ]
    
    return jsonify({
        "available_models": models,
        "current_model": "base",
        "device": device
    }), 200

