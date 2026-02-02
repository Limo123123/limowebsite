import os
import platform
import subprocess
import sys
import tempfile
import re

PI_APPS_DIR = os.path.expanduser("~/pi-apps/apps/")
PI_APPS_API = "https://raw.githubusercontent.com/Botspot/pi-apps/refs/heads/master/api"
LOCAL_API_FILE = os.path.expanduser("~/pi-apps/api")

def download_api():
    """Downloads the Pi-Apps API file if it's missing."""
    if not os.path.exists(LOCAL_API_FILE):
        print("📥 Downloading Pi-Apps API file...")
        try:
            subprocess.run(["wget", "-qO", LOCAL_API_FILE, PI_APPS_API], check=True)
            print("✅ Pi-Apps API downloaded successfully!")
        except subprocess.CalledProcessError:
            print("❌ Failed to download Pi-Apps API. Exiting.")
            sys.exit(1)

def check_apps_folder():
    """Ensure the ~/pi-apps/apps/ folder exists."""
    if not os.path.exists(PI_APPS_DIR):
        print("⚠️ The 'pi-apps' folder is missing! Please place it in your home directory.")
        sys.exit(1)

def get_system_arch():
    """Detects if the system is 64-bit or 32-bit, returning '64' or '32'."""
    arch = platform.architecture()[0]
    if "64" in arch:
        return "64"
    else:
        return "32"


def sanitize_name(name):
    """Converts app name to a lowercase, no-space format for packagename."""
    return re.sub(r'\W+', '', name).lower()

def find_install_script(app_name):
    """Finds the correct install script (install-64, install-32, or install)."""
    app_dir = os.path.join(PI_APPS_DIR, app_name)
    
    if not os.path.exists(app_dir):
        print(f"❌ App folder not found: {app_dir}")
        return None
    
    # Get list of files
    files = os.listdir(app_dir)

    # Debug print
    print(f"📂 Checking install scripts in: {app_dir}")
    print(f"   Found files: {files}")

    # Prioritize architecture-specific scripts
    arch = get_system_arch()
    if f"install-{arch}" in files:
        return os.path.join(app_dir, f"install-{arch}")

    # Fallback to generic "install" script
    if "install" in files:
        return os.path.join(app_dir, "install")

    print(f"❌ No install script found for {app_name}.")
    return None

def find_uninstall_script(app_name):
    """Finds the uninstall script if it exists."""
    script_path = os.path.join(PI_APPS_DIR, app_name, "uninstall")
    return script_path if os.path.exists(script_path) else None

def run_script_with_api(app_name, script_path):
    """Combines the API and the script into a temporary file and executes it with required variables."""
    check_apps_folder()
    download_api()  # Ensure API is downloaded

    package_name = sanitize_name(app_name)  # Convert to lowercase, no spaces
    package_version = "1.0.0"  # Default version (Pi-Apps doesn't store versions)
    package_arch = get_system_arch()

    with open(LOCAL_API_FILE, "r") as api_file, open(script_path, "r") as script_file:
        api_content = api_file.read()
        script_content = script_file.read()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".sh") as temp_script:
        temp_script.write(f"#!/bin/bash\n\n".encode())  # Shebang for safety
        temp_script.write(f"export DIRECTORY={os.path.expanduser('~/pi-apps')}\n".encode())
        temp_script.write(f"export app='{app_name}'\n".encode())
        temp_script.write(f"export packagename='{package_name}'\n".encode())
        temp_script.write(f"export package_name='{package_name}'\n".encode())
        temp_script.write(f"export packageversion='{package_version}'\n".encode())
        temp_script.write(f"export package_version='{package_version}'\n".encode())
        temp_script.write(f"export packagearch='{package_arch}'\n".encode())
        temp_script.write(api_content.encode())  # Add the API
        temp_script.write("\n".encode())
        temp_script.write(script_content.encode())  # Add the install script
        temp_script_path = temp_script.name

    os.chmod(temp_script_path, 0o755)  # Make the script executable

    try:
        subprocess.run(["bash", temp_script_path], check=True)
    except subprocess.CalledProcessError:
        print(f"❌ Error executing {script_path}.")
    finally:
        os.remove(temp_script_path)  # Cleanup

def install_app(app_name):
    """Executes the Pi-Apps install script with API and necessary variables."""
    script_path = find_install_script(app_name)

    if script_path:
        print(f"📦 Installing {app_name}...")
        run_script_with_api(app_name, script_path)
        print(f"✅ {app_name} installed successfully!")
    else:
        print(f"❌ No install script found for {app_name}. Cannot proceed.")

def uninstall_app(app_name):
    """Executes the Pi-Apps uninstall script with API and necessary variables."""
    script_path = find_uninstall_script(app_name)

    if script_path:
        print(f"🗑️ Uninstalling {app_name}...")
        run_script_with_api(app_name, script_path)
        print(f"✅ {app_name} removed successfully!")
    else:
        print(f"❌ No uninstall script found for {app_name}. Cannot proceed.")

def list_apps():
    """Lists only valid Pi-Apps applications (those with install or uninstall scripts)."""
    check_apps_folder()

    if not os.path.exists(PI_APPS_DIR):
        print("❌ The 'pi-apps' folder is missing.")
        return

    apps = []
    for app in os.listdir(PI_APPS_DIR):
        app_dir = os.path.join(PI_APPS_DIR, app)
        if os.path.isdir(app_dir):
            has_install = find_install_script(app) is not None
            has_uninstall = find_uninstall_script(app) is not None

            if has_install or has_uninstall:  # Only list apps that can be installed/uninstalled
                apps.append(app)

    if apps:
        print("\n📦 Available Pi-Apps:")
        for app in apps:
            print(f"   ➤ {app}")
    else:
        print("❌ No valid Pi-Apps found.")
