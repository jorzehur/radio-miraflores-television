#!/bin/bash
# Keep-alive script para Radio Miraflores TV
# Reinicia el servidor Next.js si se cae
cd /home/z/my-project/.next/standalone
while true; do
  if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "[$(date)] Reiniciando servidor..." >> /home/z/my-project/watchdog.log
    pkill -f "bun server.js" 2>/dev/null
    sleep 2
    PORT=3000 HOSTNAME=0.0.0.0 nohup bun server.js >> /home/z/my-project/server.log 2>&1 &
    sleep 10
  fi
  sleep 30
done
