#!/usr/bin/env python3
"""
Test script for Whisper API server
"""

import requests
import time
import sys

API_BASE_URL = "http://localhost:5000/api/whisper"

def test_health_endpoint():
    """Test the health endpoint"""
    try:
        print("Testing health endpoint...")
        response = requests.get(f"{API_BASE_URL}/health", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Health check passed!")
            print(f"Status: {data.get('status')}")
            print(f"Device: {data.get('device_info', {}).get('device')}")
            print(f"CUDA Available: {data.get('device_info', {}).get('cuda_available')}")
            return True
        else:
            print(f"❌ Health check failed with status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_models_endpoint():
    """Test the models endpoint"""
    try:
        print("\nTesting models endpoint...")
        response = requests.get(f"{API_BASE_URL}/models", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Models endpoint working!")
            print(f"Current model: {data.get('current_model')}")
            print(f"Available models: {len(data.get('available_models', []))}")
            return True
        else:
            print(f"❌ Models endpoint failed with status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Models endpoint failed: {e}")
        return False

def wait_for_server(max_wait=300):
    """Wait for server to be ready"""
    print(f"Waiting for server to be ready (max {max_wait} seconds)...")
    
    for i in range(max_wait):
        try:
            response = requests.get(f"{API_BASE_URL}/health", timeout=5)
            if response.status_code == 200:
                print(f"✅ Server is ready after {i} seconds!")
                return True
        except:
            pass
        
        if i % 30 == 0 and i > 0:
            print(f"Still waiting... ({i}/{max_wait} seconds)")
        
        time.sleep(1)
    
    print(f"❌ Server not ready after {max_wait} seconds")
    return False

def main():
    print("🚀 Whisper API Server Test")
    print("=" * 40)
    
    # Wait for server to be ready
    if not wait_for_server():
        print("\n❌ Server is not responding. Please check:")
        print("1. Server is running: python src/main.py")
        print("2. No firewall blocking port 5000")
        print("3. Whisper model is loading (first run takes time)")
        sys.exit(1)
    
    # Run tests
    health_ok = test_health_endpoint()
    models_ok = test_models_endpoint()
    
    print("\n" + "=" * 40)
    if health_ok and models_ok:
        print("✅ All tests passed! Server is ready for use.")
        print("\nNext steps:")
        print("1. Update React Native app API URL if needed")
        print("2. Test audio transcription with the mobile app")
    else:
        print("❌ Some tests failed. Check server logs for errors.")
        sys.exit(1)

if __name__ == "__main__":
    main()

