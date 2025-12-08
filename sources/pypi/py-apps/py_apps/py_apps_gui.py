import tkinter as tk
from tkinter import messagebox
from py_apps.package_manager import install_app, uninstall_app, list_apps

class AppManagerGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("App Manager")

        # Create and place widgets
        self.command_label = tk.Label(root, text="Enter Command (install/uninstall/list):")
        self.command_label.grid(row=0, column=0, padx=10, pady=10)

        self.command_entry = tk.Entry(root)
        self.command_entry.grid(row=0, column=1, padx=10, pady=10)

        self.app_name_label = tk.Label(root, text="App Name (for install/uninstall):")
        self.app_name_label.grid(row=1, column=0, padx=10, pady=10)

        self.app_name_entry = tk.Entry(root)
        self.app_name_entry.grid(row=1, column=1, padx=10, pady=10)

        self.run_button = tk.Button(root, text="Run Command", command=self.run_command)
        self.run_button.grid(row=2, column=0, columnspan=2, pady=10)

        self.output_text = tk.Text(root, height=10, width=50, wrap=tk.WORD)
        self.output_text.grid(row=3, column=0, columnspan=2, padx=10, pady=10)

    def run_command(self):
        command = self.command_entry.get()
        app_name = self.app_name_entry.get()

        # Clear previous output
        self.output_text.delete(1.0, tk.END)

        if command == "install" and app_name:
            result = install_app(app_name)
            self.output_text.insert(tk.END, f"Installing {app_name}...\n{result}\n")
        elif command == "uninstall" and app_name:
            result = uninstall_app(app_name)
            self.output_text.insert(tk.END, f"Uninstalling {app_name}...\n{result}\n")
        elif command == "list":
            result = list_apps()
            self.output_text.insert(tk.END, f"Installed Apps:\n{result}\n")
        else:
            messagebox.showerror("Error", "Invalid command or missing app name.")
            self.output_text.insert(tk.END, "Invalid command or missing app name.\n")


if __name__ == "__main__":
    root = tk.Tk()
    app = AppManagerGUI(root)
    root.mainloop()
