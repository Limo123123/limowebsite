import sys
from py_apps.package_manager import install_app, uninstall_app, list_apps

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 py_apps.py [install/uninstall/list] [app_name]")
        return

    command = sys.argv[1]

    if command == "install" and len(sys.argv) == 3:
        install_app(sys.argv[2])
    elif command == "uninstall" and len(sys.argv) == 3:
        uninstall_app(sys.argv[2])
    elif command == "list":
        list_apps()
    else:
        print("Invalid command. Use: install, uninstall, or list.")

if __name__ == "__main__":
    main()
