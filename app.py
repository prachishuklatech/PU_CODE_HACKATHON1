from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from nlp_services.voice_compare import VoiceAuthenticator
import os
import uuid
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this to a secure secret key
CORS(app)

# Configuration
UPLOAD_FOLDER = 'audio_files'
ALLOWED_EXTENSIONS = {'wav', 'mp3'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

# Create required directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize voice authenticator
voice_auth = VoiceAuthenticator(threshold=0.85)

# Mock database (replace with your actual database)
users_db = {}
sessions_db = {}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/register', methods=['POST'])
def register():
    try:
        if 'voice_sample' not in request.files:
            return jsonify({'error': 'Voice sample required'}), 400
            
        username = request.form.get('username')
        password = request.form.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
            
        if username in users_db:
            return jsonify({'error': 'Username already exists'}), 409
            
        # Save voice sample
        voice_file = request.files['voice_sample']
        if not allowed_file(voice_file.filename):
            return jsonify({'error': 'Invalid file format'}), 400
            
        voice_filename = f"{username}_{uuid.uuid4()}.wav"
        voice_path = os.path.join(UPLOAD_FOLDER, voice_filename)
        voice_file.save(voice_path)
        
        # Create user record
        users_db[username] = {
            'password_hash': generate_password_hash(password),
            'voice_sample_path': voice_path
        }
        
        return jsonify({'message': 'Registration successful'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        # First factor: Username and password
        username = request.form.get('username')
        password = request.form.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
            
        if username not in users_db:
            return jsonify({'error': 'Invalid credentials'}), 401
            
        if not check_password_hash(users_db[username]['password_hash'], password):
            return jsonify({'error': 'Invalid credentials'}), 401
            
        # Generate session token for second factor
        session_token = str(uuid.uuid4())
        sessions_db[session_token] = {
            'username': username,
            'verified_factors': ['password'],
            'expires': datetime.now() + timedelta(minutes=5)
        }
        
        return jsonify({
            'message': 'First factor verified',
            'session_token': session_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/verify-voice', methods=['POST'])
def verify_voice():
    try:
        session_token = request.headers.get('Session-Token')
        if not session_token or session_token not in sessions_db:
            return jsonify({'error': 'Invalid session'}), 401
            
        session_data = sessions_db[session_token]
        if datetime.now() > session_data['expires']:
            del sessions_db[session_token]
            return jsonify({'error': 'Session expired'}), 401
            
        if 'voice' not in request.files:
            return jsonify({'error': 'Voice sample required'}), 400
            
        username = session_data['username']
        voice_file = request.files['voice']
        
        if not allowed_file(voice_file.filename):
            return jsonify({'error': 'Invalid file format'}), 400
            
        # Save and verify voice sample
        temp_voice_path = os.path.join(UPLOAD_FOLDER, f"temp_{uuid.uuid4()}.wav")
        voice_file.save(temp_voice_path)
        
        try:
            is_verified, similarity = voice_auth.verify_voice(
                users_db[username]['voice_sample_path'],
                temp_voice_path
            )
            
            os.remove(temp_voice_path)  # Clean up temporary file
            
            if not is_verified:
                return jsonify({
                    'error': 'Voice verification failed',
                    'similarity': similarity
                }), 401
                
            # Update session
            session_data['verified_factors'].append('voice')
            session_data['expires'] = datetime.now() + timedelta(minutes=5)
            
            # Check if all factors are verified
            if len(session_data['verified_factors']) >= 3:  # Adjust based on your factors
                return jsonify({
                    'message': 'All factors verified',
                    'auth_token': str(uuid.uuid4())  # Generate final auth token
                }), 200
            
            return jsonify({
                'message': 'Voice verified',
                'similarity': similarity,
                'next_factor': 'your_next_factor'  # Specify your next authentication factor
            }), 200
            
        except Exception as e:
            return jsonify({'error': f'Voice verification error: {str(e)}'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)