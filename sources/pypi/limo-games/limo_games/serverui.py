import os
import sys
import zipfile
import urllib.request
import subprocess
import threading
import http.server
import socketserver
import tkinter as tk
from tkinter import ttk, messagebox

# Konfiguration
URL = "https://github.com/Limo123123/limowebserverinstaller/releases/download/4.0/html.zip"
ZIP_FILE = "html.zip"
FOLDER = "html"
WEBSITE = "html/html/"
PORT = 80
server_process = None

def download_progress_hook(count, block_size, total_size):
    downloaded = count * block_size
    percent = min(100, downloaded * 100 / total_size)
    progress_var.set(percent)
    progress_label.config(text=f"{percent:.2f}% heruntergeladen")
    root.update_idletasks()

def download_and_extract():
    if not os.path.exists(ZIP_FILE):
        log("Lade die Datei herunter...")
        urllib.request.urlretrieve(URL, ZIP_FILE, reporthook=download_progress_hook)
        log("Download abgeschlossen.")
    
    if not os.path.exists(FOLDER):
        log("Entpacke die Website...")
        with zipfile.ZipFile(ZIP_FILE, 'r') as zip_ref:
            zip_ref.extractall(FOLDER)
        log("Entpacken abgeschlossen.")

def start_server():
    global server_process
    if not os.path.exists(WEBSITE):
        messagebox.showerror("Fehler", f"Ordner '{WEBSITE}' existiert nicht.")
        return
    log(f"Starte Webserver auf Port {PORT}...")
    server_process = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--directory", WEBSITE])
    start_btn.config(state=tk.DISABLED)
    stop_btn.config(state=tk.NORMAL)
    log("Webserver läuft!")

def stop_server():
    global server_process
    if server_process:
        server_process.terminate()
        server_process.wait()
        server_process = None
        log("Webserver gestoppt.")
    start_btn.config(state=tk.NORMAL)
    stop_btn.config(state=tk.DISABLED)

def log(message):
    log_text.insert(tk.END, message + "\n")
    log_text.see(tk.END)

def on_close():
    stop_server()
    root.destroy()

# UI Setup
root = tk.Tk()
root.title("Webserver UI")
root.geometry("500x400")

progress_var = tk.DoubleVar()
progress_bar = ttk.Progressbar(root, variable=progress_var, maximum=100, length=300)
progress_bar.pack(pady=10)

progress_label = tk.Label(root, text="0.00% heruntergeladen")
progress_label.pack()

download_btn = ttk.Button(root, text="Download & Entpacken", command=lambda: threading.Thread(target=download_and_extract, daemon=True).start())
download_btn.pack(pady=5)

start_btn = ttk.Button(root, text="Webserver Starten", command=start_server)
start_btn.pack(pady=5)

stop_btn = ttk.Button(root, text="Webserver Stoppen", command=stop_server, state=tk.DISABLED)
stop_btn.pack(pady=5)

log_text = tk.Text(root, height=10, width=60)
log_text.pack(pady=10)

root.protocol("WM_DELETE_WINDOW", on_close)
root.mainloop()
