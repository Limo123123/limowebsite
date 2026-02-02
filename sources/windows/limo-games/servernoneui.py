import argparse
import os
import subprocess
import http.server
import socketserver
import urllib.request
import zipfile
import sys

# Konfiguration
URL = "https://github.com/Limo123123/limowebserverinstaller/releases/download/4.0/html.zip"  # Setze die echte URL hier ein
ZIP_FILE = "html.zip"
FOLDER = "html"
WEBSITE = "html/html/"
PORT = 80

def download_progress_hook(count, block_size, total_size):
    """Zeigt den Fortschritt des Downloads als Ladebalken an."""
    downloaded = count * block_size
    percent = min(100, downloaded * 100 / total_size)
    bar_length = 40  # Länge der Fortschrittsanzeige
    filled_length = int(bar_length * percent / 100)
    bar = "█" * filled_length + "-" * (bar_length - filled_length)
    print(f"\r[{bar}] {percent:.2f}%", end="")
    if downloaded >= total_size:
        print()

def download_and_extract():
    """Lädt die ZIP-Datei herunter und entpackt sie, falls nötig."""
    if not os.path.exists(ZIP_FILE):
        print(f"Die Datei {ZIP_FILE} existiert nicht. Herunterladen?")
        if input("[Ja/Nein]: ").strip().lower() != "ja":
            print("Abgebrochen.")
            return False

        print("Lade die Datei herunter...")
        urllib.request.urlretrieve(URL, ZIP_FILE, reporthook=download_progress_hook)
        print("\nDownload abgeschlossen.")

    if not os.path.exists(FOLDER):
        print("Entpacke die Website...")
        with zipfile.ZipFile(ZIP_FILE, 'r') as zip_ref:
            zip_ref.extractall(FOLDER)
        print("Entpacken abgeschlossen.")

    return True

class SilentHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Eigener HTTP-Request-Handler ohne Logging."""
    def log_message(self, format, *args):
        pass  # Unterdrückt alle Log-Ausgaben

def start_server():
    """Startet einen einfachen HTTP-Server im `FOLDER`-Verzeichnis."""
    if not os.path.exists(FOLDER):
        print(f"Fehler: Ordner '{FOLDER}' existiert nicht.")
        sys.exit(1)
    
    if not os.path.exists(WEBSITE):
        print(f"Fehler: Ordner '{WEBSITE}' existiert nicht.")
        sys.exit(1)

    os.chdir(WEBSITE)  # Wechsle in das entpackte Website-Verzeichnis
    handler = SilentHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Webserver läuft auf http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer wird gestoppt...")
            httpd.server_close()

def main():
    """Hauptfunktion mit Argumenten für Vordergrund- und Hintergrundmodus."""
    parser = argparse.ArgumentParser(description="Einfacher Webserver")
    parser.add_argument("-b", "--background", action="store_true", help="Starte im Hintergrund")
    args = parser.parse_args()

    if not os.path.exists(FOLDER) and not download_and_extract():
        sys.exit(1)

    if args.background:
        print("Starte Webserver im Hintergrund...")
        subprocess.Popen([sys.executable, __file__])
        sys.exit(0)
    else:
        start_server()

if __name__ == "__main__":
    main()
