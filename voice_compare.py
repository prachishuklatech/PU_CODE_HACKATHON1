try:
    import librosa
except ImportError:
    print("Error: librosa not installed. Install using: pip install librosa")
    raise

try:
    import numpy as np
except ImportError:
    print("Error: numpy not installed. Install using: pip install numpy")
    raise

class VoiceAuthenticator:
    def __init__(self, threshold=0.85):
        self.threshold = threshold
        self.sample_rate = 22050  # Standard sample rate

    def process_audio(self, audio_path):
        """Load and process audio file"""
        try:
            # Load audio file
            audio, sr = librosa.load(audio_path, sr=self.sample_rate)
            
            # Extract MFCC features
            mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
            
            # Calculate mean of features
            mfcc_mean = np.mean(mfcc, axis=1)
            
            return mfcc_mean
            
        except Exception as e:
            print(f"Error processing audio: {e}")
            return None

    def compare_voices(self, reference_path, user_path):
        """Compare two voice recordings"""
        try:
            # Get features for both audio files
            ref_features = self.process_audio(reference_path)
            user_features = self.process_audio(user_path)
            
            if ref_features is None or user_features is None:
                return 0.0

            # Calculate similarity
            similarity = np.dot(ref_features, user_features) / (
                np.linalg.norm(ref_features) * np.linalg.norm(user_features)
            )
            
            return float(similarity)
            
        except Exception as e:
            print(f"Error comparing voices: {e}")
            return 0.0

    def verify_voice(self, reference_path, user_path):
        """Verify if the voices match"""
        similarity = self.compare_voices(reference_path, user_path)
        is_match = similarity >= self.threshold
        return is_match, similarity