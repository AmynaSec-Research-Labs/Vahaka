#!/bin/bash

echo -e "
                                                                                         ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣶⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
                                                                                         ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
                                                                                         ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
                     /\$\$    /\$\$  /\$\$\$\$\$\$  /\$\$   /\$\$  /\$\$\$\$\$\$  /\$\$   /\$\$  /\$\$\$\$\$\$         ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⣠⡀⠀⠀⠀⠀⠀⠀⠀⠀ 
                    | \$\$   | \$\$ /\$\$__  \$\$| \$\$  | \$\$ /\$\$__  \$\$| \$\$  /\$\$/ /\$\$__  \$\$        ⠀⠀⠀⠀⣤⡶⠶⠶⠦⣤⣤⣤⣤⣤⣴⡄⠀⠀⠀⠀⢿⣿⣦⡀⠀⠀⠀⠀⠀⠀ 
                    | \$\$   | \$\$| \$\$  \ \$\$| \$\$  | \$\$| \$\$  \ \$\$| \$\$ /\$\$/ | \$\$  \ \$\$     ⠀⠀⠀⢀⣠⣤⣴⣶⣤⣤⡀⢈⡉⠛⠻⠿⠀⠀⠀⠀⢸⣿⣿⣷⠀⣀⠻⠇⠀⠀ 
                    |  \$\$ / \$\$/| \$\$\$\$\$\$\$\$| \$\$\$\$\$\$\$\$| \$\$\$\$\$\$\$\$| \$\$\$\$\$/  | \$\$\$\$\$\$\$\$        ⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⠀⣿⣿⠀⠀⠀⠀⠀⠀⢸⣿⣿⠏⢰⣿⣷⣦⠀⠀ 
                     \  \$\$ \$\$/ | \$\$__  \$\$| \$\$__  \$\$| \$\$__  \$\$| \$\$  \$\$  | \$\$__  \$\$       ⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⠟⢀⣿⣿⣄⠀⠀⠀⠀⠀⣸⣿⠏⠀⠛⣉⣉⠁⠀⠀ 
                      \  \$\$\$/  | \$\$  | \$\$| \$\$  | \$\$| \$\$  | \$\$| \$\$\  \$\$ | \$\$  | \$\$      ⠀⢠⡄⠠⢤⣤⣤⡤⠤⠤⠄⠸⣿⣿⣿⣿⣶⣶⣶⡾⠟⠁⣠⠖⣧⣤⡿⢿⡄⠀ 
                       \  \$/   | \$\$  | \$\$| \$\$  | \$\$| \$\$  | \$\$| \$\$ \  \$\$| \$\$  | \$\$      ⠀⢸⣷⠶⣤⡤⢤⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡶⢿⣤⠷⣾⡇⠀
                        \_/    |__/  |__/|__/  |__/|__/  |__/|__/  \__/|__/  |__/      ⠀⠀⠙⢷⣿⣶⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣶⣿⡾⠛⠀
"

echo -e "\nInstalling VAHAKA by Amynasec Labs\n"
``
echo -e "Scanning for prerequisites...\n"

if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo -e "NodeJS or NPM not found. Installing them...\n"
    sudo apt update && sudo apt install -y nodejs npm > /dev/null 2>&1
fi

if ! command -v node &> /dev/null; then
    echo -e "\nError: NodeJS installation failed. Exiting."
    exit
fi

APP_NAME="vahaka"
INSTALL_DIR="$HOME/.$APP_NAME"
BIN_DIR="/usr/bin"
REPO_URL="https://github.com/AmynaSec-Research-Labs/Vahaka.git"

if [ -d "$INSTALL_DIR" ]; then
    echo -e "Removing existing installation...\n"
    sudo rm -rf "$INSTALL_DIR"
fi

echo -e "Cloning the repository..."

git clone "$REPO_URL" "$INSTALL_DIR" > /dev/null 2>&1

echo -e "\nInstalling NPM dependencies..."

cd "$INSTALL_DIR"
npm install --production > /dev/null 2>&1

echo -e "\nAdding the symlink..."

sudo ln -sf "$INSTALL_DIR/vahaka" "$BIN_DIR/$APP_NAME"
sudo chmod +x "$INSTALL_DIR/vahaka"

if [ ! -L "$BIN_DIR/$APP_NAME" ]; then
    echo -e "\nError: Failed to create symlink for Vahaka. Exiting."
    exit 1
fi

echo -e "\nInstallation complete. Run '$APP_NAME' to start the server."
echo -e "\nHack away with Vahaka."
echo -e "- Amynasec Labs"
