import serial
import tkinter as tk
from datetime import datetime

# Setup serial connection
ser = serial.Serial('COM5', 115200)

leaderboard = []
temp_data = {}

def update_gui_leaderboard(leaderboard_text):
    # Clear existing text
    leaderboard_text.delete(1.0, tk.END)
    # Header
    header = "Name\tScore\tID\tTime\n"
    header += "-" * 50 + "\n" 
    text = header
    text += "\n".join([f"{item['NAME']}\t{item['SCORE']}\t{item['ID']}\t{item['timestamp'].strftime('%Y-%m-%d %H:%M:%S')}" for item in leaderboard])
    # Insert new leaderboard text
    leaderboard_text.insert(tk.END, text)

def update_leaderboard(temp_data, leaderboard_text):
    global leaderboard
    # Append to leaderboard and sort
    leaderboard.append(temp_data.copy())  # Make a copy to avoid overwriting
    leaderboard.sort(key=lambda x: (-int(x['SCORE']), -x['timestamp'].timestamp()))
    # Update the GUI
    update_gui_leaderboard(leaderboard_text)
    # Reset temp_data for the next game data
    temp_data.clear()

def setup_gui():
    window = tk.Tk()
    window.title("Leaderboard")
    
    tk.Label(window, text="Leaderboard", font=("Arial", 24)).pack()
    leaderboard_text = tk.Text(window, height=10, width=50)
    leaderboard_text.pack()

    def listen_serial():
        global temp_data
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').rstrip()
            print(f"Received: {line}")  # Debug output to terminal
            
            if line == "END" or line == "END_SIM":
                temp_data = {}  # Reset when a game ends, preparing for new game data
            elif "ID:" in line:
                temp_data['ID'] = line.split(':')[1]
            elif "NAME:" in line:
                temp_data['NAME'] = line.split(':')[1]
            elif "SCORE:" in line:
                temp_data['SCORE'] = line.split(':')[1]
                temp_data['timestamp'] = datetime.now()
                if 'ID' in temp_data and 'NAME' in temp_data and 'SCORE' in temp_data:
                    update_leaderboard(temp_data, leaderboard_text)

        window.after(100, listen_serial)  # Schedule the next check

    listen_serial()
    window.mainloop()

def show_splash_screen():
    splash_root = tk.Tk()
    splash_root.title("Loading...")
    w = 300
    h = 200
    ws = splash_root.winfo_screenwidth()
    hs = splash_root.winfo_screenheight()
    x = (ws/2) - (w/2)
    y = (hs/2) - (h/2)
    splash_root.geometry('%dx%d+%d+%d' % (w, h, x, y))
    
    tk.Label(splash_root, text="Welcome to the Leaderboard", font=("Arial", 16)).pack(expand=True)
    splash_root.after(3000, splash_root.destroy)
    
    splash_root.mainloop()

if __name__ == "__main__":
    show_splash_screen()
    setup_gui()
