#!/bin/bash
cd /home/z/my-project
while true; do
    node node_modules/.bin/next start -p 3000
    echo "[$(date)] Server exited, restarting in 3s..." >> /tmp/server-watchdog.log
    sleep 3
done
