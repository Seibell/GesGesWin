import serial
import tkinter as tk
from datetime import datetime
from threading import Thread

# Setup serial connection
ser = serial.Serial('COM5', 115200)

# Initialize the leaderboard list
leaderboard = []

# Function to update the leaderboard
def update_leaderboard(device_id, name, score):
    timestamp = datetime.now()
    leaderboard.append((score, timestamp, device_id, name))
    leaderboard.sort(key=lambda x: (-x[0], x[1]))  # Sort by score descending, then timestamp
    update_gui_leaderboard()  # Update the GUI with the new leaderboard

# GUI functions and setup
def setup_gui():
    global leaderboard_text
    window = tk.Tk()
    window.title("Leaderboard")
    
    tk.Label(window, text="Leaderboard", font=("Arial", 24)).pack()
    leaderboard_text = tk.Text(window, height=10, width=50)
    leaderboard_text.pack()
    
    # Function to continuously update the GUI
    def update_gui_leaderboard():
        leaderboard_text.delete(1.0, tk.END)  # Clear existing text
        text = "\n".join([f"{name}: {score} (Device {device_id}, Time: {timestamp})" for score, timestamp, device_id, name in leaderboard])
        leaderboard_text.insert(tk.END, text)  # Insert new leaderboard text
    
    window.mainloop()

# Listening for incoming data from the micro:bit
def listen_serial():
    print("Listening for incoming data...")
    while True:
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').rstrip()
            print(f"Received: {line}")  # Debug output to terminal
            
            if line.startswith("GAMEEND"):
                try:
                    parts = line.split(',')
                    device_id = parts[1].split(':')[1]
                    player_name = parts[2].split(':')[1]
                    player_score = int(parts[3].split(':')[1])
                    
                    update_leaderboard(device_id, player_name, player_score)
                except ValueError as e:
                    print(f"Error parsing line: {line}. Error: {e}")
                except Exception as e:
                    print(f"Unknown error: {e}")

# Start the GUI in a separate thread
Thread(target=setup_gui).start()

# Start listening to serial data
listen_serial()
