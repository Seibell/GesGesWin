import serial
import time
from datetime import datetime

ser = serial.Serial('COM1', 115200)

leaderboard = []

def update_leaderboard(device_id, name, score):
    timestamp = datetime.now()
    leaderboard.append((score, timestamp, device_id, name)) # No pagination 
    leaderboard.sort(key=lambda x: (x[0], x[1]), reverse=True) 

def print_leaderboard():
    print("Leaderboard:")
    for score, timestamp, device_id, name in leaderboard:
        print(f"Device {device_id}, {name}: {score}, Timestamp: {timestamp}")

while True:
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8').rstrip()
        print(f"Received: {line}") # Debug
        
        try:
            parts = line.split(',')
            device_id = parts[0].split(':')[1]
            player_name = parts[1].split(':')[1]
            player_score = int(parts[2].split(':')[1])
            
            update_leaderboard(device_id, player_name, player_score)
            print_leaderboard()
        except ValueError as e:
            print(f"Error parsing line: {line}. Error: {e}")
