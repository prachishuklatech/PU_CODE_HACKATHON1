import os
from voice_compare import VoiceAuthenticator
import sounddevice as sd
import soundfile as sf
import numpy as np
import wave
from datetime import datetime

class VoiceAuthTester:
    def __init__(self):
        self.sample_rate = 22050
        self.duration = 3  # seconds
        self.test_dir = "test_audio"
        self.authenticator = VoiceAuthenticator(threshold=0.85)
        
    def record_audio(self, filename):
        """Record audio from microphone"""
        print(f"\nRecording {filename} for {self.duration} seconds...")
        print("Speak now...")
        
        # Record audio
        recording = sd.rec(
            int(self.duration * self.sample_rate),
            samplerate=self.sample_rate,
            channels=1
        )
        sd.wait()  # Wait until recording is finished
        
        # Save as WAV file
        sf.write(filename, recording, self.sample_rate)
        print(f"Recording saved to {filename}")
        
    def test_with_live_recordings(self):
        """Test voice authentication with live recordings"""
        print("Starting Voice Authenticator test with live recordings...")
        
        # Create test directory
        os.makedirs(self.test_dir, exist_ok=True)
        
        try:
            # Record reference voice
            reference_file = os.path.join(self.test_dir, "reference_voice.wav")
            print("\nFirst, let's record your reference voice sample.")
            self.record_audio(reference_file)
            
            # Test 1: Same person, different recording
            print("\nTest 1: Let's verify with your voice again...")
            test_file1 = os.path.join(self.test_dir, "test_voice_same.wav")
            self.record_audio(test_file1)
            
            is_match, similarity = self.authenticator.verify_voice(reference_file, test_file1)
            print(f"Same person verification - Match: {is_match}, Similarity: {similarity:.2f}")
            
            # Test 2: Different person or different sound
            print("\nTest 2: Now let's test with a different voice/sound...")
            test_file2 = os.path.join(self.test_dir, "test_voice_different.wav")
            self.record_audio(test_file2)
            
            is_match, similarity = self.authenticator.verify_voice(reference_file, test_file2)
            print(f"Different voice verification - Match: {is_match}, Similarity: {similarity:.2f}")
            
            # Test 3: Compare same recording
            print("\nTest 3: Comparing reference with itself (should be 1.0)...")
            is_match, similarity = self.authenticator.verify_voice(reference_file, reference_file)
            print(f"Self comparison - Match: {is_match}, Similarity: {similarity:.2f}")
            
        except Exception as e:
            print(f"Error during testing: {e}")
        
        print("\nTests completed!")
        print(f"You can find the test recordings in the '{self.test_dir}' directory")
    
    def test_with_existing_files(self, reference_path, test_path):
        """Test voice authentication with existing audio files"""
        print(f"\nTesting with existing audio files:")
        print(f"Reference: {reference_path}")
        print(f"Test file: {test_path}")
        
        try:
            is_match, similarity = self.authenticator.verify_voice(reference_path, test_path)
            print(f"Verification result - Match: {is_match}, Similarity: {similarity:.2f}")
        except Exception as e:
            print(f"Error during testing: {e}")

if __name__ == "__main__":
    tester = VoiceAuthTester()
    
    while True:
        print("\nVoice Authentication Testing Menu:")
        print("1. Run live recording test")
        print("2. Test with existing audio files")
        print("3. Exit")
        
        choice = input("Enter your choice (1-3): ")
        
        if choice == "1":
            tester.test_with_live_recordings()
        elif choice == "2":
            ref_path = input("Enter path to reference audio file: ")
            test_path = input("Enter path to test audio file: ")
            tester.test_with_existing_files(ref_path, test_path)
        elif choice == "3":
            print("Exiting...")
            break
        else:
            print("Invalid choice. Please try again.")