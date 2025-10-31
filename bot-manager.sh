#!/bin/bash
cd /root/pasha

case $1 in
    "update")
        echo "🔄 Updating bot..."
        rm -f pasha*.zip
        curl -L -o pasha.zip "https://github.com/pashaba/pasha/archive/refs/heads/main.zip"
        unzip -o pasha.zip -d temp-update
        cp -r temp-update/pasha-main/* ./
        npm install
        pm2 restart pasha-bot
        rm -rf temp-update pasha.zip
        echo "✅ Update success!"
        ;;
    "clear-session")
        echo "🧹 Clearing session..."
        rm -rf session/
        pm2 restart pasha-bot
        echo "✅ Session cleared! Scan QR code again."
        ;;
    *)
        echo "Usage: ./bot-manager.sh [update|clear-session]"
        ;;
esac
