#!/bin/bash
echo "Starting bot update..."

# Hapus semua file pasha*.zip lama
rm -f pasha*.zip

# Download dengan nama tetap
wget -O pasha.zip "https://github.com/pashaba/pasha/archive/refs/heads/main.zip"

# Lanjut unzip seperti biasa...
unzip -o pasha.zip -d temp-update
# ...rest of the script
