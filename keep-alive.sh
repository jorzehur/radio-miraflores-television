#!/bin/bash
while true; do
  if ! curl -s -m 3 http://localhost:3000 > /dev/null 2>&1; then
    echo "[$(date)] Reiniciando..." >> /home/z/my-project/watchdog.log
    pkill -f "node server.js" 2>/dev/null
    sleep 2
    cd /home/z/my-project/.next/standalone && PORT=3000 HOSTNAME=0.0.0.0 nohup node server.js >> /home/z/my-project/server.log 2>&1 &
    sleep 6
  fi
  sleep 10
done
