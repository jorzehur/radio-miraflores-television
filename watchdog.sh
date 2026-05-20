#!/bin/bash
cd /home/z/my-project
while true; do
  if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "[$(date)] Server down, restarting..." >> /home/z/my-project/watchdog.log
    pkill -f "next dev" 2>/dev/null
    sleep 2
    npx next dev -p 3000 >> /home/z/my-project/dev.log 2>&1 &
    sleep 10
  fi
  sleep 15
done
